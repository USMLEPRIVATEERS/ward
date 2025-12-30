# 🚀 Guia de Configuração Rápida - Ward Academy

## ✅ Status Atual
- ✅ Plataforma conectada ao Supabase
- ✅ Credenciais configuradas
- ⏳ **Próximo passo**: Executar o schema SQL

## 📋 Passo a Passo para Ativar a Plataforma

### 1. Acessar o Supabase SQL Editor

1. Acesse: https://supabase.com/dashboard/project/lbxjqejzabylfqdoknhh
2. No menu lateral, clique em **SQL Editor**
3. Clique em **New Query**

### 2. Executar o Schema SQL

1. Abra o arquivo `supabase_schema.sql` no seu computador
2. **Copie TODO o conteúdo** do arquivo (Ctrl+A, Ctrl+C)
3. **Cole** no SQL Editor do Supabase
4. Clique em **RUN** (ou pressione Ctrl+Enter)
5. Aguarde a execução (pode levar 10-30 segundos)

### 3. Verificar se funcionou

Execute esta query no SQL Editor:

```sql
SELECT * FROM public.users;
```

**Você deve ver 4 mentores**:
- marcosantoniodv@gmail.com (Marcos - Admin)
- costamdiria@gmail.com (Dra. Iria)
- guilhermelavor@yahoo.com.br (Guilherme)
- romulossanglard@gmail.com (Rômulo)

### 4. Testar a Plataforma

1. Abra o arquivo `index.html` no navegador
   - **OU** use o GitHub Pages (se ativado)

2. Faça login com qualquer mentor:
   ```
   Email: marcosantoniodv@gmail.com
   Senha: Luna11anos
   ```

3. Você deve ver o dashboard do Marcos!

## 🎯 Próximos Passos Após Login

### Como Marcos (Admin):
1. **Adicionar alunos**: Crie contas de alunos pelo painel admin
2. **Importar cronogramas**: Cole cronogramas do Excel
3. **Gerenciar tudo**: Você tem acesso completo!

### Como outros mentores:
1. **Faça login** com seus emails
2. **Troque a senha** (opcional): Dashboard > Trocar Senha
3. **Explore o dashboard**: Cada mentor tem visão personalizada

## 📊 O Que Foi Criado no Banco

Quando você executar o schema, serão criadas:

✅ **20+ tabelas**:
- users (usuários)
- user_profiles (perfis)
- usmle_info (dados do USMLE)
- uworld_info (dados do UWorld)
- landmarks (chamadas com mentores)
- schedules (cronogramas)
- blog_posts (blog)
- research_projects (pesquisas)
- messages (recados)
- E muito mais...

✅ **4 contas de mentores** já cadastradas

✅ **23 landmarks padrão** para cada aluno

## 🔧 Troubleshooting

### ❌ Erro ao executar o schema:
- Certifique-se de copiar TODO o conteúdo do arquivo
- Verifique se não há outros schemas conflitantes
- Tente executar em partes (copie até "INITIAL DATA" primeiro)

### ❌ Não consigo fazer login:
- Verifique se o schema foi executado com sucesso
- Abra o Console do navegador (F12) para ver erros
- Verifique se está usando o arquivo index.html correto

### ❌ Página em branco após login:
- Verifique o Console (F12) para erros de JavaScript
- Certifique-se de que todas as tabelas foram criadas
- Teste com outro navegador

## 📱 Como Adicionar Alunos

### Opção 1: Pelo Dashboard do Marcos (Recomendado)
1. Login como Marcos
2. Ir em "Admin" no menu
3. Clicar em "Adicionar Novo Membro"
4. Preencher email e senha
5. Salvar

### Opção 2: Via SQL
```sql
INSERT INTO public.users (email, password_hash, user_type, first_login)
VALUES ('aluno@email.com', 'senha123', 'student', TRUE);
```

**Importante**: `first_login = TRUE` fará o aluno preencher o questionário no primeiro acesso!

## 🌐 Ativar GitHub Pages (Opcional)

Para hospedar a plataforma online:

1. Vá em: https://github.com/USMLEPRIVATEERS/ward/settings/pages
2. Em **Source**, selecione: `claude/student-tracking-platform-EKaoQ`
3. Clique em **Save**
4. Aguarde ~5 minutos
5. Acesse: https://usmleprivateers.github.io/ward/

## ✅ Checklist Final

- [ ] Schema SQL executado no Supabase
- [ ] Verificado que os 4 mentores existem na tabela users
- [ ] Testado login como Marcos
- [ ] Dashboard do Marcos carrega corretamente
- [ ] Testado troca de senha
- [ ] (Opcional) GitHub Pages ativado

## 🎉 Pronto!

Depois desses passos, sua plataforma Ward Academy estará **100% funcional**!

Os mentores podem fazer login e começar a usar imediatamente.

## 📧 Suporte

Problemas? Verifique:
1. Console do navegador (F12)
2. SQL Editor do Supabase (erros na execução)
3. Credenciais no arquivo js/supabase-config.js

---

**Criado por**: Claude para Ward Academy
**Data**: 30/12/2024
