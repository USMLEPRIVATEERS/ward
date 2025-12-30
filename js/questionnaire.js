// Ward Academy - Questionnaire Logic
// Manages multi-page questionnaire with progress saving

let currentPage = 1;
const totalPages = 8;
let currentUser = getCurrentUser();
let formData = {};

if (!currentUser) {
    window.location.href = 'index.html';
}

// Initialize questionnaire
async function initQuestionnaire() {
    // Load saved progress
    await loadProgress();

    // Setup event listeners
    setupEventListeners();

    // Populate UWorld systems list (Page 3)
    populateUWorldSystems();

    // Update progress bar
    updateProgressBar();

    // Show current page
    showPage(currentPage);
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation buttons
    document.getElementById('prevBtn').addEventListener('click', previousPage);
    document.getElementById('nextBtn').addEventListener('click', nextPage);
    document.getElementById('finishBtn').addEventListener('click', finishQuestionnaire);
    document.getElementById('saveLaterBtn').addEventListener('click', saveLater);

    // Page 2: USMLE sliders
    setupSliders();

    // Page 2: Visa conditional
    document.querySelectorAll('input[name="hasVisa"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('visaTypeGroup').classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    // Page 2: Current stage conditional
    document.getElementById('currentStage').addEventListener('change', (e) => {
        document.getElementById('otherStageGroup').classList.toggle('hidden', e.target.value !== 'other');
    });

    // Page 3: UWorld conditionals
    setupUWorldConditionals();

    // Page 4: English conditionals
    setupEnglishConditionals();

    // Page 5: Anki conditionals
    setupAnkiConditionals();

    // Page 6: Research conditionals
    setupResearchConditionals();

    // Page 7: Rotations
    setupRotationsHandlers();

    // Page 8: Background conditionals
    setupBackgroundConditionals();
}

// Setup sliders for Page 2
function setupSliders() {
    const sliders = [
        { id: 'firstPassSlider', valueId: 'firstPassValue', suffix: ' meses' },
        { id: 'secondPassSlider', valueId: 'secondPassValue', suffix: ' meses' },
        { id: 'dedicatedSlider', valueId: 'dedicatedValue', suffix: ' mês' }
    ];

    sliders.forEach(slider => {
        const element = document.getElementById(slider.id);
        const valueDisplay = document.getElementById(slider.valueId);

        element.addEventListener('input', (e) => {
            const value = parseInt(e.target.value);
            valueDisplay.textContent = value;
            // Update suffix for singular/plural
            if (slider.suffix.includes('mês')) {
                valueDisplay.nextSibling.textContent = value === 1 ? ' mês' : ' meses';
            }
        });
    });
}

// Setup UWorld conditional displays
function setupUWorldConditionals() {
    document.querySelectorAll('input[name="uworldPurchased"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('uworldDetailsSection').classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    document.querySelectorAll('input[name="uworldActivated"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const activated = e.target.value === 'yes';
            document.getElementById('uworldActivatedSection').classList.toggle('hidden', !activated);
            document.getElementById('uworldNotActivatedSection').classList.toggle('hidden', activated);
        });
    });
}

// Setup English conditional displays (Page 4)
function setupEnglishConditionals() {
    document.querySelectorAll('input[name="oetTaken"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('oetScoresGroup').classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    document.querySelectorAll('input[name="takingClasses"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('englishSchoolGroup').classList.toggle('hidden', e.target.value !== 'yes');
        });
    });
}

// Setup Anki conditional displays
function setupAnkiConditionals() {
    document.querySelectorAll('input[name="ankiDownloaded"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('ankiDetailsGroup').classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    document.querySelectorAll('input[name="ankiUsed"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const isUsed = e.target.value === 'yes';
            // Show all the detailed Anki questions if they've used it
            if (isUsed) {
                document.getElementById('ankiDetailsGroup')?.classList.remove('hidden');
            }
        });
    });
}

// Setup Research conditional displays
function setupResearchConditionals() {
    // Systematic review participation conditional
    document.querySelectorAll('input[name="systematicReview"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const value = e.target.value;
            // Show details group if "outro" is selected
            const showDetails = value === 'outro';
            // Show status group if any option except "no" is selected
            const showStatus = value !== 'no';

            document.getElementById('sysRevDetailsGroup')?.classList.toggle('hidden', !showDetails);
            document.getElementById('sysRevStatusGroup')?.classList.toggle('hidden', !showStatus);
        });
    });

    // Contacts conditional
    document.querySelectorAll('input[name="hasContacts"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('contactsSection').classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    // Add contact button
    document.getElementById('addContactBtn')?.addEventListener('click', addContactField);
}

// Setup Rotations handlers
function setupRotationsHandlers() {
    // Clerkship conditional
    document.querySelectorAll('input[name="didClerkship"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('clerkshipDetailsGroup')?.classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    // Observership conditional
    document.querySelectorAll('input[name="hasObservership"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('observershipDetailsGroup')?.classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    // Future observerships conditional
    document.querySelectorAll('input[name="plansFutureObs"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('futureObsGroup')?.classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    // Add observership button
    document.getElementById('addObservershipBtn')?.addEventListener('click', addObservershipField);
}

// Setup Background conditional displays (Page 8)
function setupBackgroundConditionals() {
    // Current location conditional - shows different question sets
    document.querySelectorAll('input[name="currentLocation"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const location = e.target.value;

            // Show "other country" field if needed
            document.getElementById('locationOtherGroup')?.classList.toggle('hidden', location !== 'outro');

            // Show Brasil/Other questions or USA questions based on location
            const showBrazilOther = (location === 'brasil' || location === 'outro');
            const showUSA = (location === 'eua');

            document.getElementById('brazilOtherQuestions')?.classList.toggle('hidden', !showBrazilOther);
            document.getElementById('usaQuestions')?.classList.toggle('hidden', !showUSA);
        });
    });

    // Works in USA conditional (within USA questions)
    document.querySelectorAll('input[name="worksUSA"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('howGotJobGroup')?.classList.toggle('hidden', e.target.value !== 'yes');
        });
    });

    // Has children conditional
    document.querySelectorAll('input[name="hasChildren"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            document.getElementById('childrenCountGroup')?.classList.toggle('hidden', e.target.value !== 'yes');
        });
    });
}

// Add contact field (Page 6)
function addContactField() {
    const container = document.getElementById('contactsList');
    const index = container.children.length;

    const contactDiv = document.createElement('div');
    contactDiv.className = 'contact-field';
    contactDiv.innerHTML = `
        <div class="form-row">
            <input type="text" placeholder="Nome" class="contact-name">
            <input type="text" placeholder="Especialidade" class="contact-specialty">
            <input type="text" placeholder="Instituição" class="contact-institution">
            <button type="button" class="btn btn-sm btn-danger remove-contact">Remover</button>
        </div>
    `;

    container.appendChild(contactDiv);

    contactDiv.querySelector('.remove-contact').addEventListener('click', () => {
        container.removeChild(contactDiv);
    });
}

// Add observership field (Page 7)
function addObservershipField(isPlanned) {
    const container = isPlanned
        ? document.getElementById('plannedObservershipsList')
        : document.getElementById('observershipsList');

    const obsDiv = document.createElement('div');
    obsDiv.className = 'observership-field';
    obsDiv.innerHTML = `
        <div class="observership-card">
            <div class="form-row">
                <div class="form-group">
                    <label>Instituição</label>
                    <input type="text" class="obs-institution">
                </div>
                <div class="form-group">
                    <label>${isPlanned ? 'Quando planeja' : 'Ano que fez'}</label>
                    <input type="${isPlanned ? 'month' : 'number'}" class="obs-year" ${!isPlanned ? 'min="2000" max="2030"' : ''}>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label>Especialidade</label>
                    <input type="text" class="obs-specialty">
                </div>
                <div class="form-group">
                    <label>Setting</label>
                    <select class="obs-setting">
                        <option value="">Selecione...</option>
                        <option value="private_practice">Clínica Privada</option>
                        <option value="hospital">Hospital</option>
                    </select>
                </div>
            </div>
            ${!isPlanned ? `
                <div class="form-row">
                    <div class="form-group">
                        <label>Custo aproximado (USD)</label>
                        <input type="number" class="obs-cost" min="0">
                    </div>
                    <div class="form-group">
                        <label>Conseguiu carta de recomendação?</label>
                        <select class="obs-lor">
                            <option value="">Selecione...</option>
                            <option value="yes">Sim</option>
                            <option value="no">Não</option>
                        </select>
                    </div>
                </div>
                <div class="form-group">
                    <label>Comentários</label>
                    <textarea class="obs-comments" rows="2"></textarea>
                </div>
            ` : ''}
            <button type="button" class="btn btn-sm btn-danger remove-observership">Remover</button>
        </div>
    `;

    container.appendChild(obsDiv);

    obsDiv.querySelector('.remove-observership').addEventListener('click', () => {
        container.removeChild(obsDiv);
    });
}

// Populate UWorld systems (Page 3)
function populateUWorldSystems() {
    if (!UWORLD_DATA || !UWORLD_DATA.step1) return;

    const container = document.getElementById('uworldSystemsList');

    UWORLD_DATA.step1.systems.forEach((system, sysIndex) => {
        const systemDiv = document.createElement('div');
        systemDiv.className = 'system-item';

        const systemHeader = document.createElement('div');
        systemHeader.className = 'system-header';
        systemHeader.innerHTML = `
            <input type="checkbox" class="system-checkbox" data-system="${sysIndex}">
            <span class="system-name">${system.name}</span>
            <button type="button" class="toggle-categories">▼</button>
        `;

        const categoriesList = document.createElement('div');
        categoriesList.className = 'categories-list hidden';

        system.categories.forEach((category, catIndex) => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category-item';
            categoryDiv.innerHTML = `
                <input type="checkbox" class="category-checkbox" data-system="${sysIndex}" data-category="${catIndex}">
                <span class="category-name">${category}</span>
                <button type="button" class="difficulty-btn" data-system="${sysIndex}" data-category="${catIndex}">🆘</button>
                <input type="text" class="difficulty-notes hidden" placeholder="O que achou difícil?">
            `;
            categoriesList.appendChild(categoryDiv);
        });

        systemDiv.appendChild(systemHeader);
        systemDiv.appendChild(categoriesList);
        container.appendChild(systemDiv);

        // Toggle categories
        systemHeader.querySelector('.toggle-categories').addEventListener('click', function() {
            categoriesList.classList.toggle('hidden');
            this.textContent = categoriesList.classList.contains('hidden') ? '▼' : '▲';
        });

        // System checkbox (select all categories)
        systemHeader.querySelector('.system-checkbox').addEventListener('change', function() {
            categoriesList.querySelectorAll('.category-checkbox').forEach(cb => {
                cb.checked = this.checked;
            });
        });

        // Difficulty button
        categoriesList.querySelectorAll('.difficulty-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                this.classList.toggle('active');
                const notesInput = this.nextElementSibling;
                notesInput.classList.toggle('hidden');
            });
        });
    });
}

// Navigation functions
function previousPage() {
    if (currentPage > 1) {
        saveCurrentPage();
        currentPage--;
        showPage(currentPage);
        updateProgressBar();
    }
}

async function nextPage() {
    if (validateCurrentPage()) {
        await saveCurrentPage();
        currentPage++;
        showPage(currentPage);
        updateProgressBar();
    }
}

async function saveLater() {
    await saveCurrentPage();
    await updateProgress(currentPage, false);
    alert('Progresso salvo! Você pode continuar depois.');
    window.location.href = 'dashboard.html';
}

async function finishQuestionnaire() {
    if (!validateCurrentPage()) return;

    await saveCurrentPage();
    await updateProgress(totalPages, true);

    // Create default landmarks
    await createDefaultLandmarks();

    alert('Questionário concluído! Bem-vindo à Ward Academy! 🎉');
    window.location.href = 'dashboard.html';
}

// Validate current page
function validateCurrentPage() {
    const page = document.getElementById(`page${currentPage}`);
    const requiredFields = page.querySelectorAll('[required]');

    for (let field of requiredFields) {
        if (!field.value || (field.type === 'radio' && !page.querySelector(`input[name="${field.name}"]:checked`))) {
            alert('Por favor, preencha todos os campos obrigatórios.');
            field.focus();
            return false;
        }
    }

    return true;
}

// Show specific page
function showPage(pageNum) {
    // Hide all pages
    document.querySelectorAll('.questionnaire-page').forEach(page => {
        page.classList.remove('active');
    });

    // Show current page
    document.getElementById(`page${pageNum}`).classList.add('active');

    // Update page number display
    document.getElementById('currentPageNum').textContent = pageNum;

    // Update buttons
    document.getElementById('prevBtn').style.display = pageNum === 1 ? 'none' : 'inline-block';
    document.getElementById('nextBtn').style.display = pageNum === totalPages ? 'none' : 'inline-block';
    document.getElementById('finishBtn').style.display = pageNum === totalPages ? 'inline-block' : 'none';

    // Scroll to top
    window.scrollTo(0, 0);
}

// Update progress bar
function updateProgressBar() {
    const percent = (currentPage / totalPages) * 100;
    document.getElementById('progressBar').style.width = percent + '%';
}

// Save current page data
async function saveCurrentPage() {
    const pageData = {};
    const page = document.getElementById(`page${currentPage}`);

    // Collect all form data from current page
    page.querySelectorAll('input, select, textarea').forEach(field => {
        if (field.type === 'radio') {
            if (field.checked) pageData[field.name] = field.value;
        } else if (field.type === 'checkbox') {
            if (field.name) {
                if (!pageData[field.name]) pageData[field.name] = [];
                if (field.checked) pageData[field.name].push(field.value);
            }
        } else if (field.id) {
            pageData[field.id] = field.value;
        }
    });

    // Save to appropriate table based on page
    try {
        await savePageData(currentPage, pageData);
    } catch (error) {
        console.error('Error saving page data:', error);
    }
}

// Save page data to Supabase
async function savePageData(pageNum, data) {
    const sb = initSupabase();

    switch(pageNum) {
        case 1: // Personal info
            await sb.from('user_profiles').upsert({
                user_id: currentUser.id,
                full_name: data.fullName,
                email_confirmed: data.email,
                cpf: data.cpf,
                orcid: data.orcid,
                address_line1: data.addressLine1,
                address_line2: data.addressLine2,
                city: data.city,
                state_province: data.stateProvince,
                postal_code: data.postalCode,
                country: data.country,
                medical_school: data.medicalSchool,
                medical_graduation_date: data.graduationDate,
                current_institution: data.currentInstitution,
                current_specialty: data.currentSpecialty,
                desired_us_specialty: data.desiredSpecialty,
                updated_at: new Date().toISOString()
            });
            break;

        case 2: // USMLE info
            await sb.from('usmle_info').upsert({
                user_id: currentUser.id,
                pathway: data.pathway,
                has_us_visa: data.hasVisa === 'yes',
                visa_type: data.visaType,
                current_stage: data.currentStage,
                current_stage_other: data.otherStage,
                next_exam_date: data.nextExamDate,
                first_pass_months: parseInt(data.firstPassSlider) || 6,
                second_pass_months: parseInt(data.secondPassSlider) || 2,
                dedicated_months: parseInt(data.dedicatedSlider) || 1,
                updated_at: new Date().toISOString()
            });
            break;

        case 3: // UWorld info
            await sb.from('uworld_info').upsert({
                user_id: currentUser.id,
                purchased: data.uworldPurchased === 'yes',
                activated: data.uworldActivated === 'yes',
                expiration_date: data.expirationDate,
                subscription_length: data.subscriptionLength,
                total_questions_done: parseInt(data.totalQuestions) || 0,
                overall_percentage: parseFloat(data.overallPercentage) || 0,
                lowest_percentage: parseFloat(data.lowestPercentage) || 0,
                lowest_percentage_system: data.lowestSystem,
                highest_percentage: parseFloat(data.highestPercentage) || 0,
                highest_percentage_system: data.highestSystem,
                updated_at: new Date().toISOString()
            });
            // Save completed systems/categories separately
            // (would need more complex logic here)
            break;

        case 4: // English
            await sb.from('english_proficiency').upsert({
                user_id: currentUser.id,
                // OET scores
                oet_taken: data.oetTaken === 'yes',
                oet_listening: parseFloat(data.oetListening) || null,
                oet_reading: parseFloat(data.oetReading) || null,
                oet_writing: parseFloat(data.oetWriting) || null,
                oet_speaking: parseFloat(data.oetSpeaking) || null,
                // English classes
                taking_classes: data.takingClasses === 'yes',
                english_school_name: data.englishSchool || null,
                // Reading comprehension
                understands_uworld: data.understandsUworld === 'yes',
                frequent_word_lookup: data.frequentWordLookup === 'yes',
                needs_translation: data.needsTranslation === 'yes',
                // Listening comprehension
                understands_lectures: data.understandsLectures === 'yes',
                listening_difficulty: data.listeningDifficulty === 'yes',
                updated_at: new Date().toISOString()
            });
            break;

        case 5: // Anki
            // Collect devices from checkboxes
            const devices = [];
            document.querySelectorAll('input[name="devices"]:checked').forEach(cb => {
                devices.push(cb.value);
            });

            await sb.from('anki_info').upsert({
                user_id: currentUser.id,
                downloaded: data.ankiDownloaded === 'yes',
                used: data.ankiUsed === 'yes',
                uses_anking: data.usesAnking === 'yes',
                usage_frequency: data.ankiUsageFreq || null,
                creates_own_cards: data.createsOwnCards || null,
                devices_used: devices,
                primary_device: data.primaryDevice || null,
                average_cards_per_day: parseInt(data.avgCardsPerDay) || 0,
                using_since: data.usingSince || null,
                updated_at: new Date().toISOString()
            });
            break;

        case 6: // Research
            await sb.from('research_experience').upsert({
                user_id: currentUser.id,
                // Confirmation data
                orcid_id: data.confirmOrcid || data.researchOrcid,
                research_email: data.confirmEmail,
                full_name: data.confirmName,
                research_institution: data.confirmInstitution,
                research_specialty: data.confirmSpecialty,
                research_department: data.confirmDepartment,
                // Experience level
                experience_level: data.researchExpLevel,
                // Systematic review
                participated_systematic_review: data.systematicReview !== 'no',
                systematic_review_role: data.systematicReview,
                systematic_review_details: data.sysRevDetails || null,
                systematic_review_status: data.sysRevStatus || null,
                // Research areas and institutions
                research_area_1: data.researchArea1 || null,
                research_area_2: data.researchArea2 || null,
                research_area_3: data.researchArea3 || null,
                research_area_4: data.researchArea4 || null,
                research_area_5: data.researchArea5 || null,
                target_institution_1: data.targetInstitution1 || null,
                target_institution_2: data.targetInstitution2 || null,
                target_institution_3: data.targetInstitution3 || null,
                // Ward research
                ward_research_timing: data.wardResearchTiming || null,
                collaboration_stages: data.collaborationStages || null,
                // Contacts
                has_research_contacts: data.hasContacts === 'yes',
                updated_at: new Date().toISOString()
            });

            // Save contacts if any
            if (data.hasContacts === 'yes') {
                // Would need to collect contacts from the dynamic list
                // This would require more complex logic
            }
            break;

        case 7: // Clinical rotations
            await sb.from('clinical_rotations').upsert({
                user_id: currentUser.id,
                // Clerkship
                did_clerkship: data.didClerkship === 'yes',
                clerkship_details: data.clerkshipDetails || null,
                // Observerships
                has_observership: data.hasObservership === 'yes',
                observership_count: parseInt(data.observershipCount) || 0,
                // Future observerships
                plans_future_obs: data.plansFutureObs === 'yes',
                future_obs_count: parseInt(data.futureObsCount) || 0,
                future_obs_when: data.futureObsWhen || null,
                future_obs_institutions: data.futureObsInstitutions || null,
                future_obs_specialties: data.futureObsSpecialties || null,
                future_obs_type: data.futureObsType || null,
                updated_at: new Date().toISOString()
            });

            // Save observership details would need more complex logic for the dynamic list
            break;

        case 8: // Personal background
            await sb.from('personal_background').upsert({
                user_id: currentUser.id,
                current_location: data.currentLocation,
                other_location: data.otherLocation || null,
                // Brasil/Other location questions
                life_story: data.lifeStory || null,
                family_situation: data.familySituation || null,
                work_situation: data.workSituation || null,
                why_usmle: data.whyUSMLE || null,
                family_agreement: data.familyAgreement || null,
                // USA location questions
                how_moved_to_usa: data.howMovedUSA || null,
                visa_type: data.visaTypeUSA || null,
                how_got_visa: data.howGotVisa || null,
                works_in_usa: data.worksUSA === 'yes',
                how_got_job: data.howGotJob || null,
                life_story_usa: data.lifeStoryUSA || null,
                why_usmle_usa: data.whyUSMLE_USA || null,
                // Standard family questions
                has_children: data.hasChildren === 'yes',
                children_count: parseInt(data.childrenCount) || 0,
                is_married: data.isMarried === 'yes',
                personal_notes: data.personalNotes || null,
                updated_at: new Date().toISOString()
            });
            break;
    }
}

// Load saved progress
async function loadProgress() {
    try {
        const sb = initSupabase();
        const { data: progress } = await sb
            .from('questionnaire_progress')
            .select('*')
            .eq('user_id', currentUser.id)
            .maybeSingle();

        if (progress && !progress.completed) {
            currentPage = progress.current_page || 1;
            // Load saved data for each page
            await loadSavedData();
        }
    } catch (error) {
        console.error('Error loading progress:', error);
    }
}

// Update progress in database
async function updateProgress(page, completed) {
    try {
        const sb = initSupabase();
        await sb.from('questionnaire_progress').upsert({
            user_id: currentUser.id,
            current_page: page,
            total_pages: totalPages,
            completed: completed,
            updated_at: new Date().toISOString()
        });

        if (completed) {
            await sb.from('users').update({
                first_login: false
            }).eq('id', currentUser.id);
        }
    } catch (error) {
        console.error('Error updating progress:', error);
    }
}

// Load saved data from database
async function loadSavedData() {
    // Load data from all tables and populate forms
    // This would be quite extensive - simplified here
}

// Create default landmarks after questionnaire completion
async function createDefaultLandmarks() {
    try {
        const sb = initSupabase();

        // Get default landmarks from database
        const { data: defaults } = await sb
            .from('default_landmarks')
            .select('*')
            .order('display_order');

        if (defaults && defaults.length > 0) {
            // Create landmarks for this user
            const landmarks = defaults.map(def => ({
                user_id: currentUser.id,
                landmark_type: def.landmark_type,
                mentor_name: def.mentor_name,
                call_number: def.call_number,
                title: def.title,
                description: def.description,
                display_order: def.display_order,
                show_condition: def.show_condition,
                is_completed: false,
                is_urgent: false
            }));

            await sb.from('landmarks').insert(landmarks);
        }
    } catch (error) {
        console.error('Error creating default landmarks:', error);
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initQuestionnaire);
