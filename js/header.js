// Ward Academy - Reusable Header Component
// Responsive header with mobile menu

function getNavigationForUser(currentUser) {
    const userType = currentUser.user_type || 'student';
    const nav = [];

    // Dashboard - todos
    nav.push({ href: 'dashboard.html', label: 'Dashboard', page: 'dashboard', icon: '🏠' });

    // Navigation específica para cada tipo de usuário
    if (userType === 'student') {
        // ALUNOS
        nav.push({ href: 'profile.html', label: 'Meu Perfil', page: 'profile', icon: '👤' });
        nav.push({ href: 'landmarks.html', label: 'Landmarks', page: 'landmarks', icon: '🎯' });
        nav.push({ href: 'schedule.html', label: 'Cronograma', page: 'schedule', icon: '📅' });
        nav.push({ href: 'study-diary.html', label: 'Diário Estudos', page: 'study-diary', icon: '📝', conditional: 'study_diary' });
        nav.push({ href: 'uworld-diary.html', label: 'Diário UWorld', page: 'uworld-diary', icon: '📊', conditional: 'uworld_diary' });
        nav.push({ href: 'links.html', label: 'Links', page: 'links', icon: '🔗' });
        nav.push({ href: 'blog.html', label: 'Blog', page: 'blog', icon: '💬' });
        nav.push({ href: 'research.html', label: 'Pesquisa', page: 'research', icon: '🔬' });

    } else if (userType === 'mentor_marcos') {
        // MARCOS - Admin completo
        nav.push({ href: 'admin.html', label: 'Admin', page: 'admin', icon: '⚙️' });
        nav.push({ href: 'students.html', label: 'Alunos', page: 'students', icon: '👥' });
        nav.push({ href: 'landmarks.html', label: 'Landmarks', page: 'landmarks', icon: '🎯' });
        nav.push({ href: 'research.html', label: 'Pesquisas', page: 'research', icon: '🔬' });
        nav.push({ href: 'links.html', label: 'Links', page: 'links', icon: '🔗' });
        nav.push({ href: 'blog.html', label: 'Blog', page: 'blog', icon: '💬' });

    } else if (userType === 'mentor_iria') {
        // DRA IRIA - Foco em acompanhamento de alunos
        nav.push({ href: 'students.html', label: 'Alunos', page: 'students', icon: '👥' });
        nav.push({ href: 'landmarks.html', label: 'Landmarks', page: 'landmarks', icon: '🎯' });
        nav.push({ href: 'links.html', label: 'Links', page: 'links', icon: '🔗' });
        nav.push({ href: 'blog.html', label: 'Blog', page: 'blog', icon: '💬' });

    } else if (userType === 'mentor_guilherme') {
        // GUILHERME - Foco em Anki
        nav.push({ href: 'students.html', label: 'Alunos', page: 'students', icon: '👥' });
        nav.push({ href: 'landmarks.html', label: 'Landmarks', page: 'landmarks', icon: '🎯' });
        nav.push({ href: 'links.html', label: 'Links', page: 'links', icon: '🔗' });
        nav.push({ href: 'blog.html', label: 'Blog', page: 'blog', icon: '💬' });

    } else if (userType === 'mentor_romulo') {
        // ROMULO - Foco em pesquisa
        nav.push({ href: 'students.html', label: 'Alunos', page: 'students', icon: '👥' });
        nav.push({ href: 'research.html', label: 'Pesquisas', page: 'research', icon: '🔬' });
        nav.push({ href: 'links.html', label: 'Links', page: 'links', icon: '🔗' });
        nav.push({ href: 'blog.html', label: 'Blog', page: 'blog', icon: '💬' });
    }

    // Sair - todos
    nav.push({ href: '#', label: 'Sair', page: 'logout', icon: '🚪', id: 'logoutBtn' });

    return nav;
}

function renderHeader(activePage = '') {
    const currentUser = getCurrentUser();
    if (!currentUser) return '';

    const nav = getNavigationForUser(currentUser);

    // Gerar links do menu
    const navLinks = nav.map(item => {
        if (item.conditional) {
            // Links condicionais (diários) - inicialmente escondidos
            return `
                <a href="${item.href}"
                   class="nav-link ${activePage === item.page ? 'active' : ''} hidden"
                   data-page="${item.page}"
                   data-conditional="${item.conditional}"
                   ${item.id ? `id="${item.id}"` : ''}>
                    <span class="nav-icon">${item.icon}</span>
                    <span class="nav-label">${item.label}</span>
                </a>
            `;
        }

        return `
            <a href="${item.href}"
               class="nav-link ${activePage === item.page ? 'active' : ''}"
               data-page="${item.page}"
               ${item.id ? `id="${item.id}"` : ''}>
                <span class="nav-icon">${item.icon}</span>
                <span class="nav-label">${item.label}</span>
            </a>
        `;
    }).join('');

    return `
        <header class="main-header">
            <div class="header-container">
                <div class="header-brand">
                    <h1 class="brand-title">Ward Academy</h1>
                    <span class="brand-subtitle">${getUserTypeLabel(currentUser.user_type)}</span>
                </div>

                <button class="mobile-menu-toggle" id="mobileMenuToggle" aria-label="Menu">
                    <span class="hamburger-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>

                <nav class="main-nav" id="mainNav">
                    ${navLinks}
                </nav>
            </div>
        </header>
    `;
}

function getUserTypeLabel(userType) {
    const labels = {
        'student': 'Aluno',
        'mentor_marcos': 'Admin - Marcos Vilela',
        'mentor_iria': 'Mentora - Dra. Iria da Costa',
        'mentor_guilherme': 'Mentor - Guilherme Lavor',
        'mentor_romulo': 'Mentor - Rômulo Sanglard'
    };
    return labels[userType] || 'Usuário';
}

async function updateConditionalLinks() {
    const currentUser = getCurrentUser();
    if (!currentUser || currentUser.user_type !== 'student') return;

    try {
        const settings = await getUserSettings(currentUser.id);
        if (!settings) return;

        // Mostrar/esconder diários baseado nas configurações
        const studyDiaryLink = document.querySelector('[data-conditional="study_diary"]');
        const uworldDiaryLink = document.querySelector('[data-conditional="uworld_diary"]');

        if (studyDiaryLink) {
            if (settings.study_diary_enabled) {
                studyDiaryLink.classList.remove('hidden');
            } else {
                studyDiaryLink.classList.add('hidden');
            }
        }

        if (uworldDiaryLink) {
            if (settings.uworld_diary_enabled) {
                uworldDiaryLink.classList.remove('hidden');
            } else {
                uworldDiaryLink.classList.add('hidden');
            }
        }
    } catch (error) {
        console.error('Error updating conditional links:', error);
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

    // Setup mobile menu toggle
    setupMobileMenu();

    // Setup logout handler
    setupLogoutHandler();

    // Update conditional links (diários)
    updateConditionalLinks();

    // Close mobile menu when clicking outside
    setupOutsideClickHandler();
}

function setupMobileMenu() {
    const menuToggle = document.getElementById('mobileMenuToggle');
    const mainNav = document.getElementById('mainNav');

    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            mainNav.classList.toggle('active');
            menuToggle.classList.toggle('active');

            // Prevent body scroll when menu is open
            if (mainNav.classList.contains('active')) {
                document.body.style.overflow = 'hidden';
            } else {
                document.body.style.overflow = '';
            }
        });

        // Close menu when clicking a link
        const navLinks = mainNav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
}

function setupOutsideClickHandler() {
    const mainNav = document.getElementById('mainNav');
    const menuToggle = document.getElementById('mobileMenuToggle');

    document.addEventListener('click', (e) => {
        if (mainNav && menuToggle) {
            if (!mainNav.contains(e.target) && !menuToggle.contains(e.target)) {
                mainNav.classList.remove('active');
                menuToggle.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    });
}

function setupLogoutHandler() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();

            if (confirm('Tem certeza que deseja sair?')) {
                logout();
                window.location.href = 'index.html';
            }
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

// Auto-close mobile menu on window resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768) {
        const mainNav = document.getElementById('mainNav');
        const menuToggle = document.getElementById('mobileMenuToggle');

        if (mainNav && menuToggle) {
            mainNav.classList.remove('active');
            menuToggle.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
});
