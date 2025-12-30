# 🔐 Página de Login - Ward Academy

## ✅ Arquivos Criados

### 1. **index.html**
Página de login com design minimalista e profissional
- Logo 🎓 Ward Academy
- Campos de email e senha
- Validação de formulário
- Loading spinner durante login
- Mensagens de erro amigáveis

### 2. **css/style.css**
Estilos globais da plataforma
- **Cores principais:**
  - Branco: `#FFFFFF`
  - Preto: `#000000`
  - Laranja Queimado: `#C45700`
- Design responsivo
- Animações suaves
- Componentes reutilizáveis

### 3. **js/config.js**
Configuração do Supabase
- Inicialização do cliente Supabase
- Credenciais do projeto

### 4. **js/auth.js**
Lógica de autenticação
- Login com validação de senha
- Verificação de primeiro login
- Redirecionamento inteligente baseado em role
- Gerenciamento de sessão
- Funções de logout e proteção de rotas

### 5. **supabase/migrations/add_password_verification.sql**
Função SQL para verificação segura de senhas
- Usa `crypt()` do PostgreSQL
- Compara hash de forma segura
- Acessível via RPC do Supabase

---

## 🚀 Como Testar

### Passo 1: Executar a Migration SQL
No Supabase SQL Editor, execute o arquivo:
```sql
supabase/migrations/add_password_verification.sql
```

### Passo 2: Abrir a Página de Login
Abra o arquivo `index.html` em um navegador ou configure um servidor local:

```bash
# Opção 1: Usando Python
python3 -m http.server 8000

# Opção 2: Usando Node.js (http-server)
npx http-server -p 8000

# Depois acesse: http://localhost:8000
```

### Passo 3: Testar Credenciais

**Marcos Vilela (Admin):**
- Email: `marcosantoniodv@gmail.com`
- Senha: `Luna11anos`
- Redireciona para: `admin.html`

**Dra. Iria da Costa (Mentora):**
- Email: `iria@wardacademy.com`
- Senha: `senha_temporaria`
- Redireciona para: `students.html`

**Guilherme Lavor (Mentor):**
- Email: `guilherme@wardacademy.com`
- Senha: `senha_temporaria`
- Redireciona para: `students.html`

**Rômulo Sanglard (Mentor):**
- Email: `romulo@wardacademy.com`
- Senha: `senha_temporaria`
- Redireciona para: `students.html`

---

## 🎯 Funcionalidades Implementadas

### ✅ Validação de Login
- Busca usuário por email no banco
- Verifica senha usando função `verify_password()`
- Mensagens de erro claras

### ✅ Detecção de Primeiro Login
- Verifica campo `first_login_completed`
- Redireciona para `questionnaire.html` se falso
- Redireciona para dashboard apropriado se verdadeiro

### ✅ Redirecionamento Inteligente
Baseado no `role` do usuário:
- `admin` → `admin.html`
- `mentor_*` → `students.html`
- `aluno` → `dashboard.html`

### ✅ Gerenciamento de Sessão
- Armazena dados do usuário em `sessionStorage`
- Persiste: `wardUser`, `wardUserId`, `wardUserRole`
- Logout limpa toda a sessão

### ✅ Proteção de Rotas
- Função `requireAuth()` para páginas protegidas
- Função `isMentor()` para verificar permissões
- Função `isAdmin()` para recursos administrativos

### ✅ UX/UI
- Loading spinner durante autenticação
- Animações suaves de entrada
- Mensagens de erro com shake animation
- Design responsivo (mobile-friendly)
- Focus states com cor laranja

---

## 🎨 Design

### Cores
- **Primária:** Branco (`#FFFFFF`)
- **Texto:** Preto (`#000000`)
- **Destaque:** Laranja Queimado (`#C45700`)
- **Hover:** Laranja Escuro (`#A04800`)

### Tipografia
- Font: System fonts (SF Pro, Segoe UI, Roboto)
- Heading: 28px, Bold
- Body: 16px, Regular
- Labels: 14px, Semi-bold

### Sombras e Bordas
- Card: `box-shadow: 0 8px 16px rgba(0,0,0,0.2)`
- Inputs: `border: 2px solid #CCCCCC`
- Focus: `border-color: #C45700` + glow effect

---

## 🔒 Segurança

### Hashing de Senhas
- Usa `pgcrypto` do PostgreSQL
- Algoritmo: `bcrypt`
- Senhas nunca são armazenadas em texto plano

### Verificação Segura
```sql
-- Função RPC no Supabase
CREATE FUNCTION verify_password(user_id UUID, input_password TEXT)
RETURNS BOOLEAN
```

### Session Storage
- Armazena apenas dados não-sensíveis
- Limpa automaticamente ao fechar o navegador
- Não persiste entre sessões

---

## 📝 Próximos Passos

### Páginas para Criar:
1. ✅ **Login** (index.html) - CONCLUÍDO
2. ⏳ **Questionário** (questionnaire.html) - Próxima
3. ⏳ **Dashboard Aluno** (dashboard.html)
4. ⏳ **Dashboard Admin** (admin.html)
5. ⏳ **Lista de Alunos** (students.html)
6. ⏳ **Perfil** (profile.html)
7. ⏳ **Landmarks** (landmarks.html)
8. ⏳ **Cronograma** (schedule.html)
9. ⏳ **Links** (links.html)
10. ⏳ **Blog** (blog.html)
11. ⏳ **Pesquisas** (research.html)
12. ⏳ **Diários** (study-diary.html, uworld-diary.html)

### Melhorias Futuras:
- [ ] "Esqueci minha senha" (password reset)
- [ ] Rate limiting para evitar brute force
- [ ] 2FA (autenticação de dois fatores)
- [ ] Logs de login (audit trail)
- [ ] Expiração de sessão após inatividade

---

## 🐛 Troubleshooting

### Erro: "verify_password is not defined"
**Solução:** Execute a migration SQL no Supabase:
```sql
supabase/migrations/add_password_verification.sql
```

### Erro: "Cannot read property 'createClient' of undefined"
**Solução:** Verifique se o script do Supabase está carregando:
```html
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
```

### Login não funciona
**Checklist:**
1. ✅ Banco de dados resetado com o novo schema?
2. ✅ Função `verify_password` criada?
3. ✅ Credenciais do Supabase corretas no `config.js`?
4. ✅ Console do navegador mostra algum erro?

### Redirecionamento não funciona
**Solução:** Verifique se as páginas de destino existem:
- `questionnaire.html`
- `dashboard.html`
- `admin.html`
- `students.html`

---

## 📚 Referências

- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL pgcrypto](https://www.postgresql.org/docs/current/pgcrypto.html)
- [MDN Web Docs - Authentication](https://developer.mozilla.org/en-US/docs/Web/API/Web_Authentication_API)

---

**Desenvolvido para Ward Academy** 🎓
*Plataforma de Acompanhamento Individual para USMLE*
