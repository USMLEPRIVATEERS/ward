-- ============================================
-- INSERT MENTORS - Ward Academy (Versão Simples)
-- Execute este script no Supabase SQL Editor
-- ============================================

-- PRIMEIRO: Deletar dados antigos (SE EXISTIREM)
DELETE FROM public.user_profiles WHERE user_id IN (
    SELECT id FROM public.users WHERE email IN (
        'marcosantoniodv@gmail.com',
        'costamdiria@gmail.com',
        'guilhermelavor@yahoo.com.br',
        'romulossanglard@gmail.com'
    )
);

DELETE FROM public.users WHERE email IN (
    'marcosantoniodv@gmail.com',
    'costamdiria@gmail.com',
    'guilhermelavor@yahoo.com.br',
    'romulossanglard@gmail.com'
);

-- SEGUNDO: Inserir os 4 mentores
INSERT INTO public.users (email, password_hash, user_type, first_login, is_active) VALUES
('marcosantoniodv@gmail.com', 'Luna11anos', 'mentor_marcos', FALSE, TRUE),
('costamdiria@gmail.com', 'Iria2026.', 'mentor_iria', FALSE, TRUE),
('guilhermelavor@yahoo.com.br', 'Gui2026.', 'mentor_guilherme', FALSE, TRUE),
('romulossanglard@gmail.com', 'Romulo2026.', 'mentor_romulo', FALSE, TRUE);

-- TERCEIRO: Criar perfis para os mentores
INSERT INTO public.user_profiles (user_id, full_name) VALUES
((SELECT id FROM public.users WHERE email = 'marcosantoniodv@gmail.com'), 'Marcos Vilela'),
((SELECT id FROM public.users WHERE email = 'costamdiria@gmail.com'), 'Dra. Iria da Costa'),
((SELECT id FROM public.users WHERE email = 'guilhermelavor@yahoo.com.br'), 'Guilherme Lavor'),
((SELECT id FROM public.users WHERE email = 'romulossanglard@gmail.com'), 'Rômulo Sanglard');

-- QUARTO: Verificar se funcionou
SELECT
    u.id,
    u.email,
    u.user_type,
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
