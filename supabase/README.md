# 📁 Scripts SQL - Ward Academy

Esta pasta contém todos os scripts SQL para configurar o banco de dados Supabase da plataforma Ward Academy.

## 🚀 Ordem de Execução

Execute os scripts **NESTA ORDEM** no Supabase SQL Editor:

### 1️⃣ `01_schema.sql` - Schema do Banco de Dados
**Status**: ✅ Já executado
**Descrição**: Cria todas as tabelas, índices, e estrutura do banco de dados.
**Ação necessária**: Se você ainda não executou, execute este primeiro. Se já executou e deu erro "table already exists", pode pular.

### 2️⃣ `02_insert_mentors.sql` - Inserir Mentores (SOLUÇÃO FINAL)
**Status**: ⚠️ EXECUTE ESTE AGORA
**Descrição**: Insere os 4 mentores com correção de RLS (Row Level Security).
**O que faz**:
- Desabilita RLS temporariamente
- Limpa dados antigos
- Insere os 4 mentores
- Cria políticas RLS necessárias
- Reabilita RLS
- Verifica se funcionou

**Como executar**:
1. Abra https://lbxjqejzabylfqdoknhh.supabase.co
2. Vá em SQL Editor
3. Copie TODO o conteúdo de `02_insert_mentors.sql`
4. Cole e clique em Run
5. Verifique se aparece "SUCCESS - Mentor criado!" para os 4 mentores

## 📂 Pasta `scripts/old/`

Contém tentativas anteriores que **NÃO devem ser usadas**:
- `insert_mentors.sql` - Primeira tentativa (falhava com ON CONFLICT)
- `insert_mentors_simple.sql` - Segunda tentativa (bloqueada por RLS)
- `verify_database.sql` - Script de diagnóstico
- `check_and_insert.sql` - Terceira tentativa (ainda sem fix de RLS)

**Esses arquivos são mantidos apenas para histórico.**

## 🔐 Credenciais dos Mentores

Após executar `02_insert_mentors.sql`, você pode fazer login com:

| Nome | Email | Senha | Tipo |
|------|-------|-------|------|
| Marcos Vilela | marcosantoniodv@gmail.com | Luna11anos | mentor_marcos |
| Dra. Iria da Costa | costamdiria@gmail.com | Iria2026. | mentor_iria |
| Guilherme Lavor | guilhermelavor@yahoo.com.br | Gui2026. | mentor_guilherme |
| Rômulo Sanglard | romulossanglard@gmail.com | Romulo2026. | mentor_romulo |

## ✅ Checklist de Setup

- [ ] Execute `01_schema.sql` (se ainda não executou)
- [ ] Execute `02_insert_mentors.sql`
- [ ] Teste login com email de um mentor
- [ ] Confirme que consegue acessar o dashboard

## 🆘 Problemas?

Se encontrar erros:
1. Leia o arquivo `LOGIN_FIX.md` na raiz do projeto
2. Verifique se executou TODO o conteúdo de `02_insert_mentors.sql`
3. Confira se há mensagem de erro específica no Supabase SQL Editor
