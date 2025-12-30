-- ============================================
-- INSERT MENTORS - Ward Academy
-- Execute este script no Supabase SQL Editor
-- ============================================

-- Limpar usuários existentes (opcional - use com cuidado!)
-- DELETE FROM public.user_profiles;
-- DELETE FROM public.users;

-- Inserir mentores
INSERT INTO public.users (email, password_hash, user_type, first_login) VALUES
('marcosantoniodv@gmail.com', 'Luna11anos', 'mentor_marcos', FALSE),
('costamdiria@gmail.com', 'Iria2026.', 'mentor_iria', FALSE),
('guilhermelavor@yahoo.com.br', 'Gui2026.', 'mentor_guilherme', FALSE),
('romulossanglard@gmail.com', 'Romulo2026.', 'mentor_romulo', FALSE)
ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  user_type = EXCLUDED.user_type,
  first_login = EXCLUDED.first_login;

-- Criar perfis para mentores
INSERT INTO public.user_profiles (user_id, full_name) VALUES
((SELECT id FROM public.users WHERE email = 'marcosantoniodv@gmail.com'), 'Marcos Vilela'),
((SELECT id FROM public.users WHERE email = 'costamdiria@gmail.com'), 'Dra. Iria da Costa'),
((SELECT id FROM public.users WHERE email = 'guilhermelavor@yahoo.com.br'), 'Guilherme Lavor'),
((SELECT id FROM public.users WHERE email = 'romulossanglard@gmail.com'), 'Rômulo Sanglard')
ON CONFLICT (user_id) DO UPDATE SET
  full_name = EXCLUDED.full_name;

-- Verificar se os mentores foram criados
SELECT email, user_type, first_login FROM public.users;
