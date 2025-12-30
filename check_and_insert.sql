-- ============================================
-- VERIFICAR E INSERIR MENTORES - Ward Academy
-- Execute TODO este código de uma vez
-- ============================================

-- PASSO 1: Verificar tabela users
DO $$
BEGIN
    RAISE NOTICE 'Verificando tabela users...';
END $$;

SELECT
    COUNT(*) as total_users,
    'Usuários na tabela' as descricao
FROM public.users;

-- PASSO 2: Ver todos os usuários atuais (se houver)
SELECT email, user_type
FROM public.users
LIMIT 10;

-- PASSO 3: Limpar mentores antigos se existirem
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

-- PASSO 4: Inserir mentores
INSERT INTO public.users (email, password_hash, user_type, first_login, is_active)
VALUES
    ('marcosantoniodv@gmail.com', 'Luna11anos', 'mentor_marcos', FALSE, TRUE),
    ('costamdiria@gmail.com', 'Iria2026.', 'mentor_iria', FALSE, TRUE),
    ('guilhermelavor@yahoo.com.br', 'Gui2026.', 'mentor_guilherme', FALSE, TRUE),
    ('romulossanglard@gmail.com', 'Romulo2026.', 'mentor_romulo', FALSE, TRUE);

-- PASSO 5: Criar perfis
INSERT INTO public.user_profiles (user_id, full_name)
SELECT u.id,
       CASE u.email
           WHEN 'marcosantoniodv@gmail.com' THEN 'Marcos Vilela'
           WHEN 'costamdiria@gmail.com' THEN 'Dra. Iria da Costa'
           WHEN 'guilhermelavor@yahoo.com.br' THEN 'Guilherme Lavor'
           WHEN 'romulossanglard@gmail.com' THEN 'Rômulo Sanglard'
       END as full_name
FROM public.users u
WHERE u.email IN (
    'marcosantoniodv@gmail.com',
    'costamdiria@gmail.com',
    'guilhermelavor@yahoo.com.br',
    'romulossanglard@gmail.com'
);

-- PASSO 6: VERIFICAÇÃO FINAL
SELECT
    u.id,
    u.email,
    u.user_type,
    u.password_hash,
    u.first_login,
    u.is_active,
    p.full_name
FROM public.users u
LEFT JOIN public.user_profiles p ON u.id = p.user_id
WHERE u.email IN (
    'marcosantoniodv@gmail.com',
    'costamdiria@gmail.com',
    'guilhermelavor@yahoo.com.br',
    'romulossanglard@gmail.com'
)
ORDER BY u.email;

-- Se você vir 4 linhas na última query, FUNCIONOU! ✅
