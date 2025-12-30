/* ============================================================================
   WARD ACADEMY - LANDMARKS PAGE LOGIC
   ============================================================================ */

// State
let currentUser = null;
let userData = {};
let landmarks = [];
let currentLandmarkId = null;

// Landmark Templates
const defaultLandmarks = {
    entrada: [
        { title: 'Entrada na Ward Academy', mentor: 'marcos', type: 'entry', order: 0 }
    ],
    'primeira-rodada': [
        { title: '1ª Chamada - Dra. Iria: Background e USMLE', mentor: 'iria', type: 'call_iria_1', order: 1 },
        { title: '1ª Chamada - Guilherme: Configurando Anki', mentor: 'guilherme', type: 'call_guilherme_1', order: 2 },
        { title: '1ª Chamada - Marcos: Organizando próximos passos', mentor: 'marcos', type: 'call_marcos_1', order: 3 }
    ],
    'segunda-rodada': [
        { title: '2ª Chamada - Dra. Iria: Como usar o UWorld', mentor: 'iria', type: 'call_iria_2', order: 4 },
        { title: '2ª Chamada - Guilherme: Uso do Anki nas últimas semanas', mentor: 'guilherme', type: 'call_guilherme_2', order: 5 }
    ],
    'pesquisa': [
        { title: '3ª Chamada - Marcos: Usar databases corretamente', mentor: 'marcos', type: 'call_marcos_research_1', order: 100 },
        { title: '4ª Chamada - Marcos: Validando ideia de revisão', mentor: 'marcos', type: 'call_marcos_research_2', order: 101 },
        { title: '5ª Chamada - Marcos: Triagem por título e resumo', mentor: 'marcos', type: 'call_marcos_research_3', order: 102 },
        { title: '6ª Chamada - Marcos: Triagem por manuscritos completos', mentor: 'marcos', type: 'call_marcos_research_4', order: 103 },
        { title: '7ª Chamada - Marcos: Extração de dados', mentor: 'marcos', type: 'call_marcos_research_5', order: 104 },
        { title: '8ª Chamada - Marcos: Risco de viés', mentor: 'marcos', type: 'call_marcos_research_6', order: 105 },
        { title: '9ª Chamada - Marcos: Escrita científica', mentor: 'marcos', type: 'call_marcos_research_7', order: 106 },
        { title: '10ª Chamada - Marcos: Submissão do manuscrito', mentor: 'marcos', type: 'call_marcos_research_8', order: 107 }
    ],
    'second-pass': [
        { title: 'Chamada - Dra. Iria: Second Pass', mentor: 'iria', type: 'call_iria_second_pass', order: 200 },
        { title: 'Chamada - Dra. Iria: Simulados (NBMEs)', mentor: 'iria', type: 'call_iria_nbmes', order: 201 }
    ],
    'dedicated': [
        { title: 'Chamada - Dra. Iria: Dedicated', mentor: 'iria', type: 'call_iria_dedicated', order: 300 },
        { title: 'Chamada - Dra. Iria: Agendar a prova', mentor: 'iria', type: 'call_iria_schedule', order: 301 },
        { title: 'Chamada - Dra. Iria: Pré-prova', mentor: 'iria', type: 'call_iria_pre_exam', order: 302 },
        { title: 'Chamada - Dra. Iria: Pós-prova', mentor: 'iria', type: 'call_iria_post_exam', order: 303 }
    ]
};

// Initialize Landmarks Page
document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    currentUser = requireAuth();
    if (!currentUser) return;

    // Initialize page
    await initLandmarks();
});

// Initialize landmarks
async function initLandmarks() {
    try {
        // Load user data
        await loadUserData();

        // Load landmarks
        await loadLandmarks();

        // Update diary link visibility
        updateDiaryLinks();

        // Setup modal listeners
        setupModalListeners();

    } catch (error) {
        console.error('Error initializing landmarks:', error);
        showError('Erro ao carregar landmarks. Tente recarregar a página.');
    }
}

// Load user data
async function loadUserData() {
    const sb = initSupabase();

    try {
        const { data, error } = await sb
            .from('users')
            .select('*')
            .eq('id', currentUser.id)
            .single();

        if (error) throw error;

        userData = data || {};
        currentUser = { ...currentUser, ...userData };

    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Load landmarks from database
async function loadLandmarks() {
    const sb = initSupabase();

    try {
        const { data, error } = await sb
            .from('landmarks')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('order_position', { ascending: true });

        if (error) throw error;

        landmarks = data || [];

        // If no landmarks exist and questionnaire is complete, create default ones
        if (landmarks.length === 0 && currentUser.first_login_completed) {
            await createDefaultLandmarks();
            await loadLandmarks(); // Reload
            return;
        }

        // Render landmarks
        renderLandmarks();

        // Show/hide research section
        checkResearchSection();

    } catch (error) {
        console.error('Error loading landmarks:', error);
        showError('Erro ao carregar landmarks.');
    }
}

// Create default landmarks
async function createDefaultLandmarks() {
    const sb = initSupabase();

    try {
        const landmarksToCreate = [];

        // Add all default landmarks
        for (const section in defaultLandmarks) {
            defaultLandmarks[section].forEach(template => {
                landmarksToCreate.push({
                    user_id: currentUser.id,
                    title: template.title,
                    mentor: template.mentor,
                    landmark_type: template.type,
                    section: section,
                    order_position: template.order,
                    completed: false,
                    is_urgent: false,
                    notes: null
                });
            });
        }

        const { error } = await sb
            .from('landmarks')
            .insert(landmarksToCreate);

        if (error) throw error;

    } catch (error) {
        console.error('Error creating default landmarks:', error);
    }
}

// Render landmarks by section
function renderLandmarks() {
    const sections = ['entrada', 'primeira-rodada', 'segunda-rodada', 'systems', 'pesquisa', 'second-pass', 'dedicated', 'extras'];

    sections.forEach(section => {
        const container = document.querySelector(`[data-section="${section}"]`);
        if (!container) return;

        const sectionLandmarks = landmarks.filter(l => l.section === section);

        if (sectionLandmarks.length === 0) {
            container.innerHTML = '<div class="empty-state"><p>Nenhum landmark nesta seção ainda.</p></div>';
            return;
        }

        const html = sectionLandmarks.map(landmark => renderLandmarkItem(landmark)).join('');
        container.innerHTML = html;
    });
}

// Render individual landmark item
function renderLandmarkItem(landmark) {
    const completedClass = landmark.completed ? 'completed' : '';
    const urgentClass = landmark.is_urgent ? 'urgent' : '';
    const statusBadge = landmark.completed
        ? '<span class="status-badge completed">✅ Concluído</span>'
        : '<span class="status-badge pending">⏳ Pendente</span>';
    const urgentBadge = landmark.is_urgent
        ? '<span class="status-badge urgent">⚠️ URGENTE</span>'
        : '';

    const mentorName = getMentorDisplayName(landmark.mentor);

    return `
        <div class="landmark-item ${completedClass} ${urgentClass}" data-id="${landmark.id}">
            <div class="landmark-header">
                <h3 class="landmark-title">${landmark.title}</h3>
                <div class="landmark-badges">
                    ${landmark.mentor ? `<span class="mentor-badge">${mentorName}</span>` : ''}
                    ${urgentBadge}
                    ${statusBadge}
                </div>
            </div>

            <div class="landmark-body">
                ${landmark.completed && landmark.completion_date
                    ? `<div class="landmark-date completed">Concluído em: ${formatDate(landmark.completion_date)}</div>`
                    : ''
                }

                ${landmark.notes
                    ? `<div class="landmark-notes">
                        <div class="landmark-notes-header">
                            <span>📝</span>
                            <span>Observações:</span>
                        </div>
                        <div class="landmark-notes-content">${landmark.notes}</div>
                    </div>`
                    : ''
                }
            </div>

            <div class="landmark-actions">
                <button class="btn btn-secondary btn-sm" onclick="editLandmark('${landmark.id}')">
                    ✏️ Editar
                </button>
                ${!landmark.completed
                    ? `<button class="btn btn-success btn-sm" onclick="markComplete('${landmark.id}')">
                        ✓ Marcar como Concluído
                    </button>`
                    : ''
                }
                ${landmark.landmark_type && landmark.landmark_type.startsWith('custom')
                    ? `<button class="btn btn-danger btn-sm" onclick="deleteLandmark('${landmark.id}')">
                        🗑️ Excluir
                    </button>`
                    : ''
                }
            </div>
        </div>
    `;
}

// Get mentor display name
function getMentorDisplayName(mentor) {
    const names = {
        'iria': 'Dra. Iria',
        'marcos': 'Marcos',
        'guilherme': 'Guilherme',
        'romulo': 'Rômulo'
    };
    return names[mentor] || mentor;
}

// Check if research section should be shown
function checkResearchSection() {
    const questionnaireData = currentUser.questionnaire_data || {};
    const wantsResearch = questionnaireData.wants_research_ward;

    const researchSection = document.getElementById('researchCallsSection');
    if (researchSection) {
        if (wantsResearch === 'immediate' || wantsResearch === 'after_usmle') {
            researchSection.style.display = 'block';
        } else {
            researchSection.style.display = 'none';
        }
    }
}

// Setup modal listeners
function setupModalListeners() {
    // Status radio change
    const statusRadios = document.querySelectorAll('input[name="landmarkStatus"]');
    statusRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const dateGroup = document.getElementById('completionDateGroup');
            if (e.target.value === 'completed') {
                dateGroup.style.display = 'block';
                const dateInput = document.getElementById('completionDate');
                if (!dateInput.value) {
                    dateInput.value = new Date().toISOString().split('T')[0];
                }
            } else {
                dateGroup.style.display = 'none';
            }
        });
    });
}

// Edit landmark
async function editLandmark(landmarkId) {
    const landmark = landmarks.find(l => l.id === landmarkId);
    if (!landmark) return;

    currentLandmarkId = landmarkId;

    // Populate form
    document.getElementById('landmarkId').value = landmark.id;
    document.getElementById('landmarkTitle').value = landmark.title;

    const statusRadio = document.querySelector(`input[name="landmarkStatus"][value="${landmark.completed ? 'completed' : 'pending'}"]`);
    if (statusRadio) statusRadio.checked = true;

    if (landmark.completed) {
        document.getElementById('completionDateGroup').style.display = 'block';
        document.getElementById('completionDate').value = landmark.completion_date || '';
    }

    document.getElementById('isUrgent').checked = landmark.is_urgent || false;
    document.getElementById('landmarkNotes').value = landmark.notes || '';

    // Show modal
    document.getElementById('modalTitle').textContent = 'Editar Landmark';
    document.getElementById('landmarkModal').style.display = 'flex';
}

// Save landmark
async function saveLandmark() {
    const landmarkId = currentLandmarkId;
    if (!landmarkId) return;

    const sb = initSupabase();

    const isCompleted = document.querySelector('input[name="landmarkStatus"]:checked')?.value === 'completed';

    const updateData = {
        title: document.getElementById('landmarkTitle').value,
        completed: isCompleted,
        completion_date: isCompleted ? document.getElementById('completionDate').value : null,
        is_urgent: document.getElementById('isUrgent').checked,
        notes: document.getElementById('landmarkNotes').value || null,
        updated_at: new Date().toISOString()
    };

    try {
        const { error } = await sb
            .from('landmarks')
            .update(updateData)
            .eq('id', landmarkId);

        if (error) throw error;

        closeLandmarkModal();
        await loadLandmarks();
        showSuccess('Landmark atualizado com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error saving landmark:', error);
        showError('Erro ao salvar landmark.');
    }
}

// Close landmark modal
function closeLandmarkModal() {
    document.getElementById('landmarkModal').style.display = 'none';
    document.getElementById('landmarkForm').reset();
    document.getElementById('completionDateGroup').style.display = 'none';
    currentLandmarkId = null;
}

// Mark landmark as complete
async function markComplete(landmarkId) {
    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('landmarks')
            .update({
                completed: true,
                completion_date: new Date().toISOString().split('T')[0],
                updated_at: new Date().toISOString()
            })
            .eq('id', landmarkId);

        if (error) throw error;

        await loadLandmarks();
        showSuccess('Landmark marcado como concluído!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error marking complete:', error);
        showError('Erro ao marcar como concluído.');
    }
}

// Delete landmark
async function deleteLandmark(landmarkId) {
    if (!confirm('Tem certeza que deseja excluir este landmark?')) return;

    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('landmarks')
            .delete()
            .eq('id', landmarkId);

        if (error) throw error;

        await loadLandmarks();
        showSuccess('Landmark excluído com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error deleting landmark:', error);
        showError('Erro ao excluir landmark.');
    }
}

// Add system landmark
function addSystemLandmark() {
    document.getElementById('systemLandmarkForm').reset();
    document.getElementById('systemLandmarkModal').style.display = 'flex';
}

// Close system landmark modal
function closeSystemLandmarkModal() {
    document.getElementById('systemLandmarkModal').style.display = 'none';
    document.getElementById('systemLandmarkForm').reset();
}

// Save system landmark
async function saveSystemLandmark() {
    const systemName = document.getElementById('systemName').value;
    const mentor = document.getElementById('systemMentor').value;
    const notes = document.getElementById('systemNotes').value;

    if (!systemName) {
        showError('Selecione um system.');
        return;
    }

    const sb = initSupabase();

    const newLandmark = {
        user_id: currentUser.id,
        title: `Chamada - ${getMentorDisplayName(mentor)}: ${systemName}`,
        mentor: mentor,
        landmark_type: 'custom_system',
        section: 'systems',
        order_position: 50 + landmarks.filter(l => l.section === 'systems').length,
        completed: false,
        is_urgent: false,
        notes: notes || null
    };

    try {
        const { error } = await sb
            .from('landmarks')
            .insert(newLandmark);

        if (error) throw error;

        closeSystemLandmarkModal();
        await loadLandmarks();
        showSuccess('Chamada de system adicionada com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error adding system landmark:', error);
        showError('Erro ao adicionar chamada.');
    }
}

// Add extra call
function addExtraCall(mentor) {
    document.getElementById('extraCallMentor').value = mentor;
    document.getElementById('extraCallModalTitle').textContent = `Adicionar Chamada Extra com ${getMentorDisplayName(mentor)}`;
    document.getElementById('extraCallForm').reset();
    document.getElementById('extraCallModal').style.display = 'flex';
}

// Close extra call modal
function closeExtraCallModal() {
    document.getElementById('extraCallModal').style.display = 'none';
    document.getElementById('extraCallForm').reset();
}

// Save extra call
async function saveExtraCall() {
    const mentor = document.getElementById('extraCallMentor').value;
    const title = document.getElementById('extraCallTitle').value;
    const notes = document.getElementById('extraCallNotes').value;

    if (!title) {
        showError('Informe um título para a chamada.');
        return;
    }

    const sb = initSupabase();

    const newLandmark = {
        user_id: currentUser.id,
        title: `Chamada Extra - ${getMentorDisplayName(mentor)}: ${title}`,
        mentor: mentor,
        landmark_type: 'custom_extra',
        section: 'extras',
        order_position: 400 + landmarks.filter(l => l.section === 'extras').length,
        completed: false,
        is_urgent: false,
        notes: notes || null
    };

    try {
        const { error } = await sb
            .from('landmarks')
            .insert(newLandmark);

        if (error) throw error;

        closeExtraCallModal();
        await loadLandmarks();
        showSuccess('Chamada extra adicionada com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error adding extra call:', error);
        showError('Erro ao adicionar chamada extra.');
    }
}

// Update diary links
function updateDiaryLinks() {
    const studyLink = document.getElementById('studyDiaryLink');
    const uworldLink = document.getElementById('uworldDiaryLink');

    if (studyLink) {
        studyLink.style.display = userData.diary_study_enabled ? 'block' : 'none';
    }

    if (uworldLink) {
        uworldLink.style.display = userData.diary_uworld_enabled ? 'block' : 'none';
    }
}

// Utility functions
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
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
window.editLandmark = editLandmark;
window.saveLandmark = saveLandmark;
window.closeLandmarkModal = closeLandmarkModal;
window.markComplete = markComplete;
window.deleteLandmark = deleteLandmark;
window.addSystemLandmark = addSystemLandmark;
window.closeSystemLandmarkModal = closeSystemLandmarkModal;
window.saveSystemLandmark = saveSystemLandmark;
window.addExtraCall = addExtraCall;
window.closeExtraCallModal = closeExtraCallModal;
window.saveExtraCall = saveExtraCall;
