// Supabase Configuration
// Ward Academy Student Tracking Platform

// ============================================
// SUPABASE CLIENT INITIALIZATION
// ============================================

// Supabase project credentials - Ward Academy
const SUPABASE_URL = 'https://lbxjqejzabylfqdoknhh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxieGpxZWp6YWJ5bGZxZG9rbmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDEzMDEsImV4cCI6MjA4MjY3NzMwMX0.bbtQiSh87-DNZc_PGlZwPZR4_o3IveWLV_RooSO4luA';

// Initialize Supabase client
// Note: Include the Supabase JavaScript library in your HTML:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

let supabase;

function initSupabase() {
    if (typeof supabase === 'undefined') {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabase;
}

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================

async function login(email, password) {
    try {
        const supabase = initSupabase();

        // Query custom users table
        const { data, error } = await supabase
            .from('users')
            .select('*, user_profiles(*)')
            .eq('email', email)
            .single();

        if (error) throw error;

        if (!data) {
            throw new Error('Invalid credentials');
        }

        // In production, you should verify password hash
        // For now, storing user in session
        sessionStorage.setItem('user', JSON.stringify(data));
        sessionStorage.setItem('userId', data.id);
        sessionStorage.setItem('userType', data.user_type);

        return { success: true, user: data };
    } catch (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
    }
}

async function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

function getCurrentUser() {
    const userStr = sessionStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

function getUserId() {
    return sessionStorage.getItem('userId');
}

function getUserType() {
    return sessionStorage.getItem('userType');
}

function isLoggedIn() {
    return !!getCurrentUser();
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'index.html';
    }
}

function isMentor() {
    const userType = getUserType();
    return userType && userType.startsWith('mentor_');
}

function isStudent() {
    return getUserType() === 'student';
}

// ============================================
// USER PROFILE FUNCTIONS
// ============================================

async function getUserProfile(userId) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching profile:', error);
        return { success: false, error: error.message };
    }
}

async function updateUserProfile(userId, profileData) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('user_profiles')
            .upsert({ user_id: userId, ...profileData, updated_at: new Date() })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
    }
}

async function changePassword(userId, oldPassword, newPassword) {
    try {
        const supabase = initSupabase();
        // In production, verify old password and hash new password
        const { data, error } = await supabase
            .from('users')
            .update({ password_hash: newPassword, updated_at: new Date() })
            .eq('id', userId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error changing password:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// QUESTIONNAIRE FUNCTIONS
// ============================================

async function getQuestionnaireProgress(userId) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('questionnaire_progress')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (error && error.code !== 'PGRST116') throw error;
        return { success: true, data: data || { current_page: 1, completed: false } };
    } catch (error) {
        console.error('Error fetching questionnaire progress:', error);
        return { success: false, error: error.message };
    }
}

async function saveQuestionnaireProgress(userId, pageNumber, completed = false) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('questionnaire_progress')
            .upsert({
                user_id: userId,
                current_page: pageNumber,
                completed: completed,
                updated_at: new Date()
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error saving questionnaire progress:', error);
        return { success: false, error: error.message };
    }
}

// Save specific questionnaire data
async function saveUSMLEInfo(userId, data) {
    try {
        const supabase = initSupabase();
        const { data: result, error } = await supabase
            .from('usmle_info')
            .upsert({ user_id: userId, ...data, updated_at: new Date() })
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function saveUWorldInfo(userId, data) {
    try {
        const supabase = initSupabase();
        const { data: result, error } = await supabase
            .from('uworld_info')
            .upsert({ user_id: userId, ...data, updated_at: new Date() })
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function saveEnglishProficiency(userId, data) {
    try {
        const supabase = initSupabase();
        const { data: result, error } = await supabase
            .from('english_proficiency')
            .upsert({ user_id: userId, ...data, updated_at: new Date() })
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function saveAnkiInfo(userId, data) {
    try {
        const supabase = initSupabase();
        const { data: result, error } = await supabase
            .from('anki_info')
            .upsert({ user_id: userId, ...data, updated_at: new Date() })
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function saveResearchExperience(userId, data) {
    try {
        const supabase = initSupabase();
        const { data: result, error } = await supabase
            .from('research_experience')
            .upsert({ user_id: userId, ...data, updated_at: new Date() })
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function savePersonalBackground(userId, data) {
    try {
        const supabase = initSupabase();
        const { data: result, error } = await supabase
            .from('personal_background')
            .upsert({ user_id: userId, ...data, updated_at: new Date() })
            .select();

        if (error) throw error;
        return { success: true, data: result };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// DAILY UPDATES
// ============================================

async function saveDailyUpdate(userId, text, status) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('daily_updates')
            .insert({
                user_id: userId,
                update_text: text,
                status: status
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getDailyUpdates(userId, limit = 10) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('daily_updates')
            .select('*')
            .eq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// DIARY FUNCTIONS
// ============================================

async function saveStudyDiaryEntry(userId, date, text) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('study_diary')
            .upsert({
                user_id: userId,
                entry_date: date,
                entry_text: text,
                updated_at: new Date()
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getStudyDiaryEntries(userId, limit = 30) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('study_diary')
            .select('*')
            .eq('user_id', userId)
            .order('entry_date', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteStudyDiaryEntry(entryId) {
    try {
        const supabase = initSupabase();
        const { error } = await supabase
            .from('study_diary')
            .delete()
            .eq('id', entryId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function saveUWorldDiaryEntry(userId, entryData) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('uworld_diary')
            .insert({
                user_id: userId,
                ...entryData,
                updated_at: new Date()
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function getUWorldDiaryEntries(userId, limit = 30) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('uworld_diary')
            .select('*')
            .eq('user_id', userId)
            .order('entry_date', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// LANDMARKS FUNCTIONS
// ============================================

async function getLandmarks(userId) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('landmarks')
            .select('*')
            .eq('user_id', userId)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateLandmark(landmarkId, updates) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('landmarks')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', landmarkId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createLandmark(userId, landmarkData) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('landmarks')
            .insert({
                user_id: userId,
                ...landmarkData
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// SCHEDULE FUNCTIONS
// ============================================

async function getSchedule(userId) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('schedules')
            .select('*')
            .eq('user_id', userId)
            .order('id', { ascending: true });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function importSchedule(userId, scheduleData) {
    try {
        const supabase = initSupabase();

        // Delete existing schedule
        await supabase
            .from('schedules')
            .delete()
            .eq('user_id', userId);

        // Insert new schedule
        const { data, error } = await supabase
            .from('schedules')
            .insert(scheduleData.map(item => ({ user_id: userId, ...item })))
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateScheduleItem(itemId, completed) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('schedules')
            .update({ completed, updated_at: new Date() })
            .eq('id', itemId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function reportDelay(userId, startDate, endDate, reason) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('schedule_delays')
            .insert({
                user_id: userId,
                start_date: startDate,
                end_date: endDate,
                reason: reason
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// LINKS REPOSITORY FUNCTIONS
// ============================================

async function getLinks(category = null) {
    try {
        const supabase = initSupabase();
        let query = supabase
            .from('links')
            .select('*')
            .order('created_at', { ascending: false });

        if (category) {
            query = query.eq('category', category);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addLink(userId, linkData) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('links')
            .insert({
                added_by: userId,
                ...linkData
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// BLOG FUNCTIONS
// ============================================

async function getBlogPosts(limit = 50) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('blog_posts')
            .select(`
                *,
                users:author_id (email, user_type, user_profiles(full_name))
            `)
            .order('is_pinned', { ascending: false })
            .order('created_at', { ascending: false })
            .limit(limit);

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createBlogPost(userId, content) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('blog_posts')
            .insert({
                author_id: userId,
                content: content
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function likeBlogPost(userId, postId, isLike) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('blog_likes')
            .upsert({
                user_id: userId,
                post_id: postId,
                is_like: isLike
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function pinBlogPost(postId, duration) {
    try {
        const supabase = initSupabase();
        let pinnedUntil = null;

        if (duration === '1week') {
            pinnedUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
        } else if (duration === '1month') {
            pinnedUntil = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        } else if (duration === 'permanent') {
            pinnedUntil = new Date('2099-12-31');
        }

        const { data, error } = await supabase
            .from('blog_posts')
            .update({
                is_pinned: true,
                pinned_until: pinnedUntil,
                updated_at: new Date()
            })
            .eq('id', postId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// RESEARCH FUNCTIONS
// ============================================

async function getResearchProjects(userId = null) {
    try {
        const supabase = initSupabase();
        const userType = getUserType();

        let query = supabase
            .from('research_projects')
            .select(`
                *,
                research_authors(
                    user_id,
                    users(user_profiles(full_name))
                )
            `)
            .order('created_at', { ascending: false });

        // If student, only show their projects
        if (userType === 'student' && userId) {
            query = query.or(`created_by.eq.${userId},research_authors.user_id.eq.${userId}`);
        }

        const { data, error } = await query;

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createResearchProject(userId, projectData) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('research_projects')
            .insert({
                created_by: userId,
                ...projectData
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function updateResearchProject(projectId, updates) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('research_projects')
            .update({ ...updates, updated_at: new Date() })
            .eq('id', projectId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function addResearchAuthors(projectId, userIds) {
    try {
        const supabase = initSupabase();
        const authors = userIds.map(userId => ({
            project_id: projectId,
            user_id: userId
        }));

        const { data, error } = await supabase
            .from('research_authors')
            .insert(authors)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// MESSAGES FUNCTIONS
// ============================================

async function getMessages(userId) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('messages')
            .select(`
                *,
                sender:sender_id(user_profiles(full_name))
            `)
            .eq('recipient_id', userId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function markMessageAsRead(messageId) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('messages')
            .update({ is_read: true })
            .eq('id', messageId)
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteMessage(messageId) {
    try {
        const supabase = initSupabase();
        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// ============================================
// ADMIN FUNCTIONS (Marcos only)
// ============================================

async function getAllUsers() {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('users')
            .select('*, user_profiles(*)')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function createUser(email, password, userType) {
    try {
        const supabase = initSupabase();
        const { data, error } = await supabase
            .from('users')
            .insert({
                email: email,
                password_hash: password, // Should be hashed in production
                user_type: userType
            })
            .select();

        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

async function deleteUser(userId) {
    try {
        const supabase = initSupabase();
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('id', userId);

        if (error) throw error;
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// Export functions for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initSupabase,
        login,
        logout,
        getCurrentUser,
        getUserId,
        getUserType,
        isLoggedIn,
        requireAuth,
        isMentor,
        isStudent
    };
}
