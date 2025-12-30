-- ============================================
-- VERIFICAÇÃO DO BANCO DE DADOS - Ward Academy
-- Execute este script para diagnosticar problemas
-- ============================================

-- 1. Verificar se a tabela users existe
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'users'
) as users_table_exists;

-- 2. Ver estrutura da tabela users
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'users'
ORDER BY ordinal_position;

-- 3. Contar quantos usuários existem
SELECT COUNT(*) as total_users FROM public.users;

-- 4. Ver todos os usuários (se houver)
SELECT id, email, user_type, first_login, is_active
FROM public.users;

-- 5. Verificar tabela user_profiles
SELECT COUNT(*) as total_profiles FROM public.user_profiles;

-- 6. Ver estrutura da tabela user_profiles
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
AND table_name = 'user_profiles'
ORDER BY ordinal_position;
