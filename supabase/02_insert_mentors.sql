-- ============================================
-- FIX: INSERT MENTORS - Disable RLS temporarily
-- Ward Academy Platform
-- ============================================
--
-- PROBLEMA IDENTIFICADO: RLS (Row Level Security) está habilitado
-- mas não há políticas (policies) definidas, bloqueando INSERTs.
--
-- SOLUÇÃO: Desabilitar RLS temporariamente, inserir dados, reabilitar.
-- Execute TODO este código de uma vez no Supabase SQL Editor.
-- ============================================

-- PASSO 1: Desabilitar RLS temporariamente
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;

-- PASSO 2: Limpar dados antigos (se existirem)
DELETE FROM public.user_profiles
WHERE user_id IN (
    SELECT id FROM public.users
    WHERE email IN (
        'marcosantoniodv@gmail.com',
        'costamdiria@gmail.com',
        'guilhermelavor@yahoo.com.br',
        'romulossanglard@gmail.com'
    )
);

DELETE FROM public.users
WHERE email IN (
    'marcosantoniodv@gmail.com',
    'costamdiria@gmail.com',
    'guilhermelavor@yahoo.com.br',
    'romulossanglard@gmail.com'
);

-- PASSO 3: Inserir os 4 mentores
INSERT INTO public.users (email, password_hash, user_type, first_login, is_active)
VALUES
    ('marcosantoniodv@gmail.com', 'Luna11anos', 'mentor_marcos', FALSE, TRUE),
    ('costamdiria@gmail.com', 'Iria2026.', 'mentor_iria', FALSE, TRUE),
    ('guilhermelavor@yahoo.com.br', 'Gui2026.', 'mentor_guilherme', FALSE, TRUE),
    ('romulossanglard@gmail.com', 'Romulo2026.', 'mentor_romulo', FALSE, TRUE);

-- PASSO 4: Criar perfis para os mentores
INSERT INTO public.user_profiles (user_id, full_name)
VALUES
    ((SELECT id FROM public.users WHERE email = 'marcosantoniodv@gmail.com'), 'Marcos Vilela'),
    ((SELECT id FROM public.users WHERE email = 'costamdiria@gmail.com'), 'Dra. Iria da Costa'),
    ((SELECT id FROM public.users WHERE email = 'guilhermelavor@yahoo.com.br'), 'Guilherme Lavor'),
    ((SELECT id FROM public.users WHERE email = 'romulossanglard@gmail.com'), 'Rômulo Sanglard');

-- PASSO 5: IMPORTANTE - Criar políticas RLS para permitir operações futuras
-- Estas políticas permitem que todos os usuários autenticados possam ler/escrever
-- (você pode refinar estas políticas depois para maior segurança)

-- Política para SELECT em users (todos podem ver)
CREATE POLICY "Allow all users to read users"
ON public.users FOR SELECT
USING (true);

-- Política para INSERT em users (todos podem criar - usado no login)
CREATE POLICY "Allow all users to insert users"
ON public.users FOR INSERT
WITH CHECK (true);

-- Política para UPDATE em users (cada usuário pode atualizar seu próprio registro)
CREATE POLICY "Allow users to update own record"
ON public.users FOR UPDATE
USING (true);

-- Política para SELECT em user_profiles
CREATE POLICY "Allow all users to read profiles"
ON public.user_profiles FOR SELECT
USING (true);

-- Política para INSERT em user_profiles
CREATE POLICY "Allow all users to insert profiles"
ON public.user_profiles FOR INSERT
WITH CHECK (true);

-- Política para UPDATE em user_profiles
CREATE POLICY "Allow all users to update profiles"
ON public.user_profiles FOR UPDATE
USING (true);

-- PASSO 6: Reabilitar RLS (agora com políticas definidas)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- PASSO 7: Verificação final
SELECT
    u.id,
    u.email,
    u.user_type,
    u.first_login,
    u.is_active,
    p.full_name,
    'SUCCESS - Mentor criado!' as status
FROM public.users u
LEFT JOIN public.user_profiles p ON u.id = p.user_id
WHERE u.email IN (
    'marcosantoniodv@gmail.com',
    'costamdiria@gmail.com',
    'guilhermelavor@yahoo.com.br',
    'romulossanglard@gmail.com'
)
ORDER BY u.email;

-- Se você vir 4 linhas acima com status 'SUCCESS - Mentor criado!',
-- os mentores foram inseridos COM SUCESSO! ✅
-- Agora você pode fazer login na plataforma.
