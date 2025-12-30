/* ============================================================================
   WARD ACADEMY - QUESTIONNAIRE (11 STEPS)
   ============================================================================ */

// State management
let currentStep = 1;
const totalSteps = 11;
let userData = {
    // Step 1: Basic Info
    exam_taking: '',
    study_start_date: '',
    test_date: '',

    // Step 2: Study Plan
    first_pass_months: 12,
    second_pass_months: 4,
    dedicated_months: 2,

    // Step 3: Current Progress
    uworld_exam: '',

    // Step 4: UWorld Progress (populated dynamically)
    uworld_progress: {},

    // Step 5: English Level
    english_level: '',
    english_details: '',

    // Step 6: Anki
    uses_anki: '',
    anki_details: '',

    // Step 7-9: Research Experience
    has_research_experience: '',
    research_interest: '',
    research_projects: [],

    // Step 10: Observerships
    observerships: [],

    // Step 11: Background
    background: ''
};

// Initialize questionnaire
document.addEventListener('DOMContentLoaded', async () => {
    // Protect route - require authentication
    const user = requireAuth();
    if (!user) return;

    // Load saved data from database
    await loadSavedData(user.id);

    // Setup event listeners
    setupEventListeners();
    setupConditionalFields();
    setupSliders();
    setupUWorldTracking();

    // Render current step
    renderStep(currentStep);
});

// Load saved questionnaire data from Supabase
async function loadSavedData(userId) {
    const sb = initSupabase();

    try {
        const { data, error } = await sb
            .from('users')
            .select('questionnaire_data, questionnaire_step')
            .eq('id', userId)
            .single();

        if (error) throw error;

        if (data.questionnaire_data) {
            userData = { ...userData, ...data.questionnaire_data };
            currentStep = data.questionnaire_step || 1;
        }
    } catch (error) {
        console.error('Error loading saved data:', error);
    }
}

// Save data to Supabase with debouncing
let saveTimeout;
async function saveData(skipDelay = false) {
    clearTimeout(saveTimeout);

    const saveFunction = async () => {
        const user = getCurrentUser();
        if (!user) return;

        const sb = initSupabase();

        try {
            const { error } = await sb
                .from('users')
                .update({
                    questionnaire_data: userData,
                    questionnaire_step: currentStep,
                    updated_at: new Date().toISOString()
                })
                .eq('id', user.id);

            if (error) throw error;

            // Show save indicator
            showSaveIndicator();
        } catch (error) {
            console.error('Error saving data:', error);
            showError('Erro ao salvar dados. Tente novamente.');
        }
    };

    if (skipDelay) {
        await saveFunction();
    } else {
        saveTimeout = setTimeout(saveFunction, 2000);
    }
}

// Setup event listeners
function setupEventListeners() {
    // Next button
    document.getElementById('nextBtn')?.addEventListener('click', nextStep);

    // Back button
    document.getElementById('backBtn')?.addEventListener('click', previousStep);

    // Continue later button
    document.getElementById('saveLaterBtn')?.addEventListener('click', saveLater);

    // Auto-save on input change
    document.addEventListener('input', (e) => {
        if (e.target.matches('input, select, textarea')) {
            captureStepData();
            saveData();
        }
    });

    // Add contact button (Step 10)
    document.getElementById('addContactBtn')?.addEventListener('click', addObservershipContact);
}

// Setup conditional field visibility
function setupConditionalFields() {
    // English level details
    document.querySelectorAll('input[name="english_level"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const detailsField = document.getElementById('englishDetailsGroup');
            if (detailsField) {
                detailsField.style.display = e.target.value === 'basic' ? 'block' : 'none';
            }
        });
    });

    // Anki usage details
    document.querySelectorAll('input[name="uses_anki"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const detailsField = document.getElementById('ankiDetailsGroup');
            if (detailsField) {
                detailsField.style.display = e.target.value === 'yes' ? 'block' : 'none';
            }
        });
    });

    // Research experience details
    document.querySelectorAll('input[name="has_research_experience"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const detailsField = document.getElementById('researchDetailsGroup');
            if (detailsField) {
                detailsField.style.display = e.target.value === 'yes' ? 'block' : 'none';
            }
        });
    });
}

// Setup range sliders with value display
function setupSliders() {
    const sliders = document.querySelectorAll('.slider-group input[type="range"]');
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const valueDisplay = e.target.nextElementSibling;
            if (valueDisplay && valueDisplay.classList.contains('slider-value')) {
                valueDisplay.textContent = `${e.target.value} meses`;
            }
        });
    });
}

// Setup UWorld tracking system
function setupUWorldTracking() {
    const examSelect = document.getElementById('uworld_exam');
    if (!examSelect) return;

    examSelect.addEventListener('change', (e) => {
        userData.uworld_exam = e.target.value;
        renderUWorldSystems(e.target.value);
        saveData();
    });
}

// Render UWorld systems based on selected exam
function renderUWorldSystems(exam) {
    const container = document.getElementById('uworldSystemsContainer');
    if (!container || !exam) return;

    container.innerHTML = '';

    const examData = UWORLD_DATA[exam];
    if (!examData) return;

    examData.systems.forEach((system, systemIndex) => {
        const systemDiv = document.createElement('div');
        systemDiv.className = 'uworld-system';

        const systemHeader = document.createElement('div');
        systemHeader.className = 'uworld-system-header';
        systemHeader.innerHTML = `
            <h4>${system.name}</h4>
            <span class="toggle-icon">▼</span>
        `;

        systemHeader.addEventListener('click', () => {
            systemDiv.classList.toggle('collapsed');
            const icon = systemHeader.querySelector('.toggle-icon');
            icon.textContent = systemDiv.classList.contains('collapsed') ? '▶' : '▼';
        });

        const categoriesDiv = document.createElement('div');
        categoriesDiv.className = 'uworld-categories';

        if (system.categories.length === 0) {
            // No categories - just track system
            categoriesDiv.innerHTML = `
                <div class="category-item">
                    <label>
                        <input type="checkbox"
                               data-system="${system.name}"
                               onchange="updateUWorldProgress(this)">
                        <span>Completado</span>
                    </label>
                    <select class="difficulty-select"
                            data-system="${system.name}"
                            onchange="updateUWorldProgress(this)">
                        <option value="">Dificuldade</option>
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                    </select>
                </div>
            `;
        } else {
            system.categories.forEach(category => {
                const categoryDiv = document.createElement('div');
                categoryDiv.className = 'category-item';
                categoryDiv.innerHTML = `
                    <label>
                        <input type="checkbox"
                               data-system="${system.name}"
                               data-category="${category}"
                               onchange="updateUWorldProgress(this)">
                        <span>${category}</span>
                    </label>
                    <select class="difficulty-select"
                            data-system="${system.name}"
                            data-category="${category}"
                            onchange="updateUWorldProgress(this)">
                        <option value="">Dificuldade</option>
                        <option value="easy">Fácil</option>
                        <option value="medium">Médio</option>
                        <option value="hard">Difícil</option>
                    </select>
                `;
                categoriesDiv.appendChild(categoryDiv);
            });
        }

        systemDiv.appendChild(systemHeader);
        systemDiv.appendChild(categoriesDiv);
        container.appendChild(systemDiv);
    });

    // Load saved progress
    loadUWorldProgress();
}

// Update UWorld progress in userData
window.updateUWorldProgress = function(element) {
    const system = element.dataset.system;
    const category = element.dataset.category || 'general';

    if (!userData.uworld_progress[system]) {
        userData.uworld_progress[system] = {};
    }

    if (element.type === 'checkbox') {
        userData.uworld_progress[system][category] = {
            ...userData.uworld_progress[system][category],
            completed: element.checked
        };
    } else if (element.tagName === 'SELECT') {
        userData.uworld_progress[system][category] = {
            ...userData.uworld_progress[system][category],
            difficulty: element.value
        };
    }

    saveData();
};

// Load saved UWorld progress
function loadUWorldProgress() {
    if (!userData.uworld_progress) return;

    Object.keys(userData.uworld_progress).forEach(system => {
        Object.keys(userData.uworld_progress[system]).forEach(category => {
            const progress = userData.uworld_progress[system][category];

            // Find and check the checkbox
            const checkbox = document.querySelector(
                `input[type="checkbox"][data-system="${system}"][data-category="${category}"]`
            ) || document.querySelector(
                `input[type="checkbox"][data-system="${system}"]:not([data-category])`
            );

            if (checkbox && progress.completed) {
                checkbox.checked = true;
            }

            // Set the difficulty
            const select = document.querySelector(
                `select[data-system="${system}"][data-category="${category}"]`
            ) || document.querySelector(
                `select[data-system="${system}"]:not([data-category])`
            );

            if (select && progress.difficulty) {
                select.value = progress.difficulty;
            }
        });
    });
}

// Add observership contact
function addObservershipContact() {
    const nameInput = document.getElementById('contact_name');
    const emailInput = document.getElementById('contact_email');

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();

    if (!name || !email) {
        showError('Preencha o nome e email do contato');
        return;
    }

    userData.observerships.push({ name, email });

    // Add to list display
    const list = document.getElementById('contactsList');
    const contactDiv = document.createElement('div');
    contactDiv.className = 'contact-item';
    contactDiv.innerHTML = `
        <span>${name} (${email})</span>
        <button type="button" class="btn-remove" onclick="removeContact(${userData.observerships.length - 1})">
            Remover
        </button>
    `;
    list.appendChild(contactDiv);

    // Clear inputs
    nameInput.value = '';
    emailInput.value = '';

    saveData();
}

// Remove observership contact
window.removeContact = function(index) {
    userData.observerships.splice(index, 1);

    // Re-render list
    const list = document.getElementById('contactsList');
    list.innerHTML = '';
    userData.observerships.forEach((contact, i) => {
        const contactDiv = document.createElement('div');
        contactDiv.className = 'contact-item';
        contactDiv.innerHTML = `
            <span>${contact.name} (${contact.email})</span>
            <button type="button" class="btn-remove" onclick="removeContact(${i})">Remover</button>
        `;
        list.appendChild(contactDiv);
    });

    saveData();
};

// Capture data from current step
function captureStepData() {
    const step = currentStep;

    // Step 1: Basic Info
    if (step === 1) {
        userData.exam_taking = document.querySelector('input[name="exam_taking"]:checked')?.value || '';
        userData.study_start_date = document.getElementById('study_start_date')?.value || '';
        userData.test_date = document.getElementById('test_date')?.value || '';
    }

    // Step 2: Study Plan
    if (step === 2) {
        userData.first_pass_months = parseInt(document.getElementById('first_pass_months')?.value) || 12;
        userData.second_pass_months = parseInt(document.getElementById('second_pass_months')?.value) || 4;
        userData.dedicated_months = parseInt(document.getElementById('dedicated_months')?.value) || 2;
    }

    // Step 3: UWorld exam selection (captured in setupUWorldTracking)

    // Step 4: UWorld progress (captured in updateUWorldProgress)

    // Step 5: English Level
    if (step === 5) {
        userData.english_level = document.querySelector('input[name="english_level"]:checked')?.value || '';
        userData.english_details = document.getElementById('english_details')?.value || '';
    }

    // Step 6: Anki
    if (step === 6) {
        userData.uses_anki = document.querySelector('input[name="uses_anki"]:checked')?.value || '';
        userData.anki_details = document.getElementById('anki_details')?.value || '';
    }

    // Step 7: Research Experience
    if (step === 7) {
        userData.has_research_experience = document.querySelector('input[name="has_research_experience"]:checked')?.value || '';
    }

    // Step 8: Research Interest
    if (step === 8) {
        userData.research_interest = document.getElementById('research_interest')?.value || '';
    }

    // Step 9: Research Projects (handled separately)

    // Step 10: Observerships (handled in addObservershipContact)

    // Step 11: Background
    if (step === 11) {
        userData.background = document.getElementById('background')?.value || '';
    }
}

// Navigate to next step
async function nextStep() {
    captureStepData();

    // Validate current step
    if (!validateStep(currentStep)) {
        return;
    }

    if (currentStep < totalSteps) {
        currentStep++;
        await saveData(true); // Save immediately
        renderStep(currentStep);
    } else {
        // Finish questionnaire
        await finishQuestionnaire();
    }
}

// Navigate to previous step
function previousStep() {
    captureStepData();

    if (currentStep > 1) {
        currentStep--;
        renderStep(currentStep);
    }
}

// Save and continue later
async function saveLater() {
    captureStepData();
    await saveData(true);

    const user = getCurrentUser();
    if (user) {
        redirectToDashboard(user);
    }
}

// Validate step before proceeding
function validateStep(step) {
    let isValid = true;
    let errorMessage = '';

    switch (step) {
        case 1:
            if (!userData.exam_taking) {
                errorMessage = 'Selecione qual prova você está fazendo';
                isValid = false;
            }
            break;
        case 2:
            // All sliders have default values, no validation needed
            break;
        case 3:
            if (!userData.uworld_exam) {
                errorMessage = 'Selecione qual UWorld você está usando';
                isValid = false;
            }
            break;
        // Other steps are optional or have conditional validation
    }

    if (!isValid) {
        showError(errorMessage);
    }

    return isValid;
}

// Render specific step
function renderStep(step) {
    // Hide all steps
    document.querySelectorAll('.step-content').forEach(s => {
        s.style.display = 'none';
    });

    // Show current step
    const stepElement = document.getElementById(`step${step}`);
    if (stepElement) {
        stepElement.style.display = 'block';
    }

    // Update progress bar
    updateProgressBar();

    // Update button states
    updateButtons();

    // Scroll to top
    window.scrollTo(0, 0);

    // Populate fields with saved data
    populateFields(step);
}

// Populate fields with saved data
function populateFields(step) {
    switch (step) {
        case 1:
            if (userData.exam_taking) {
                const radio = document.querySelector(`input[name="exam_taking"][value="${userData.exam_taking}"]`);
                if (radio) radio.checked = true;
            }
            if (userData.study_start_date) {
                const input = document.getElementById('study_start_date');
                if (input) input.value = userData.study_start_date;
            }
            if (userData.test_date) {
                const input = document.getElementById('test_date');
                if (input) input.value = userData.test_date;
            }
            break;

        case 2:
            document.getElementById('first_pass_months').value = userData.first_pass_months;
            document.getElementById('second_pass_months').value = userData.second_pass_months;
            document.getElementById('dedicated_months').value = userData.dedicated_months;
            // Trigger slider display update
            setupSliders();
            break;

        case 3:
            if (userData.uworld_exam) {
                const select = document.getElementById('uworld_exam');
                if (select) {
                    select.value = userData.uworld_exam;
                }
            }
            break;

        case 4:
            if (userData.uworld_exam) {
                renderUWorldSystems(userData.uworld_exam);
            }
            break;

        case 5:
            if (userData.english_level) {
                const radio = document.querySelector(`input[name="english_level"][value="${userData.english_level}"]`);
                if (radio) {
                    radio.checked = true;
                    // Show/hide details
                    const detailsField = document.getElementById('englishDetailsGroup');
                    if (detailsField) {
                        detailsField.style.display = userData.english_level === 'basic' ? 'block' : 'none';
                    }
                }
            }
            if (userData.english_details) {
                const textarea = document.getElementById('english_details');
                if (textarea) textarea.value = userData.english_details;
            }
            break;

        case 6:
            if (userData.uses_anki) {
                const radio = document.querySelector(`input[name="uses_anki"][value="${userData.uses_anki}"]`);
                if (radio) {
                    radio.checked = true;
                    // Show/hide details
                    const detailsField = document.getElementById('ankiDetailsGroup');
                    if (detailsField) {
                        detailsField.style.display = userData.uses_anki === 'yes' ? 'block' : 'none';
                    }
                }
            }
            if (userData.anki_details) {
                const textarea = document.getElementById('anki_details');
                if (textarea) textarea.value = userData.anki_details;
            }
            break;

        case 7:
            if (userData.has_research_experience) {
                const radio = document.querySelector(`input[name="has_research_experience"][value="${userData.has_research_experience}"]`);
                if (radio) radio.checked = true;
            }
            break;

        case 8:
            if (userData.research_interest) {
                const textarea = document.getElementById('research_interest');
                if (textarea) textarea.value = userData.research_interest;
            }
            break;

        case 10:
            // Render observerships list
            const list = document.getElementById('contactsList');
            if (list) {
                list.innerHTML = '';
                userData.observerships.forEach((contact, i) => {
                    const contactDiv = document.createElement('div');
                    contactDiv.className = 'contact-item';
                    contactDiv.innerHTML = `
                        <span>${contact.name} (${contact.email})</span>
                        <button type="button" class="btn-remove" onclick="removeContact(${i})">Remover</button>
                    `;
                    list.appendChild(contactDiv);
                });
            }
            break;

        case 11:
            if (userData.background) {
                const textarea = document.getElementById('background');
                if (textarea) textarea.value = userData.background;
            }
            break;
    }
}

// Update progress bar
function updateProgressBar() {
    const percentage = Math.round((currentStep / totalSteps) * 100);
    const progressFill = document.querySelector('.progress-fill');
    const progressText = document.querySelector('.progress-text');

    if (progressFill) {
        progressFill.style.width = `${percentage}%`;
    }

    if (progressText) {
        progressText.textContent = `Passo ${currentStep} de ${totalSteps}`;
    }
}

// Update button states
function updateButtons() {
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');

    if (backBtn) {
        backBtn.style.display = currentStep === 1 ? 'none' : 'inline-block';
    }

    if (nextBtn) {
        nextBtn.textContent = currentStep === totalSteps ? 'FINALIZAR' : 'PRÓXIMO';
    }
}

// Finish questionnaire
async function finishQuestionnaire() {
    const user = getCurrentUser();
    if (!user) return;

    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('users')
            .update({
                first_login_completed: true,
                questionnaire_data: userData,
                questionnaire_step: totalSteps,
                updated_at: new Date().toISOString()
            })
            .eq('id', user.id);

        if (error) throw error;

        // Update session storage
        user.first_login_completed = true;
        sessionStorage.setItem('wardUser', JSON.stringify(user));

        // Redirect to dashboard
        showSuccess('Questionário concluído com sucesso!');
        setTimeout(() => {
            redirectToDashboard(user);
        }, 1500);

    } catch (error) {
        console.error('Error finishing questionnaire:', error);
        showError('Erro ao finalizar questionário. Tente novamente.');
    }
}

// Show error message
function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
        setTimeout(() => {
            errorDiv.style.display = 'none';
        }, 5000);
    }
}

// Show success message
function showSuccess(message) {
    const successDiv = document.getElementById('successMessage');
    if (successDiv) {
        successDiv.textContent = message;
        successDiv.style.display = 'block';
    }
}

// Show save indicator
function showSaveIndicator() {
    const saveIndicator = document.getElementById('saveIndicator');
    if (saveIndicator) {
        saveIndicator.style.display = 'block';
        setTimeout(() => {
            saveIndicator.style.display = 'none';
        }, 2000);
    }
}
