# 🏠 Dashboard Principal - Ward Academy

## ✅ Arquivos Criados

### 1. **dashboard.html**
Página principal do dashboard para alunos
- Header com navegação completa
- Barra de progresso do questionário
- Seção de preparação atual
- Recados dos mentores
- Ativação de diários opcionais
- Preview de landmarks
- Acesso rápido às principais funcionalidades
- Modals para check-in diário e troca de senha

### 2. **css/dashboard.css**
Estilos completos do dashboard
- Header responsivo com navegação
- Cards de dashboard com shadows e bordas
- Progress bars animadas
- Toggle switches customizados
- Modais com overlay
- Grid layouts responsivos
- Estilização de mensagens e landmarks
- Botões de acesso rápido

### 3. **js/dashboard.js**
Lógica completa do dashboard
- Carregamento de dados do usuário
- Cálculo de progresso do questionário
- Gerenciamento de diários (ativar/desativar)
- Exibição de mensagens dos mentores
- Listagem de landmarks recentes
- Check-in diário com localStorage
- Troca de senha com validação
- Salvamento de preparação atual

---

## 🎯 Funcionalidades Implementadas

### ✅ Header de Navegação
```
🎓 WARD ACADEMY | Dashboard | Landmarks | Cronograma | Links | Blog | Pesquisa
                 [Diário Estudos] [Diário UWorld] | 👤 Perfil | 🚪 Sair
```

**Características:**
- Links condicionais para diários (aparecem só quando ativados)
- Link ativo destacado em laranja
- Design responsivo que colapsa em mobile
- Sticky header que permanece no topo ao rolar a página

### ✅ Status do Questionário
**Visível apenas se questionário incompleto**
- Barra de progresso visual (0-100%)
- Percentual de conclusão
- Botão "Continuar Questionário →"
- Esconde automaticamente quando first_login_completed = true

### ✅ Preparação Atual
**Seletor de prova que o aluno está focando:**
- ( ) Step 1
- ( ) Step 2 CK
- ( ) Step 3
- ( ) OET
- ( ) Outro [campo texto]

**Funcionalidades:**
- Carrega seleção anterior do questionário
- Campo "Outro" aparece condicionalmente
- Salva no questionnaire_data do usuário
- Botão "Salvar" com feedback visual

### ✅ Segurança
- Botão "Trocar Senha"
- Abre modal com formulário
- Validação de senha atual
- Confirmação de nova senha
- Mínimo 6 caracteres
- Feedback de sucesso/erro

### ✅ Recados dos Mentores
**Exibe mensagens não lidas:**
```
┌─────────────────────────────────────────┐
│ 📌 Dra. Iria (há 2 dias):               │
│ "Parabéns por finalizar Cardiovascular! │
│  Vamos conversar sobre Second Pass..."  │
│  [✓ Marcar como lido]                   │
└─────────────────────────────────────────┘
```

**Características:**
- Lista até 5 mensagens mais recentes
- Exibe nome do mentor e data relativa
- Botão para marcar como lido
- Recarrega automaticamente ao marcar
- Mostra "Nenhum recado no momento" se vazio

### ✅ Ativações Opcionais
**Toggles para ativar/desativar diários:**

```
┌────────────────────────────────────────┐
│ 📊 ATIVAÇÕES OPCIONAIS                 │
├────────────────────────────────────────┤
│                                        │
│ Diário de Estudos                      │
│ Registre seu progresso diário     [⚪️] │
│                                        │
│ Diário do UWorld                       │
│ Acompanhe suas questões           [⚪️] │
└────────────────────────────────────────┘
```

**Funcionalidades:**
- Toggle ON/OFF animado
- Salva no banco (diary_study_enabled, diary_uworld_enabled)
- Mostra/esconde links no header automaticamente
- Atualização em tempo real

### ✅ Landmarks - Chamadas e Marcos
**Preview dos 5 landmarks mais recentes:**

```
✅ Entrada na Ward Academy (12/01/2025)
✅ 1ª Chamada - Dra. Iria (15/01/2025)
⏳ 1ª Chamada - Guilherme (Pendente)
🚨 2ª Chamada - Marcos (Urgente)
```

**Ícones:**
- ✅ = Concluído (verde)
- ⏳ = Pendente (laranja)
- 🚨 = Urgente (vermelho)

**Características:**
- Carrega da tabela landmarks
- Ordena por order_position
- Link "Ver Todos →" para página completa
- Destaque visual para urgentes

### ✅ Acesso Rápido
**Grid 2x2 com botões grandes:**

```
┌──────────────┬──────────────┐
│  📁          │  📅          │
│ Repositório  │ Cronograma   │
│  de Links    │              │
├──────────────┼──────────────┤
│  💬          │  🔬          │
│ Blog da Ward │   Minhas     │
│              │  Pesquisas   │
└──────────────┴──────────────┘
```

**Características:**
- Ícones grandes e visuais
- Hover com elevação e mudança de cor
- Grid responsivo (colapsa em mobile)
- Links diretos para cada seção

### ✅ Modal de Check-in Diário
**Aparece 1x por dia, 2 segundos após carregar:**

```
┌──────────────────────────────────────┐
│ 🎓 Como tem sido sua preparação?     │
├──────────────────────────────────────┤
│                                      │
│ Conte-nos sobre os últimos dias:     │
│ ┌──────────────────────────────┐   │
│ │                              │   │
│ └──────────────────────────────┘   │
│                                      │
│ Ou selecione:                        │
│ ( ) 😊 Tudo tranquilo!              │
│ ( ) 🆘 Preciso de ajuda             │
│ ( ) ⏸️ Estou parado no momento      │
│                                      │
│    [Pular]    [Enviar]              │
└──────────────────────────────────────┘
```

**Funcionalidades:**
- Verifica localStorage para não repetir no mesmo dia
- Só aparece se questionário foi completado
- Salva na tabela daily_checkins
- Pode pular ou enviar
- Fecha automaticamente ao enviar

### ✅ Modal de Trocar Senha
**Formulário completo com validação:**

```
┌──────────────────────────────────────┐
│ 🔐 Trocar Senha                      │
├──────────────────────────────────────┤
│                                      │
│ Senha Atual                          │
│ [••••••••]                           │
│                                      │
│ Nova Senha                           │
│ [••••••••]                           │
│                                      │
│ Confirmar Nova Senha                 │
│ [••••••••]                           │
│                                      │
│    [Cancelar]    [Salvar]            │
└──────────────────────────────────────┘
```

**Validações:**
- Senha atual deve estar correta (usa RPC verify_password)
- Nova senha e confirmação devem coincidir
- Mínimo 6 caracteres
- Hash com bcrypt antes de salvar
- Mensagens de erro claras

---

## 🎨 Design e Estilização

### Cores Principais
- **Background:** #FFFFFF (branco)
- **Texto:** #000000 (preto)
- **Destaque:** #C45700 (laranja queimado)
- **Hover:** #A04800 (laranja escuro)
- **Sucesso:** #28a745 (verde)
- **Perigo:** #dc3545 (vermelho)
- **Info:** #17a2b8 (azul)

### Tipografia
- **Família:** System fonts (SF Pro, Segoe UI, Roboto, Helvetica, Arial)
- **Welcome H1:** 2rem (32px), bold
- **Card Headers:** 1.125rem (18px), semi-bold
- **Body:** 1rem (16px), regular
- **Small text:** 0.875rem (14px), regular

### Sombras e Efeitos
```css
--shadow-sm: 0 2px 4px rgba(0, 0, 0, 0.1);
--shadow-md: 0 4px 8px rgba(0, 0, 0, 0.15);
--shadow-lg: 0 8px 16px rgba(0, 0, 0, 0.2);
--transition: all 0.3s ease;
```

### Componentes Reutilizáveis

#### Dashboard Card
```css
.dashboard-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  overflow: hidden;
}
```

#### Toggle Switch
```css
width: 50px;
height: 24px;
background: gray → orange (quando ON)
thumb: 18px circle que desliza
```

#### Progress Bar
```css
height: 8px;
background: linear-gradient(orange → dark orange);
border-radius: 10px;
transition: width 0.4s ease;
```

---

## 🔄 Fluxo de Dados

### 1. Carregamento Inicial
```javascript
DOMContentLoaded →
  requireAuth() → Verifica autenticação →
  loadUserData() → Busca dados do Supabase →
  loadQuestionnaireProgress() → Calcula % completo →
  loadCurrentPreparation() → Marca radio selecionado →
  loadDiarySettings() → Atualiza toggles e nav links →
  loadMentorMessages() → Lista mensagens não lidas →
  loadLandmarks() → Lista 5 landmarks recentes →
  checkDailyCheckin() → Mostra modal se necessário
```

### 2. Interações do Usuário

**Mudar Preparação Atual:**
```javascript
Seleciona radio →
  Mostra campo "Outro" se necessário →
  Clica "Salvar" →
  saveCurrentPreparation() →
  Atualiza questionnaire_data no Supabase →
  Mostra mensagem de sucesso
```

**Ativar/Desativar Diário:**
```javascript
Clica toggle →
  toggleDiary() dispara →
  Atualiza diary_study_enabled/diary_uworld_enabled →
  Salva no Supabase →
  Mostra/esconde links no header
```

**Marcar Mensagem Como Lida:**
```javascript
Clica "Marcar como lido" →
  markMessageAsRead(id) →
  UPDATE messages SET is_read = true →
  loadMentorMessages() → Recarrega lista
```

**Check-in Diário:**
```javascript
Modal abre automaticamente →
  Usuário preenche texto OU seleciona status →
  Clica "Enviar" →
  INSERT into daily_checkins →
  localStorage.setItem(lastCheckin) →
  Modal fecha
```

**Trocar Senha:**
```javascript
Clica "Trocar Senha" →
  Modal abre →
  Preenche formulário →
  Clica "Salvar" →
  Valida campos →
  verify_password(senha_atual) →
  hash_password(nova_senha) →
  UPDATE users SET password_hash →
  Mostra sucesso → Fecha modal
```

---

## 📊 Estrutura de Dados (Supabase)

### Tabela: users
```sql
SELECT
  id,
  name,
  email,
  role,
  first_login_completed,
  questionnaire_step,
  questionnaire_data,
  diary_study_enabled,
  diary_uworld_enabled,
  password_hash
FROM users
WHERE id = user_id;
```

### Tabela: messages
```sql
SELECT
  m.*,
  sender.name as sender_name
FROM messages m
LEFT JOIN users sender ON m.created_by = sender.id
WHERE m.user_id = user_id
  AND m.is_read = false
ORDER BY m.created_at DESC
LIMIT 5;
```

### Tabela: landmarks
```sql
SELECT *
FROM landmarks
WHERE user_id = user_id
ORDER BY order_position ASC
LIMIT 5;
```

### Tabela: daily_checkins
```sql
INSERT INTO daily_checkins (
  user_id,
  date,
  status,
  message,
  created_at
) VALUES (
  user_id,
  CURRENT_DATE,
  status,
  message,
  NOW()
);
```

---

## 🚀 Como Testar

### Passo 1: Configurar Ambiente
```bash
# Servidor local
python3 -m http.server 8000
# ou
npx http-server -p 8000

# Acessar: http://localhost:8000
```

### Passo 2: Fazer Login
Use uma das credenciais de teste (de LOGIN_PAGE_README.md):
- Email: `marcosantoniodv@gmail.com`
- Senha: `Luna11anos`

### Passo 3: Testar Funcionalidades

**1. Verificar Progresso do Questionário**
- Se incompleto: Card deve mostrar % e botão "Continuar"
- Se completo: Card deve estar escondido

**2. Alterar Preparação Atual**
- Selecione uma opção (Step 1, 2 CK, etc.)
- Selecione "Outro" para ver campo de texto
- Clique "Salvar"
- Recarregue a página e verifique que a seleção persistiu

**3. Ativar/Desativar Diários**
- Clique no toggle "Diário de Estudos"
- Observe link aparecer no header
- Clique no toggle novamente
- Observe link desaparecer do header

**4. Mensagens dos Mentores**
- Adicione mensagem no Supabase SQL Editor:
  ```sql
  INSERT INTO messages (user_id, message, created_by, is_read)
  VALUES ('user-uuid', 'Teste de mensagem', 'mentor-uuid', false);
  ```
- Recarregue dashboard
- Clique "Marcar como lido"
- Mensagem deve desaparecer

**5. Check-in Diário**
- Recarregue a página
- Aguarde 2 segundos
- Modal deve aparecer
- Preencha e envie
- Verifique em Supabase:
  ```sql
  SELECT * FROM daily_checkins WHERE user_id = 'user-uuid';
  ```

**6. Trocar Senha**
- Clique "Trocar Senha"
- Preencha senha atual incorreta → Deve dar erro
- Preencha nova senha < 6 chars → Deve dar erro
- Preencha nova senha ≠ confirmação → Deve dar erro
- Preencha corretamente → Deve salvar e fechar

**7. Landmarks**
- Adicione landmarks no Supabase:
  ```sql
  INSERT INTO landmarks (user_id, title, completed, is_urgent, order_position)
  VALUES ('user-uuid', '1ª Chamada - Dra. Iria', false, true, 1);
  ```
- Recarregue dashboard
- Verifique que landmark aparece com ícone correto

**8. Responsividade**
- Teste em desktop (1920px)
- Teste em tablet (768px)
- Teste em mobile (375px)
- Header deve colapsar
- Cards devem empilhar
- Modais devem ser 95% da largura

---

## 🔧 Troubleshooting

### Erro: "Função verify_password não existe"
**Solução:** Execute a migration:
```sql
-- supabase/migrations/add_password_verification.sql
```

### Erro: "Cannot read property 'name' of undefined"
**Solução:** Verifique se a tabela users tem o campo 'name':
```sql
ALTER TABLE users ADD COLUMN name TEXT;
UPDATE users SET name = email WHERE name IS NULL;
```

### Check-in aparece toda vez
**Solução:** Limpe localStorage:
```javascript
localStorage.removeItem('lastCheckin_' + userId);
```

### Diários não aparecem no header
**Solução:** Verifique os campos no banco:
```sql
UPDATE users
SET diary_study_enabled = true,
    diary_uworld_enabled = true
WHERE id = 'user-uuid';
```

### Progress bar não atualiza
**Solução:** Verifique os campos:
```sql
SELECT first_login_completed, questionnaire_step
FROM users
WHERE id = 'user-uuid';
```

### Landmarks não carregam
**Solução:** Verifique se a tabela existe:
```sql
CREATE TABLE IF NOT EXISTS landmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  title TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  is_urgent BOOLEAN DEFAULT FALSE,
  completion_date TIMESTAMP,
  order_position INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 📝 Próximos Passos

Após testar o dashboard, as próximas páginas a criar são:

1. **landmarks.html** - Página completa de landmarks com gerenciamento
2. **schedule.html** - Cronograma detalhado de estudos
3. **links.html** - Repositório completo de links
4. **blog.html** - Blog da Ward com posts e comentários
5. **research.html** - Gestão completa de projetos de pesquisa
6. **profile.html** - Perfil do usuário com todas as informações
7. **study-diary.html** - Diário de estudos (se ativado)
8. **uworld-diary.html** - Diário do UWorld (se ativado)

---

## 📋 Checklist de Implementação

- [x] `dashboard.html` - Estrutura completa
- [x] `css/dashboard.css` - Estilos responsivos
- [x] `js/dashboard.js` - Lógica de carregamento e interação
- [x] Header com navegação
- [x] Progresso do questionário
- [x] Seletor de preparação atual
- [x] Troca de senha
- [x] Mensagens dos mentores
- [x] Ativação de diários
- [x] Preview de landmarks
- [x] Acesso rápido
- [x] Modal de check-in diário
- [x] Modal de trocar senha
- [x] Integração com Supabase
- [x] Design responsivo
- [x] Tratamento de erros
- [ ] Testes de integração
- [ ] Próximas páginas (landmarks, schedule, etc.)

---

**Desenvolvido para Ward Academy** 🎓
*Plataforma de Acompanhamento Individual para USMLE*
