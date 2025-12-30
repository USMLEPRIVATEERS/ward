/* ============================================================================
   WARD ACADEMY - PROFILE PAGE LOGIC
   ============================================================================ */

// State
let currentUser = null;
let userData = {};
let originalData = {};
let isEditMode = false;

// Initialize Profile Page
document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    currentUser = requireAuth();
    if (!currentUser) return;

    // Initialize page
    await initProfile();

    // Setup event listeners
    setupEventListeners();
});

// Initialize profile
async function initProfile() {
    try {
        // Load user data
        await loadUserData();

        // Populate all fields
        populateFields();

        // Setup diary link visibility
        updateDiaryLinks();

    } catch (error) {
        console.error('Error initializing profile:', error);
        showError('Erro ao carregar perfil. Tente recarregar a página.');
    }
}

// Load user data from Supabase
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
        originalData = JSON.parse(JSON.stringify(data || {})); // Deep copy
        currentUser = { ...currentUser, ...userData };
        sessionStorage.setItem('wardUser', JSON.stringify(currentUser));

    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Populate all fields with data
function populateFields() {
    // Basic data
    document.getElementById('name').value = userData.name || '';
    document.getElementById('email').value = userData.email || '';

    const questionnaireData = userData.questionnaire_data || {};

    document.getElementById('exam_taking').value = questionnaireData.exam_taking || '';
    document.getElementById('study_start_date').value = questionnaireData.study_start_date || '';
    document.getElementById('test_date').value = questionnaireData.test_date || '';

    // USMLE data
    document.getElementById('first_pass_months').value = questionnaireData.first_pass_months || 12;
    document.getElementById('second_pass_months').value = questionnaireData.second_pass_months || 4;
    document.getElementById('dedicated_months').value = questionnaireData.dedicated_months || 2;
    document.getElementById('uworld_exam').value = questionnaireData.uworld_exam || '';

    // Render UWorld systems
    renderUWorldSystems();

    // Prep data
    document.getElementById('english_level').value = questionnaireData.english_level || '';

    // English studying
    const englishStudying = questionnaireData.english_studying;
    if (englishStudying) {
        const radio = document.querySelector(`input[name="english_studying"][value="${englishStudying}"]`);
        if (radio) radio.checked = true;
    }

    // Show/hide English study row
    const englishLevel = questionnaireData.english_level;
    if (englishLevel === 'basic' || englishLevel === 'intermediate') {
        document.getElementById('englishStudyRow').style.display = 'flex';
    }

    // Anki usage
    const ankiUsage = questionnaireData.anki_usage;
    if (ankiUsage) {
        const radio = document.querySelector(`input[name="anki_usage"][value="${ankiUsage}"]`);
        if (radio) radio.checked = true;
    }

    document.getElementById('anki_deck').value = questionnaireData.anki_deck || '';
    document.getElementById('anki_cards_per_day').value = questionnaireData.anki_cards_per_day || '';

    // Show/hide Anki details
    if (ankiUsage === 'yes') {
        document.getElementById('ankiDetailsRow').style.display = 'block';
    }

    document.getElementById('additional_resources').value = questionnaireData.additional_resources || '';

    // Research
    const hasResearch = questionnaireData.has_research;
    if (hasResearch) {
        const radio = document.querySelector(`input[name="has_research"][value="${hasResearch}"]`);
        if (radio) radio.checked = true;
    }

    document.getElementById('research_description').value = questionnaireData.research_description || '';

    // Show/hide research details
    if (hasResearch === 'yes') {
        document.getElementById('researchDetailsRow').style.display = 'block';
    }

    // Observerships
    const hasObserverships = questionnaireData.has_observerships;
    if (hasObserverships) {
        const radio = document.querySelector(`input[name="has_observerships"][value="${hasObserverships}"]`);
        if (radio) radio.checked = true;
    }

    document.getElementById('observerships_description').value = questionnaireData.observerships_description || '';

    // Show/hide observerships details
    if (hasObserverships === 'yes') {
        document.getElementById('observershipsDetailsRow').style.display = 'block';
    }
}

// Render UWorld systems
function renderUWorldSystems() {
    const container = document.getElementById('uworldSystemsList');
    const questionnaireData = userData.questionnaire_data || {};
    const uworldExam = questionnaireData.uworld_exam;
    const uworldProgress = questionnaireData.uworld_progress || {};

    if (!uworldExam || !window.uworldSystems || !window.uworldSystems[uworldExam]) {
        container.innerHTML = '<div class="empty-state"><div class="icon">📚</div><p>Selecione uma prova do UWorld para ver os sistemas</p></div>';
        return;
    }

    const systems = window.uworldSystems[uworldExam];
    let html = '';

    for (const category in systems) {
        const categoryData = systems[category];
        const categoryProgress = uworldProgress[category] || {};

        html += `
            <div class="uworld-category">
                <div class="uworld-category-header" onclick="toggleCategory(this)">
                    <span class="uworld-category-title">${category}</span>
                    <span class="uworld-category-arrow">▼</span>
                </div>
                <div class="uworld-systems-grid">
        `;

        categoryData.forEach(system => {
            const isDone = categoryProgress[system.name] === true;
            html += `
                <div class="uworld-system-item ${isDone ? 'done' : ''}">
                    ${isDone ? '✅' : '⬜'}
                    <span>${system.name}</span>
                    ${system.difficulty ? `<span class="uworld-difficulty ${system.difficulty}">${system.difficulty}</span>` : ''}
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    }

    container.innerHTML = html;
}

// Toggle UWorld category
function toggleCategory(header) {
    header.classList.toggle('collapsed');
    const grid = header.nextElementSibling;
    if (grid) {
        grid.style.display = header.classList.contains('collapsed') ? 'none' : 'grid';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        btn.addEventListener('click', () => switchTab(btn.dataset.tab));
    });

    // English level change
    document.getElementById('english_level').addEventListener('change', (e) => {
        const level = e.target.value;
        const englishStudyRow = document.getElementById('englishStudyRow');
        if (level === 'basic' || level === 'intermediate') {
            englishStudyRow.style.display = 'flex';
        } else {
            englishStudyRow.style.display = 'none';
        }
    });

    // Anki usage change
    const ankiRadios = document.querySelectorAll('input[name="anki_usage"]');
    ankiRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const ankiDetailsRow = document.getElementById('ankiDetailsRow');
            if (e.target.value === 'yes') {
                ankiDetailsRow.style.display = 'block';
            } else {
                ankiDetailsRow.style.display = 'none';
            }
        });
    });

    // Research change
    const researchRadios = document.querySelectorAll('input[name="has_research"]');
    researchRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const researchDetailsRow = document.getElementById('researchDetailsRow');
            if (e.target.value === 'yes') {
                researchDetailsRow.style.display = 'block';
            } else {
                researchDetailsRow.style.display = 'none';
            }
        });
    });

    // Observerships change
    const observershipsRadios = document.querySelectorAll('input[name="has_observerships"]');
    observershipsRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const observershipsDetailsRow = document.getElementById('observershipsDetailsRow');
            if (e.target.value === 'yes') {
                observershipsDetailsRow.style.display = 'block';
            } else {
                observershipsDetailsRow.style.display = 'none';
            }
        });
    });
}

// Switch tab
function switchTab(tabName) {
    // Update buttons
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach(btn => {
        if (btn.dataset.tab === tabName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update content
    const tabContents = document.querySelectorAll('.tab-content');
    tabContents.forEach(content => {
        if (content.id === `tab-${tabName}`) {
            content.classList.add('active');
        } else {
            content.classList.remove('active');
        }
    });
}

// Toggle edit mode
function toggleEditMode() {
    isEditMode = true;
    document.body.classList.add('edit-mode');

    // Enable all fields except email
    const inputs = document.querySelectorAll('.input-profile');
    inputs.forEach(input => {
        if (input.id !== 'email') {
            input.removeAttribute('readonly');
            input.removeAttribute('disabled');
        }
    });

    // Enable radio buttons
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.removeAttribute('disabled');
    });

    // Show/hide buttons
    document.getElementById('editBtn').style.display = 'none';
    document.getElementById('saveBtn').style.display = 'inline-block';
    document.getElementById('cancelBtn').style.display = 'inline-block';
}

// Cancel edit
function cancelEdit() {
    isEditMode = false;
    document.body.classList.remove('edit-mode');

    // Restore original data
    userData = JSON.parse(JSON.stringify(originalData));
    populateFields();

    // Disable all fields
    const inputs = document.querySelectorAll('.input-profile');
    inputs.forEach(input => {
        input.setAttribute('readonly', 'true');
        if (input.tagName === 'SELECT') {
            input.setAttribute('disabled', 'true');
        }
    });

    // Disable radio buttons
    const radios = document.querySelectorAll('input[type="radio"]');
    radios.forEach(radio => {
        radio.setAttribute('disabled', 'true');
    });

    // Show/hide buttons
    document.getElementById('editBtn').style.display = 'inline-block';
    document.getElementById('saveBtn').style.display = 'none';
    document.getElementById('cancelBtn').style.display = 'none';
}

// Save profile
async function saveProfile() {
    const sb = initSupabase();

    try {
        // Collect all data
        const questionnaireData = {
            exam_taking: document.getElementById('exam_taking').value,
            study_start_date: document.getElementById('study_start_date').value,
            test_date: document.getElementById('test_date').value,
            first_pass_months: parseInt(document.getElementById('first_pass_months').value) || 12,
            second_pass_months: parseInt(document.getElementById('second_pass_months').value) || 4,
            dedicated_months: parseInt(document.getElementById('dedicated_months').value) || 2,
            uworld_exam: document.getElementById('uworld_exam').value,
            uworld_progress: userData.questionnaire_data?.uworld_progress || {},
            english_level: document.getElementById('english_level').value,
            english_studying: document.querySelector('input[name="english_studying"]:checked')?.value || '',
            anki_usage: document.querySelector('input[name="anki_usage"]:checked')?.value || '',
            anki_deck: document.getElementById('anki_deck').value,
            anki_cards_per_day: parseInt(document.getElementById('anki_cards_per_day').value) || 0,
            additional_resources: document.getElementById('additional_resources').value,
            has_research: document.querySelector('input[name="has_research"]:checked')?.value || '',
            research_description: document.getElementById('research_description').value,
            has_observerships: document.querySelector('input[name="has_observerships"]:checked')?.value || '',
            observerships_description: document.getElementById('observerships_description').value
        };

        // Update user in database
        const { error } = await sb
            .from('users')
            .update({
                name: document.getElementById('name').value,
                questionnaire_data: questionnaireData,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);

        if (error) throw error;

        // Update local state
        userData.name = document.getElementById('name').value;
        userData.questionnaire_data = questionnaireData;
        originalData = JSON.parse(JSON.stringify(userData));

        // Update session
        currentUser = { ...currentUser, ...userData };
        sessionStorage.setItem('wardUser', JSON.stringify(currentUser));

        // Exit edit mode
        isEditMode = false;
        document.body.classList.remove('edit-mode');

        // Disable all fields
        const inputs = document.querySelectorAll('.input-profile');
        inputs.forEach(input => {
            input.setAttribute('readonly', 'true');
            if (input.tagName === 'SELECT') {
                input.setAttribute('disabled', 'true');
            }
        });

        // Disable radio buttons
        const radios = document.querySelectorAll('input[type="radio"]');
        radios.forEach(radio => {
            radio.setAttribute('disabled', 'true');
        });

        // Show/hide buttons
        document.getElementById('editBtn').style.display = 'inline-block';
        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('cancelBtn').style.display = 'none';

        showSuccess('Perfil atualizado com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error saving profile:', error);
        showError('Erro ao salvar perfil. Tente novamente.');
    }
}

// Update diary links visibility
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

// Utility Functions
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
window.toggleCategory = toggleCategory;
window.switchTab = switchTab;
window.toggleEditMode = toggleEditMode;
window.cancelEdit = cancelEdit;
window.saveProfile = saveProfile;
