// Ward Academy - Reusable Header Component
// This ensures consistent navigation across all pages

function renderHeader(activePage = '') {
    const currentUser = getCurrentUser();
    if (!currentUser) return '';

    const isMentor = currentUser.user_type && currentUser.user_type.startsWith('mentor_');
    const isAdmin = currentUser.user_type === 'mentor_marcos';

    // Check if user has diaries enabled
    let studyDiaryEnabled = false;
    let uworldDiaryEnabled = false;

    // Try to get user settings (async, but we'll update dynamically)
    getUserSettings(currentUser.id).then(settings => {
        if (settings) {
            studyDiaryEnabled = settings.study_diary_enabled;
            uworldDiaryEnabled = settings.uworld_diary_enabled;
            // Re-render header with updated settings
            updateHeaderLinks(studyDiaryEnabled, uworldDiaryEnabled);
        }
    }).catch(() => {});

    const nav = [];

    // Dashboard (everyone)
    nav.push({ href: 'dashboard.html', label: 'Dashboard', page: 'dashboard' });

    // Profile (everyone)
    nav.push({ href: 'profile.html', label: 'Perfil', page: 'profile' });

    // Landmarks (students and mentors)
    nav.push({ href: 'landmarks.html', label: 'Landmarks', page: 'landmarks' });

    // Schedule (students and mentors)
    if (!isAdmin) {
        nav.push({ href: 'schedule.html', label: 'Cronograma', page: 'schedule' });
    }

    // Study Diary (if enabled - will be updated dynamically)
    nav.push({
        href: 'study-diary.html',
        label: 'Diário de Estudos',
        page: 'study-diary',
        id: 'nav-study-diary',
        class: 'hidden'
    });

    // UWorld Diary (if enabled - will be updated dynamically)
    nav.push({
        href: 'uworld-diary.html',
        label: 'Diário UWorld',
        page: 'uworld-diary',
        id: 'nav-uworld-diary',
        class: 'hidden'
    });

    // Links (everyone)
    nav.push({ href: 'links.html', label: 'Links', page: 'links' });

    // Blog (everyone)
    nav.push({ href: 'blog.html', label: 'Blog', page: 'blog' });

    // Research (everyone)
    nav.push({ href: 'research.html', label: 'Pesquisa', page: 'research' });

    // Students page (mentors only)
    if (isMentor) {
        nav.push({ href: 'students.html', label: 'Alunos', page: 'students' });
    }

    // Admin (Marcos only)
    if (isAdmin) {
        nav.push({ href: 'admin.html', label: 'Admin', page: 'admin' });
    }

    // Logout
    nav.push({ href: '#', label: 'Sair', page: 'logout', id: 'logoutBtn' });

    const navHTML = nav.map(item => {
        const activeClass = activePage === item.page ? 'active' : '';
        const extraClass = item.class || '';
        const idAttr = item.id ? `id="${item.id}"` : '';
        return `<a href="${item.href}" class="${activeClass} ${extraClass}" ${idAttr}>${item.label}</a>`;
    }).join('');

    return `
        <header>
            <div class="header-container">
                <h1>Ward Academy</h1>
                <nav id="mainNav">
                    ${navHTML}
                </nav>
            </div>
        </header>
    `;
}

function updateHeaderLinks(studyDiaryEnabled, uworldDiaryEnabled) {
    const studyDiaryLink = document.getElementById('nav-study-diary');
    const uworldDiaryLink = document.getElementById('nav-uworld-diary');

    if (studyDiaryLink) {
        if (studyDiaryEnabled) {
            studyDiaryLink.classList.remove('hidden');
        } else {
            studyDiaryLink.classList.add('hidden');
        }
    }

    if (uworldDiaryLink) {
        if (uworldDiaryEnabled) {
            uworldDiaryLink.classList.remove('hidden');
        } else {
            uworldDiaryLink.classList.add('hidden');
        }
    }
}

function initHeader(activePage = '') {
    const headerHTML = renderHeader(activePage);
    const headerPlaceholder = document.getElementById('header-placeholder');

    if (headerPlaceholder) {
        headerPlaceholder.innerHTML = headerHTML;
    } else {
        // Insert at beginning of body if placeholder doesn't exist
        document.body.insertAdjacentHTML('afterbegin', headerHTML);
    }

    // Setup logout handler
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
            window.location.href = 'index.html';
        });
    }
}

async function getUserSettings(userId) {
    try {
        const sb = initSupabase();
        const { data, error } = await sb
            .from('user_settings')
            .select('*')
            .eq('user_id', userId)
            .maybeSingle();

        if (error && error.code !== 'PGRST116') throw error;
        return data;
    } catch (error) {
        console.error('Error loading user settings:', error);
        return null;
    }
}
