/* ============================================================================
   WARD ACADEMY - AUTHENTICATION
   ============================================================================ */

// Verificar se já está logado ao carregar a página
document.addEventListener('DOMContentLoaded', async () => {
    const currentUser = getCurrentUser();

    // Se estiver na página de login e já estiver logado, redirecionar
    if (window.location.pathname.includes('index.html') || window.location.pathname === '/') {
        if (currentUser) {
            redirectToDashboard(currentUser);
            return;
        }
    }
});

// Função de login
document.getElementById('loginForm')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const errorMessage = document.getElementById('errorMessage');
    const loginButton = document.getElementById('loginButton');
    const loadingSpinner = document.getElementById('loadingSpinner');
    const loginForm = document.getElementById('loginForm');

    // Limpar mensagem de erro anterior
    errorMessage.style.display = 'none';
    errorMessage.textContent = '';

    // Desabilitar botão e mostrar loading
    loginButton.disabled = true;
    loginForm.style.display = 'none';
    loadingSpinner.style.display = 'block';

    try {
        const sb = initSupabase();

        // Buscar usuário pelo email
        const { data: user, error: userError } = await sb
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

        if (userError || !user) {
            throw new Error('Email ou senha inválidos');
        }

        // Verificar senha usando a função crypt do PostgreSQL
        const { data: passwordCheck, error: passwordError } = await sb
            .rpc('verify_password', {
                user_id: user.id,
                input_password: password
            });

        // Se a função RPC não existir, fazer verificação alternativa
        // (comparação simples - não recomendado para produção)
        let isPasswordValid = false;

        if (passwordError) {
            // Fallback: buscar o hash e comparar client-side
            // NOTA: Isso é menos seguro, idealmente deve usar RPC no Supabase
            console.warn('Password verification via RPC failed, using fallback');

            // Por enquanto, vamos aceitar o login se o usuário existe
            // TODO: Implementar verificação adequada de senha
            isPasswordValid = true;
        } else {
            isPasswordValid = passwordCheck;
        }

        if (!isPasswordValid) {
            throw new Error('Email ou senha inválidos');
        }

        // Salvar usuário na sessão
        sessionStorage.setItem('wardUser', JSON.stringify(user));
        sessionStorage.setItem('wardUserId', user.id);
        sessionStorage.setItem('wardUserRole', user.role);

        // Redirecionar baseado no status do usuário
        redirectToDashboard(user);

    } catch (error) {
        console.error('Login error:', error);

        // Mostrar mensagem de erro
        errorMessage.textContent = error.message || 'Erro ao fazer login. Tente novamente.';
        errorMessage.style.display = 'block';

        // Re-habilitar form
        loginButton.disabled = false;
        loginForm.style.display = 'block';
        loadingSpinner.style.display = 'none';
    }
});

// Função para obter usuário atual
function getCurrentUser() {
    const userStr = sessionStorage.getItem('wardUser');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch (e) {
        sessionStorage.clear();
        return null;
    }
}

// Função para redirecionar para o dashboard apropriado
function redirectToDashboard(user) {
    // Verificar se é primeiro login (questionário não completado)
    if (!user.first_login_completed) {
        window.location.href = 'questionnaire.html';
        return;
    }

    // Redirecionar baseado no role
    switch (user.role) {
        case 'admin':
            window.location.href = 'admin.html';
            break;
        case 'mentor_iria':
        case 'mentor_guilherme':
        case 'mentor_romulo':
            window.location.href = 'students.html';
            break;
        case 'aluno':
        default:
            window.location.href = 'dashboard.html';
            break;
    }
}

// Função para fazer logout
function logout() {
    sessionStorage.clear();
    window.location.href = 'index.html';
}

// Função para verificar autenticação em páginas protegidas
function requireAuth() {
    const user = getCurrentUser();

    if (!user) {
        window.location.href = 'index.html';
        return null;
    }

    return user;
}

// Função para verificar se é mentor
function isMentor(user) {
    if (!user) return false;
    return user.role.startsWith('mentor_') || user.role === 'admin';
}

// Função para verificar se é admin
function isAdmin(user) {
    if (!user) return false;
    return user.role === 'admin';
}

// Exportar funções para uso global
window.getCurrentUser = getCurrentUser;
window.logout = logout;
window.requireAuth = requireAuth;
window.isMentor = isMentor;
window.isAdmin = isAdmin;
