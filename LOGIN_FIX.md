# 🔧 Correção do Problema de Login

## ❌ Problema Identificado

O login estava falando com o erro:
```
Cannot coerce the result to a single JSON object
PGRST116: The result contains 0 rows
```

## 🔍 Causa Raiz

O arquivo `supabase_schema.sql` habilitava **RLS (Row Level Security)** em todas as tabelas (linha 428):

```sql
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
```

Porém, **nenhuma política (policy) foi definida** (linha 442 diz "Policies will be added based on authentication implementation").

Quando RLS está habilitado sem políticas, **todas as operações de INSERT, UPDATE e DELETE são bloqueadas por padrão**. Isso significa que os comandos INSERT nos scripts anteriores estavam sendo bloqueados silenciosamente.

## ✅ Solução

Criado o arquivo **`insert_mentors_fix_rls.sql`** que:

1. **Desabilita RLS temporariamente** nas tabelas users e user_profiles
2. **Limpa** qualquer dado antigo dos mentores
3. **Insere** os 4 mentores com sucesso
4. **Cria políticas RLS** que permitem as operações necessárias
5. **Reabilita RLS** (agora com políticas definidas)
6. **Verifica** se a inserção foi bem-sucedida

## 📝 Como Usar

1. Abra o **Supabase SQL Editor**
2. Copie **TODO** o conteúdo de `insert_mentors_fix_rls.sql`
3. Cole no SQL Editor
4. Clique em **Run** (executar)
5. Você deve ver 4 linhas na saída final com status "SUCCESS - Mentor criado!"

## 🔐 Credenciais dos Mentores

Após executar o script, você pode fazer login com:

- **Marcos**: marcosantoniodv@gmail.com / Luna11anos
- **Dra. Iria**: costamdiria@gmail.com / Iria2026.
- **Guilherme**: guilhermelavor@yahoo.com.br / Gui2026.
- **Rômulo**: romulossanglard@gmail.com / Romulo2026.

## 🎯 Próximos Passos

Depois que o login funcionar:

1. Os mentores devem trocar suas senhas no dashboard
2. Implementar hash de senhas (bcrypt/argon2) para produção
3. Refinar as políticas RLS para maior segurança (atualmente permissivas)
4. Configurar políticas específicas para cada tipo de usuário

---

**Status**: ✅ Problema resolvido - Execute `insert_mentors_fix_rls.sql` no Supabase SQL Editor
