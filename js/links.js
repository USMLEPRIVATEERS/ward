/* ============================================================================
   WARD ACADEMY - LINKS PAGE LOGIC
   ============================================================================ */

// State
let currentUser = null;
let allLinks = [];
let currentFilter = 'all';
let searchTerm = '';
let currentLinkId = null;

// Initialize Links Page
document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    currentUser = requireAuth();
    if (!currentUser) return;

    // Initialize page
    await initLinks();

    // Setup event listeners
    setupEventListeners();

    // Update diary links visibility
    updateDiaryLinks();
});

// Initialize links
async function initLinks() {
    try {
        // Load links from database
        await loadLinks();

    } catch (error) {
        console.error('Error initializing links:', error);
        showError('Erro ao carregar links. Tente recarregar a página.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add link button
    document.getElementById('addLinkBtn').addEventListener('click', () => {
        openLinkModal();
    });

    // Filter buttons
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.category;
            displayLinks();
        });
    });

    // Search input
    document.getElementById('searchInput').addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        displayLinks();
    });
}

// Load links from database
async function loadLinks() {
    const sb = initSupabase();

    try {
        const { data, error } = await sb
            .from('links')
            .select(`
                *,
                added_by_user:users!links_added_by_fkey(name)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        allLinks = data || [];
        displayLinks();

    } catch (error) {
        console.error('Error loading links:', error);
        document.getElementById('linksContainer').innerHTML =
            '<div class="empty-state"><div class="icon">⚠️</div><h3>Erro ao carregar links</h3><p>Tente recarregar a página.</p></div>';
    }
}

// Display links
function displayLinks() {
    const container = document.getElementById('linksContainer');

    // Filter by category
    let filteredLinks = currentFilter === 'all'
        ? allLinks
        : allLinks.filter(link => link.category === currentFilter);

    // Filter by search term
    if (searchTerm) {
        filteredLinks = filteredLinks.filter(link =>
            link.title.toLowerCase().includes(searchTerm) ||
            (link.description && link.description.toLowerCase().includes(searchTerm)) ||
            link.url.toLowerCase().includes(searchTerm)
        );
    }

    // Check if empty
    if (filteredLinks.length === 0) {
        if (searchTerm || currentFilter !== 'all') {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🔍</div>
                    <h3>Nenhum link encontrado</h3>
                    <p>Tente ajustar os filtros ou a busca.</p>
                </div>
            `;
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="icon">🔗</div>
                    <h3>Nenhum link cadastrado ainda</h3>
                    <p>Seja o primeiro a adicionar um link útil!</p>
                </div>
            `;
        }
        return;
    }

    // Category labels
    const categoryLabels = {
        step1: 'Step 1',
        step2ck: 'Step 2 CK',
        step3: 'Step 3',
        oet: 'OET',
        research: 'Pesquisa'
    };

    // Render links
    container.innerHTML = filteredLinks.map(link => `
        <div class="link-card">
            <div class="link-header">
                <h3>
                    <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">
                        ${escapeHtml(link.title)}
                    </a>
                </h3>
                <span class="link-category badge-${link.category}">
                    ${categoryLabels[link.category] || link.category}
                </span>
            </div>

            ${link.description ? `
                <p class="link-description">${escapeHtml(link.description)}</p>
            ` : ''}

            <div class="link-meta">
                <span class="link-meta-item">
                    👤 ${link.added_by_user?.name || 'Desconhecido'}
                </span>
                <span class="link-meta-item">
                    📅 ${formatDate(link.created_at)}
                </span>
            </div>

            <div class="link-footer">
                <a href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer" class="link-url">
                    ${escapeHtml(link.url)}
                </a>
                <div class="link-actions">
                    <button class="btn-icon" onclick="editLink('${link.id}')" title="Editar">
                        ✏️
                    </button>
                    <button class="btn-icon" onclick="deleteLink('${link.id}')" title="Deletar">
                        🗑️
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Open link modal
function openLinkModal(linkId = null) {
    currentLinkId = linkId;
    const modal = document.getElementById('linkModal');
    const form = document.getElementById('linkForm');

    if (linkId) {
        // Edit mode
        document.getElementById('modalTitle').textContent = 'Editar Link';
        const link = allLinks.find(l => l.id === linkId);
        if (link) {
            document.getElementById('linkTitle').value = link.title;
            document.getElementById('linkUrl').value = link.url;
            document.getElementById('linkDescription').value = link.description || '';
            document.getElementById('linkCategory').value = link.category;
        }
    } else {
        // Add mode
        document.getElementById('modalTitle').textContent = 'Adicionar Link';
        form.reset();
    }

    modal.style.display = 'flex';
}

// Close link modal
function closeLinkModal() {
    const modal = document.getElementById('linkModal');
    modal.style.display = 'none';
    currentLinkId = null;
}

// Save link form
async function saveLinkForm() {
    const title = document.getElementById('linkTitle').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    const description = document.getElementById('linkDescription').value.trim();
    const category = document.getElementById('linkCategory').value;

    // Validation
    if (!title || !url || !description || !category) {
        showError('Por favor, preencha todos os campos obrigatórios.');
        return;
    }

    // Validate URL format
    try {
        new URL(url);
    } catch (e) {
        showError('Por favor, insira uma URL válida (ex: https://exemplo.com)');
        return;
    }

    const sb = initSupabase();

    try {
        if (currentLinkId) {
            // Update existing link
            const { error } = await sb
                .from('links')
                .update({
                    title,
                    url,
                    description,
                    category,
                    updated_at: new Date().toISOString()
                })
                .eq('id', currentLinkId);

            if (error) throw error;

            showSuccess('Link atualizado com sucesso!');
        } else {
            // Create new link
            const { error } = await sb
                .from('links')
                .insert({
                    title,
                    url,
                    description,
                    category,
                    added_by: currentUser.id,
                    created_at: new Date().toISOString()
                });

            if (error) throw error;

            showSuccess('Link adicionado com sucesso!');
        }

        closeLinkModal();
        setTimeout(() => hideSuccess(), 3000);
        await loadLinks();

    } catch (error) {
        console.error('Error saving link:', error);
        showError('Erro ao salvar link. Tente novamente.');
    }
}

// Edit link
function editLink(linkId) {
    openLinkModal(linkId);
}

// Delete link
async function deleteLink(linkId) {
    if (!confirm('Tem certeza que deseja deletar este link?')) {
        return;
    }

    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('links')
            .delete()
            .eq('id', linkId);

        if (error) throw error;

        showSuccess('Link deletado com sucesso!');
        setTimeout(() => hideSuccess(), 3000);
        await loadLinks();

    } catch (error) {
        console.error('Error deleting link:', error);
        showError('Erro ao deletar link. Tente novamente.');
    }
}

// Update diary links visibility
function updateDiaryLinks() {
    const sb = initSupabase();

    sb.from('users')
        .select('diary_study_enabled, diary_uworld_enabled')
        .eq('id', currentUser.id)
        .single()
        .then(({ data }) => {
            if (data) {
                const studyLink = document.getElementById('studyDiaryLink');
                const uworldLink = document.getElementById('uworldDiaryLink');

                if (studyLink) {
                    studyLink.style.display = data.diary_study_enabled ? 'block' : 'none';
                }

                if (uworldLink) {
                    uworldLink.style.display = data.diary_uworld_enabled ? 'block' : 'none';
                }
            }
        })
        .catch(error => {
            console.error('Error loading diary settings:', error);
        });
}

// Utility Functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function showError(message) {
    const banner = document.createElement('div');
    banner.className = 'error-message';
    banner.style.position = 'fixed';
    banner.style.top = '20px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.zIndex = '9999';
    banner.style.maxWidth = '500px';
    banner.textContent = message;
    document.body.appendChild(banner);

    setTimeout(() => {
        banner.remove();
    }, 5000);
}

function showSuccess(message) {
    const banner = document.createElement('div');
    banner.className = 'success-message';
    banner.style.position = 'fixed';
    banner.style.top = '20px';
    banner.style.left = '50%';
    banner.style.transform = 'translateX(-50%)';
    banner.style.zIndex = '9999';
    banner.style.maxWidth = '500px';
    banner.textContent = message;
    document.body.appendChild(banner);

    setTimeout(() => {
        banner.remove();
    }, 3000);
}

function hideSuccess() {
    const banner = document.querySelector('.success-message');
    if (banner) banner.remove();
}

// Make functions globally available
window.openLinkModal = openLinkModal;
window.closeLinkModal = closeLinkModal;
window.saveLinkForm = saveLinkForm;
window.editLink = editLink;
window.deleteLink = deleteLink;
