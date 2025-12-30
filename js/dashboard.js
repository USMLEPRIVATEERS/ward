/* ============================================================================
   WARD ACADEMY - DASHBOARD LOGIC
   ============================================================================ */

// State
let currentUser = null;
let userData = {};

// Initialize Dashboard
document.addEventListener('DOMContentLoaded', async () => {
    // Require authentication
    currentUser = requireAuth();
    if (!currentUser) return;

    // Initialize dashboard
    await initDashboard();

    // Show check-in modal if needed
    checkDailyCheckin();
});

// Initialize dashboard
async function initDashboard() {
    try {
        // Load user data
        await loadUserData();

        // Update welcome message
        updateWelcomeMessage();

        // Load questionnaire progress
        await loadQuestionnaireProgress();

        // Load current preparation
        await loadCurrentPreparation();

        // Load diary settings
        await loadDiarySettings();

        // Load mentor messages
        await loadMentorMessages();

        // Load landmarks
        await loadLandmarks();

        // Setup event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Error initializing dashboard:', error);
        showError('Erro ao carregar dashboard. Tente recarregar a página.');
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
        currentUser = { ...currentUser, ...userData };
        sessionStorage.setItem('wardUser', JSON.stringify(currentUser));

    } catch (error) {
        console.error('Error loading user data:', error);
    }
}

// Update welcome message
function updateWelcomeMessage() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    if (welcomeMessage && userData.name) {
        welcomeMessage.textContent = `Bem-vindo(a), ${userData.name}! 👋`;
    }
}

// Load questionnaire progress
async function loadQuestionnaireProgress() {
    const sb = initSupabase();
    const questionnaireCard = document.getElementById('questionnaireCard');

    if (!questionnaireCard) return;

    try {
        // Check if questionnaire is completed
        if (currentUser.first_login_completed) {
            // Hide questionnaire card if completed
            questionnaireCard.style.display = 'none';
        } else {
            // Calculate progress percentage
            const step = currentUser.questionnaire_step || 0;
            const totalSteps = 11;
            const percentage = Math.round((step / totalSteps) * 100);

            // Update progress bar
            const progressBar = document.getElementById('questionnaireProgress');
            const progressText = document.getElementById('questionnaireProgressText');

            if (progressBar) progressBar.style.width = `${percentage}%`;
            if (progressText) progressText.textContent = `${percentage}% concluído`;
        }

    } catch (error) {
        console.error('Error loading questionnaire progress:', error);
    }
}

// Load current preparation
async function loadCurrentPreparation() {
    const sb = initSupabase();

    try {
        // Get current preparation from questionnaire_data or separate field
        const currentPrep = userData.questionnaire_data?.exam_taking || '';

        // Set radio button
        const radio = document.querySelector(`input[name="current_prep"][value="${currentPrep}"]`);
        if (radio) {
            radio.checked = true;
        }

    } catch (error) {
        console.error('Error loading current preparation:', error);
    }
}

// Load diary settings
async function loadDiarySettings() {
    // Get diary settings from user data
    const studyDiaryEnabled = userData.diary_study_enabled || false;
    const uworldDiaryEnabled = userData.diary_uworld_enabled || false;

    // Update toggles
    const studyToggle = document.getElementById('toggleStudyDiary');
    const uworldToggle = document.getElementById('toggleUWorldDiary');

    if (studyToggle) studyToggle.checked = studyDiaryEnabled;
    if (uworldToggle) uworldToggle.checked = uworldDiaryEnabled;

    // Show/hide navigation links
    const studyLink = document.getElementById('studyDiaryLink');
    const uworldLink = document.getElementById('uworldDiaryLink');

    if (studyLink) studyLink.style.display = studyDiaryEnabled ? 'block' : 'none';
    if (uworldLink) uworldLink.style.display = uworldDiaryEnabled ? 'block' : 'none';
}

// Load mentor messages
async function loadMentorMessages() {
    const sb = initSupabase();
    const messagesContainer = document.getElementById('mentorMessages');

    if (!messagesContainer) return;

    try {
        const { data: messages, error } = await sb
            .from('messages')
            .select(`
                *,
                sender:created_by(name)
            `)
            .eq('user_id', currentUser.id)
            .eq('is_read', false)
            .order('created_at', { ascending: false })
            .limit(5);

        if (error) throw error;

        if (!messages || messages.length === 0) {
            messagesContainer.innerHTML = '<p class="text-muted">Nenhum recado no momento.</p>';
            return;
        }

        // Render messages
        messagesContainer.innerHTML = messages.map(msg => `
            <div class="message-item">
                <div class="message-header">
                    <span class="message-author">📌 ${msg.sender?.name || 'Mentor'}</span>
                    <span class="message-date">${formatDate(msg.created_at)}</span>
                </div>
                <div class="message-text">${msg.message}</div>
                <button class="btn btn-secondary btn-sm btn-mark-read" onclick="markMessageAsRead('${msg.id}')">
                    ✓ Marcar como lido
                </button>
            </div>
        `).join('');

    } catch (error) {
        console.error('Error loading messages:', error);
        messagesContainer.innerHTML = '<p class="text-muted">Erro ao carregar recados.</p>';
    }
}

// Load landmarks
async function loadLandmarks() {
    const sb = initSupabase();
    const landmarksContainer = document.getElementById('landmarksList');

    if (!landmarksContainer) return;

    try {
        const { data: landmarks, error } = await sb
            .from('landmarks')
            .select('*')
            .eq('user_id', currentUser.id)
            .order('order_position', { ascending: true })
            .limit(5);

        if (error) throw error;

        if (!landmarks || landmarks.length === 0) {
            landmarksContainer.innerHTML = '<p class="text-muted">Nenhum landmark registrado ainda.</p>';
            return;
        }

        // Render landmarks
        landmarksContainer.innerHTML = landmarks.map(landmark => {
            const icon = landmark.completed ? '✅' : (landmark.is_urgent ? '🚨' : '⏳');
            const statusClass = landmark.completed ? 'completed' : (landmark.is_urgent ? 'urgent' : 'pending');

            return `
                <div class="landmark-item ${statusClass}">
                    <span class="landmark-icon">${icon}</span>
                    <div class="landmark-info">
                        <div class="landmark-title">${landmark.title}</div>
                        <div class="landmark-date">
                            ${landmark.completed
                                ? `Concluído em ${formatDate(landmark.completion_date)}`
                                : 'Pendente'
                            }
                        </div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Error loading landmarks:', error);
        landmarksContainer.innerHTML = '<p class="text-muted">Erro ao carregar landmarks.</p>';
    }
}

// Setup event listeners
function setupEventListeners() {
    // Current preparation form
    const prepForm = document.getElementById('currentPreparationForm');
    if (prepForm) {
        prepForm.addEventListener('submit', saveCurrent Preparation);

        // Show/hide "Other" field
        const radios = document.querySelectorAll('input[name="current_prep"]');
        radios.forEach(radio => {
            radio.addEventListener('change', (e) => {
                const otherField = document.getElementById('otherPrep');
                if (otherField) {
                    otherField.style.display = e.target.value === 'other' ? 'block' : 'none';
                }
            });
        });
    }
}

// Save current preparation
async function saveCurrentPreparation(e) {
    e.preventDefault();

    const sb = initSupabase();
    const selectedPrep = document.querySelector('input[name="current_prep"]:checked')?.value;

    if (!selectedPrep) return;

    let prepValue = selectedPrep;
    if (selectedPrep === 'other') {
        const otherField = document.getElementById('otherPrep');
        prepValue = otherField?.value || 'other';
    }

    try {
        // Update user's questionnaire_data
        const updatedData = { ...userData.questionnaire_data, exam_taking: prepValue };

        const { error } = await sb
            .from('users')
            .update({
                questionnaire_data: updatedData,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);

        if (error) throw error;

        showSuccess('Preparação atualizada com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error saving preparation:', error);
        showError('Erro ao salvar preparação. Tente novamente.');
    }
}

// Toggle diary
async function toggleDiary(type) {
    const sb = initSupabase();
    const studyToggle = document.getElementById('toggleStudyDiary');
    const uworldToggle = document.getElementById('toggleUWorldDiary');

    const studyEnabled = studyToggle?.checked || false;
    const uworldEnabled = uworldToggle?.checked || false;

    try {
        const { error } = await sb
            .from('users')
            .update({
                diary_study_enabled: studyEnabled,
                diary_uworld_enabled: uworldEnabled,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);

        if (error) throw error;

        // Update navigation links
        const studyLink = document.getElementById('studyDiaryLink');
        const uworldLink = document.getElementById('uworldDiaryLink');

        if (studyLink) studyLink.style.display = studyEnabled ? 'block' : 'none';
        if (uworldLink) uworldLink.style.display = uworldEnabled ? 'block' : 'none';

        // Update user data
        userData.diary_study_enabled = studyEnabled;
        userData.diary_uworld_enabled = uworldEnabled;

    } catch (error) {
        console.error('Error toggling diary:', error);
        showError('Erro ao atualizar configuração. Tente novamente.');
    }
}

// Mark message as read
async function markMessageAsRead(messageId) {
    const sb = initSupabase();

    try {
        const { error } = await sb
            .from('messages')
            .update({ is_read: true })
            .eq('id', messageId);

        if (error) throw error;

        // Reload messages
        await loadMentorMessages();

    } catch (error) {
        console.error('Error marking message as read:', error);
        showError('Erro ao marcar mensagem como lida.');
    }
}

// Check daily check-in
function checkDailyCheckin() {
    // Check if questionnaire is completed
    if (!currentUser.first_login_completed) {
        return; // Don't show check-in if questionnaire not completed
    }

    // Check if already showed today
    const lastCheckin = localStorage.getItem(`lastCheckin_${currentUser.id}`);
    const today = new Date().toDateString();

    if (lastCheckin === today) {
        return; // Already showed today
    }

    // Show modal after 2 seconds
    setTimeout(() => {
        const modal = document.getElementById('checkinModal');
        if (modal) modal.style.display = 'flex';
    }, 2000);
}

// Close check-in modal
function closeCheckin() {
    const modal = document.getElementById('checkinModal');
    if (modal) modal.style.display = 'none';
}

// Skip check-in
function skipCheckin() {
    localStorage.setItem(`lastCheckin_${currentUser.id}`, new Date().toDateString());
    closeCheckin();
}

// Submit check-in
async function submitCheckin() {
    const sb = initSupabase();
    const message = document.getElementById('checkinMessage')?.value || '';
    const status = document.querySelector('input[name="checkin_status"]:checked')?.value || 'tranquilo';

    try {
        const { error } = await sb
            .from('daily_checkins')
            .insert({
                user_id: currentUser.id,
                date: new Date().toISOString().split('T')[0],
                status: status,
                message: message,
                created_at: new Date().toISOString()
            });

        if (error) throw error;

        localStorage.setItem(`lastCheckin_${currentUser.id}`, new Date().toDateString());
        closeCheckin();
        showSuccess('Check-in registrado com sucesso!');
        setTimeout(() => hideSuccess(), 3000);

    } catch (error) {
        console.error('Error submitting check-in:', error);
        showError('Erro ao enviar check-in. Tente novamente.');
    }
}

// Change password
function changePassword() {
    const modal = document.getElementById('passwordModal');
    if (modal) modal.style.display = 'flex';
}

// Close password modal
function closePasswordModal() {
    const modal = document.getElementById('passwordModal');
    if (modal) modal.style.display = 'none';

    // Clear form
    const form = document.getElementById('passwordForm');
    if (form) form.reset();

    // Hide error
    const errorDiv = document.getElementById('passwordError');
    if (errorDiv) errorDiv.style.display = 'none';
}

// Submit password change
async function submitPasswordChange() {
    const sb = initSupabase();
    const currentPassword = document.getElementById('currentPassword')?.value;
    const newPassword = document.getElementById('newPassword')?.value;
    const confirmPassword = document.getElementById('confirmPassword')?.value;
    const errorDiv = document.getElementById('passwordError');

    // Validation
    if (!currentPassword || !newPassword || !confirmPassword) {
        showPasswordError('Preencha todos os campos.');
        return;
    }

    if (newPassword !== confirmPassword) {
        showPasswordError('As senhas não coincidem.');
        return;
    }

    if (newPassword.length < 6) {
        showPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
        return;
    }

    try {
        // Verify current password
        const { data: passwordCheck, error: verifyError } = await sb
            .rpc('verify_password', {
                user_id: currentUser.id,
                input_password: currentPassword
            });

        if (verifyError || !passwordCheck) {
            showPasswordError('Senha atual incorreta.');
            return;
        }

        // Hash new password
        const { data: hashedPassword, error: hashError } = await sb
            .rpc('hash_password', {
                password: newPassword
            });

        if (hashError) throw hashError;

        // Update password
        const { error: updateError } = await sb
            .from('users')
            .update({
                password_hash: hashedPassword,
                updated_at: new Date().toISOString()
            })
            .eq('id', currentUser.id);

        if (updateError) throw updateError;

        showSuccess('Senha alterada com sucesso!');
        setTimeout(() => {
            closePasswordModal();
            hideSuccess();
        }, 2000);

    } catch (error) {
        console.error('Error changing password:', error);
        showPasswordError('Erro ao alterar senha. Tente novamente.');
    }
}

// Show password error
function showPasswordError(message) {
    const errorDiv = document.getElementById('passwordError');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.style.display = 'block';
    }
}

// Utility Functions
function formatDate(dateString) {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `há ${diffDays} dias`;

    return date.toLocaleDateString('pt-BR');
}

function showError(message) {
    // Create error banner at top of page
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
    // Create success banner at top of page
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
window.toggleDiary = toggleDiary;
window.markMessageAsRead = markMessageAsRead;
window.closeCheckin = closeCheckin;
window.skipCheckin = skipCheckin;
window.submitCheckin = submitCheckin;
window.changePassword = changePassword;
window.closePasswordModal = closePasswordModal;
window.submitPasswordChange = submitPasswordChange;
window.saveCurrentPreparation = saveCurrentPreparation;
