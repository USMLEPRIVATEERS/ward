/* ============================================================================
   WARD ACADEMY - SCHEDULE PAGE LOGIC
   ============================================================================ */

// State
let currentUser = null;
let allScheduleItems = [];
let searchTerm = '';
let filterStatus = 'all';

// Initialize Schedule Page
document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    currentUser = requireAuth();
    if (!currentUser) return;

    // Initialize page
    await initSchedule();

    // Setup event listeners
    setupEventListeners();

    // Update diary links visibility
    updateDiaryLinks();
});

// Initialize schedule
async function initSchedule() {
    try {
        // Load schedule and delays
        await Promise.all([
            loadSchedule(),
            loadDelays()
        ]);

    } catch (error) {
        console.error('Error initializing schedule:', error);
        showError('Erro ao carregar cronograma. Tente recarregar a página.');
    }
}

// Setup event listeners
function setupEventListeners() {
    // Search input
    document.getElementById('searchSchedule').addEventListener('input', (e) => {
        searchTerm = e.target.value.toLowerCase();
        displaySchedule();
    });

    // Filter select
    document.getElementById('filterCompleted').addEventListener('change', (e) => {
        filterStatus = e.target.value;
        displaySchedule();
    });

    // Report delay button
    document.getElementById('reportDelayBtn').addEventListener('click', () => {
        openDelayModal();
    });
}

// Load schedule from database
async function loadSchedule() {
    const sb = initSupabase();

    try {
        const { data, error } = await sb
            .from('schedules')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('created_at', { ascending: true });

        if (error) throw error;

        allScheduleItems = data || [];
        displaySchedule();
        updateSummary();

    } catch (error) {
        console.error('Error loading schedule:', error);
        document.getElementById('scheduleBody').innerHTML =
            '<tr><td colspan="5" class="error-cell">Erro ao carregar cronograma. Tente recarregar a página.</td></tr>';
    }
}

// Display schedule table
function displaySchedule() {
    const tbody = document.getElementById('scheduleBody');

    // Check if schedule is empty
    if (allScheduleItems.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="no-data-cell">
                    <p>📚 Nenhum cronograma cadastrado ainda.</p>
                    <p>Os mentores irão adicionar seu cronograma personalizado em breve.</p>
                </td>
            </tr>
        `;
        return;
    }

    // Filter items
    let filteredItems = allScheduleItems;

    // Apply search filter
    if (searchTerm) {
        filteredItems = filteredItems.filter(item =>
            item.system_name.toLowerCase().includes(searchTerm) ||
            item.category_name.toLowerCase().includes(searchTerm)
        );
    }

    // Apply status filter
    if (filterStatus !== 'all') {
        filteredItems = filteredItems.filter(item =>
            filterStatus === 'completed' ? item.completed : !item.completed
        );
    }

    // Check if filtered list is empty
    if (filteredItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="no-data-cell">Nenhum item encontrado com os filtros aplicados.</td></tr>';
        return;
    }

    // Render table rows
    tbody.innerHTML = filteredItems.map(item => `
        <tr class="${item.completed ? 'completed-row' : ''}">
            <td><strong>${escapeHtml(item.system_name)}</strong></td>
            <td>${escapeHtml(item.category_name)}</td>
            <td class="text-center">${item.questions || 0}</td>
            <td class="text-center">
                ${item.completed
                    ? '<span class="status-badge completed">✅ Concluído</span>'
                    : '<span class="status-badge pending">⏳ Pendente</span>'}
            </td>
            <td class="text-center">
                <button class="btn btn-sm ${item.completed ? 'btn-secondary' : 'btn-primary'}"
                        onclick="toggleComplete('${item.id}', ${item.completed})">
                    ${item.completed ? '↩️ Desmarcar' : '✓ Concluir'}
                </button>
            </td>
        </tr>
    `).join('');
}

// Toggle complete status
async function toggleComplete(scheduleId, currentlyCompleted) {
    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('schedules')
            .update({
                completed: !currentlyCompleted,
                updated_at: new Date().toISOString()
            })
            .eq('id', scheduleId);

        if (error) throw error;

        // Update local data
        const item = allScheduleItems.find(i => i.id === scheduleId);
        if (item) {
            item.completed = !currentlyCompleted;
        }

        // Refresh display
        displaySchedule();
        updateSummary();

    } catch (error) {
        console.error('Error toggling complete:', error);
        showError('Erro ao atualizar status. Tente novamente.');
    }
}

// Update summary statistics
function updateSummary() {
    const completed = allScheduleItems.filter(i => i.completed).length;
    const total = allScheduleItems.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update progress circle
    document.getElementById('progressPercent').textContent = `${percent}%`;
    document.getElementById('progressText').textContent = `${completed} de ${total} itens concluídos`;

    // Update progress circle visual
    const progressCircle = document.getElementById('progressCircle');
    const degrees = (percent / 100) * 360;
    progressCircle.style.background = `conic-gradient(var(--color-orange) ${degrees}deg, var(--color-gray-light) ${degrees}deg)`;

    // Calculate total questions
    const totalQuestions = allScheduleItems.reduce((sum, i) => sum + (i.questions || 0), 0);
    const completedQuestions = allScheduleItems
        .filter(i => i.completed)
        .reduce((sum, i) => sum + (i.questions || 0), 0);

    document.getElementById('totalQuestions').textContent = totalQuestions.toLocaleString('pt-BR');
    document.getElementById('questionsCompleted').textContent =
        `${completedQuestions.toLocaleString('pt-BR')} questões concluídas`;
}

// Load delays from database
async function loadDelays() {
    const sb = initSupabase();

    try {
        const today = new Date().toISOString().split('T')[0];

        const { data, error } = await sb
            .from('schedule_delays')
            .select('*')
            .eq('user_id', currentUser.id)
            .gte('end_date', today)
            .order('start_date', { ascending: false });

        if (error) throw error;

        displayDelays(data || []);

    } catch (error) {
        console.error('Error loading delays:', error);
    }
}

// Display delays
function displayDelays(delays) {
    const container = document.getElementById('delaysContainer');
    document.getElementById('activeDelays').textContent = delays.length;

    if (delays.length === 0) {
        container.style.display = 'none';
        return;
    }

    container.style.display = 'block';
    container.innerHTML = `
        <h3>⚠️ Atrasos Sinalizados</h3>
        ${delays.map(delay => `
            <div class="delay-card">
                <div class="delay-period">
                    <strong>Período:</strong>
                    ${formatDate(delay.start_date)} até ${formatDate(delay.end_date)}
                </div>
                ${delay.reason ? `<div class="delay-reason"><strong>Motivo:</strong> ${escapeHtml(delay.reason)}</div>` : ''}
                <button class="btn btn-sm btn-danger" onclick="removeDelay('${delay.id}')">
                    🗑️ Remover Sinalização
                </button>
            </div>
        `).join('')}
    `;
}

// Open delay modal
function openDelayModal() {
    const modal = document.getElementById('delayModal');
    document.getElementById('delayForm').reset();

    // Set default start date to today
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('delayStart').value = today;

    modal.style.display = 'flex';
}

// Close delay modal
function closeDelayModal() {
    const modal = document.getElementById('delayModal');
    modal.style.display = 'none';
}

// Submit delay form
async function submitDelayForm() {
    const startDate = document.getElementById('delayStart').value;
    const endDate = document.getElementById('delayEnd').value;
    const reason = document.getElementById('delayReason').value;

    // Validate dates
    if (!startDate || !endDate) {
        showError('Por favor, preencha as datas de início e fim.');
        return;
    }

    if (new Date(startDate) > new Date(endDate)) {
        showError('A data de fim deve ser posterior à data de início!');
        return;
    }

    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('schedule_delays')
            .insert({
                user_id: currentUser.id,
                start_date: startDate,
                end_date: endDate,
                reason: reason || null,
                created_at: new Date().toISOString()
            });

        if (error) throw error;

        closeDelayModal();
        showSuccess('Atraso sinalizado com sucesso! Os mentores foram notificados.');
        setTimeout(() => hideSuccess(), 3000);

        // Reload delays
        await loadDelays();

    } catch (error) {
        console.error('Error reporting delay:', error);
        showError('Erro ao sinalizar atraso. Tente novamente.');
    }
}

// Remove delay
async function removeDelay(delayId) {
    if (!confirm('Tem certeza que deseja remover esta sinalização de atraso?')) {
        return;
    }

    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('schedule_delays')
            .delete()
            .eq('id', delayId);

        if (error) throw error;

        showSuccess('Sinalização removida com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

        // Reload delays
        await loadDelays();

    } catch (error) {
        console.error('Error removing delay:', error);
        showError('Erro ao remover sinalização. Tente novamente.');
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
window.toggleComplete = toggleComplete;
window.removeDelay = removeDelay;
window.closeDelayModal = closeDelayModal;
window.submitDelayForm = submitDelayForm;
