# 📝 Questionário Inicial - Ward Academy

## ✅ Arquivos Criados

### 1. **questionnaire.html**
Página de questionário em 11 etapas
- Barra de progresso com indicação visual
- Navegação entre passos (Voltar, Continuar Depois, Próximo)
- Validação de campos obrigatórios
- Auto-save a cada 2 segundos de inatividade
- Design responsivo e acessível

### 2. **css/questionnaire.css**
Estilos específicos do questionário
- Progress bar animada
- Cards de sistema/categoria colapsáveis
- Sliders customizados para planejamento
- Campos condicionais com animações
- Lista de contatos estilizada
- Indicador de salvamento automático

### 3. **js/questionnaire.js**
Lógica completa do questionário
- Gerenciamento de estado (11 passos)
- Auto-save com debouncing (2s)
- Renderização dinâmica de sistemas UWorld
- Navegação com validação
- Salvamento no Supabase
- Redirecionamento ao finalizar

### 4. **js/questionnaire-data.js** *(já existia)*
Dados estruturados do UWorld
- 25+ sistemas para Step 1
- 22+ sistemas para Step 2 CK
- 22 sistemas para Step 3
- Categorias detalhadas por sistema
- 39 estágios de projetos de pesquisa

---

## 🎯 Os 11 Passos do Questionário

### **Passo 1: Informações Básicas**
- Qual prova está fazendo (Step 1, 2 CK, ou 3)
- Data de início dos estudos
- Data prevista da prova

### **Passo 2: Planejamento de Estudos**
- Duração do First Pass (3-24 meses)
- Duração do Second Pass (1-12 meses)
- Duração do Dedicated (1-6 meses)
- Sliders interativos com display de valores

### **Passo 3: Seleção do UWorld**
- Dropdown para escolher UWorld (Step 1, 2 CK, ou 3)
- Prepara o próximo passo com sistemas correspondentes

### **Passo 4: Progresso no UWorld**
- **Renderização dinâmica** baseada na prova selecionada
- Sistemas colapsáveis (clique no header para expandir/colapsar)
- Checkboxes para marcar categorias completadas
- Dropdowns de dificuldade (Fácil, Médio, Difícil)
- Salvamento automático do progresso

**Exemplo de sistemas:**
- **Step 1**: Biochemistry, Genetics, Cardiovascular, Nervous System, etc.
- **Step 2 CK**: Cardiology, Neurology, Psychiatry, Obstetrics, etc.
- **Step 3**: Todos os sistemas sem categorias detalhadas

### **Passo 5: Nível de Inglês**
- Radio buttons: Fluente, Avançado, Intermediário, Básico
- **Campo condicional**: Se selecionar "Básico", aparece textarea para detalhar métodos de melhoria

### **Passo 6: Uso do Anki**
- Radio buttons: Sim ou Não
- **Campo condicional**: Se "Sim", aparece textarea para especificar deck e cards/dia

### **Passo 7: Experiência em Pesquisa (Parte 1)**
- Radio buttons: Sim ou Não
- Explicação sobre importância para residência nos EUA

### **Passo 8: Interesses em Pesquisa (Parte 2)**
- Textarea para descrever áreas de interesse
- Exemplos: cardiologia, oncologia, neurologia, saúde pública

### **Passo 9: Colaboração em Pesquisa (Parte 3)**
- Checkboxes múltiplas escolhas:
  - Relatos de caso
  - Revisões sistemáticas
  - Estudos observacionais
  - Ensaios clínicos
  - Não tenho interesse no momento

### **Passo 10: Observerships**
- Formulário para adicionar contatos
- Campos: Nome completo e Email
- Lista editável de contatos adicionados
- Botão "Remover" para cada contato

### **Passo 11: Background Pessoal**
- Textarea grande para narrativa pessoal
- Formação, motivações, especialidade desejada, objetivos

---

## 🚀 Funcionalidades Implementadas

### ✅ Auto-Save Inteligente
- Salva dados automaticamente após **2 segundos** de inatividade
- Debouncing para evitar requisições excessivas
- Indicador visual "✓ Salvo automaticamente"
- Salvamento imediato ao clicar "PRÓXIMO"

### ✅ Navegação Fluida
- Botão **VOLTAR**: Retorna ao passo anterior (escondido no passo 1)
- Botão **CONTINUAR DEPOIS**: Salva progresso e redireciona ao dashboard
- Botão **PRÓXIMO**: Avança para próximo passo (muda para "FINALIZAR" no passo 11)
- Validação antes de avançar

### ✅ Progress Bar Dinâmica
- Barra de progresso visual (0-100%)
- Texto "Passo X de 11"
- Atualização suave com transições CSS

### ✅ Campos Condicionais
- **Inglês Básico** → Mostra campo "Como está melhorando"
- **Usa Anki** → Mostra campo "Qual deck e quantidade"
- Animações de fade-in ao aparecer

### ✅ Sistemas UWorld Colapsáveis
- Clique no header do sistema para expandir/colapsar
- Ícone muda: ▼ (expandido) / ▶ (colapsado)
- Economiza espaço na tela
- Facilita navegação em sistemas grandes

### ✅ Rastreamento de Dificuldade
- Cada categoria pode ser marcada como:
  - Fácil (verde)
  - Médio (amarelo)
  - Difícil (vermelho)
- Ajuda o mentor a identificar áreas de desafio

### ✅ Gerenciamento de Contatos
- Adicionar contatos ilimitados
- Validação de campos (nome e email obrigatórios)
- Remover contatos individualmente
- Lista persistida no banco de dados

### ✅ Validação de Passos
- **Passo 1**: Obrigatório selecionar prova
- **Passo 3**: Obrigatório selecionar UWorld
- Mensagem de erro clara se validação falhar
- Impede avanço até corrigir

### ✅ Finalização do Questionário
- Ao completar passo 11 e clicar "FINALIZAR":
  1. Salva todos os dados no Supabase
  2. Marca `first_login_completed = true`
  3. Atualiza `questionnaire_step = 11`
  4. Mostra mensagem de sucesso
  5. Redireciona para o dashboard apropriado (baseado em role)

---

## 🎨 Design e UX

### Cores
- **Primária:** Branco (`#FFFFFF`)
- **Texto:** Preto (`#000000`)
- **Destaque:** Laranja Queimado (`#C45700`)
- **Hover:** Laranja Escuro (`#A04800`)
- **Success:** Verde (`#28a745`)
- **Danger:** Vermelho (`#dc3545`)

### Componentes Visuais

#### Progress Bar
```css
Altura: 8px
Background: Gradiente laranja
Transição suave: 0.4s
```

#### Sistemas UWorld
```css
Header: Clicável, com ícone toggle
Categories: Grid responsivo
Checkboxes: Customizados com cor laranja
Selects: Dropdown de dificuldade alinhado à direita
```

#### Sliders
```css
Track: Cinza claro
Fill: Laranja
Thumb: 24px, circular, laranja
Value display: Atualiza em tempo real
```

#### Info Boxes
```css
Background: Laranja claro (#FFE5D6)
Border-left: 4px laranja
Padding: 16px
Ícones: 💡 ou ⚠️
```

---

## 🔄 Fluxo de Dados

### 1. Carregamento Inicial
```javascript
DOMContentLoaded →
  requireAuth() → Verifica se está logado →
  loadSavedData(userId) → Busca dados salvos no Supabase →
  Popula userData com dados salvos →
  renderStep(currentStep) → Mostra passo atual
```

### 2. Interação do Usuário
```javascript
Usuário digita/seleciona →
  Input event disparado →
  captureStepData() → Atualiza userData →
  saveData() → Debounce de 2s →
  Salva no Supabase
```

### 3. Navegação
```javascript
Clica "PRÓXIMO" →
  captureStepData() →
  validateStep() → Se válido:
    currentStep++ →
    saveData(true) → Salva imediatamente →
    renderStep(currentStep)
```

### 4. Finalização
```javascript
Passo 11 + Clica "FINALIZAR" →
  finishQuestionnaire() →
  UPDATE users SET first_login_completed = true →
  Redireciona para dashboard
```

---

## 📊 Estrutura de Dados Salvos

### Objeto `userData`
```javascript
{
  // Passo 1
  exam_taking: 'step1' | 'step2ck' | 'step3',
  study_start_date: '2025-01-15',
  test_date: '2025-08-20',

  // Passo 2
  first_pass_months: 12,
  second_pass_months: 4,
  dedicated_months: 2,

  // Passo 3
  uworld_exam: 'step1' | 'step2ck' | 'step3',

  // Passo 4
  uworld_progress: {
    'Cardiovascular System': {
      'Coronary heart disease': {
        completed: true,
        difficulty: 'medium'
      },
      'Arrhythmias': {
        completed: false,
        difficulty: ''
      }
    }
  },

  // Passo 5
  english_level: 'fluent' | 'advanced' | 'intermediate' | 'basic',
  english_details: 'Cursando Inglês em escola X...',

  // Passo 6
  uses_anki: 'yes' | 'no',
  anki_details: 'Anking deck, 100 cards/dia',

  // Passo 7
  has_research_experience: 'yes' | 'no',

  // Passo 8
  research_interest: 'Cardiologia preventiva...',

  // Passo 9
  research_collab: ['systematic_reviews', 'case_reports'],

  // Passo 10
  observerships: [
    { name: 'Dr. John Smith', email: 'john@hospital.com' },
    { name: 'Dr. Jane Doe', email: 'jane@clinic.com' }
  ],

  // Passo 11
  background: 'Formado em medicina pela...'
}
```

### Salvamento no Supabase
```sql
UPDATE users
SET questionnaire_data = {...userData},
    questionnaire_step = 5,
    updated_at = NOW()
WHERE id = 'user-uuid';
```

---

## 🧪 Como Testar

### Passo 1: Abrir Questionário
1. Faça login na aplicação (`index.html`)
2. Se for primeiro login, será redirecionado automaticamente
3. Ou acesse diretamente: `http://localhost:8000/questionnaire.html`

### Passo 2: Testar Navegação
1. Preencha o Passo 1 e clique "PRÓXIMO"
2. Observe a barra de progresso atualizar
3. Clique "VOLTAR" para retornar
4. Clique "CONTINUAR DEPOIS" para salvar e sair

### Passo 3: Testar Auto-Save
1. Digite em qualquer campo
2. Aguarde 2 segundos
3. Observe o indicador "✓ Salvo automaticamente"
4. Recarregue a página
5. Verifique que os dados foram preservados

### Passo 4: Testar UWorld Tracking
1. No Passo 3, selecione um UWorld (ex: Step 1)
2. Avance para Passo 4
3. Expanda um sistema (clique no header)
4. Marque categorias como completas
5. Selecione dificuldade
6. Recarregue e verifique persistência

### Passo 5: Testar Campos Condicionais
1. Passo 5: Selecione "Básico" em inglês
   - Campo de detalhes deve aparecer
2. Passo 6: Selecione "Sim" em Anki
   - Campo de detalhes deve aparecer

### Passo 6: Testar Contatos
1. Vá para Passo 10
2. Adicione nome e email
3. Clique "Adicionar Contato"
4. Verifique que aparece na lista
5. Clique "Remover" e verifique remoção

### Passo 7: Finalizar Questionário
1. Complete todos os 11 passos
2. No Passo 11, clique "FINALIZAR"
3. Observe mensagem de sucesso
4. Verifique redirecionamento para dashboard
5. Tente fazer login novamente
6. Verifique que NÃO redireciona mais para questionário

---

## 🔧 Troubleshooting

### Erro: "Dados não salvos"
**Solução:**
1. Abra o console do navegador (F12)
2. Verifique se há erros de conexão com Supabase
3. Confirme que as credenciais em `js/config.js` estão corretas
4. Verifique permissões RLS no Supabase para tabela `users`

### Sistemas UWorld não aparecem
**Solução:**
1. Verifique se selecionou uma opção no Passo 3
2. Confirme que `js/questionnaire-data.js` está carregando
3. Abra console e digite `UWORLD_DATA` para verificar dados

### Campos condicionais não aparecem
**Solução:**
1. Verifique que `setupConditionalFields()` está executando
2. Confirme que os IDs dos elementos correspondem ao JavaScript
3. Inspecione o elemento para ver se `display: none` está sendo removido

### Progresso não é restaurado ao recarregar
**Solução:**
1. Verifique que `loadSavedData()` está sendo chamado
2. Confirme que o usuário está autenticado (sessionStorage)
3. Verifique se o campo `questionnaire_data` existe na tabela `users`
4. Execute no Supabase:
   ```sql
   SELECT questionnaire_data FROM users WHERE email = 'seu@email.com';
   ```

### Finalização não redireciona
**Solução:**
1. Abra console e verifique erros em `finishQuestionnaire()`
2. Confirme que `first_login_completed` foi atualizado:
   ```sql
   SELECT first_login_completed FROM users WHERE email = 'seu@email.com';
   ```
3. Limpe sessionStorage e faça login novamente

---

## 🎓 Próximos Passos

Após concluir o questionário, o usuário será redirecionado para:

### Para Alunos (`role: 'aluno'`)
→ **dashboard.html** (próxima página a criar)
- Overview de progresso nos estudos
- Acesso rápido a landmarks, cronograma, links
- Gráficos de desempenho no UWorld
- Próximos check-ins

### Para Mentores (`role: 'mentor_*'`)
→ **students.html** (próxima página a criar)
- Lista de alunos sob mentoria
- Status de cada aluno
- Acesso aos questionários respondidos
- Ferramentas de acompanhamento

### Para Admin (`role: 'admin'`)
→ **admin.html** (próxima página a criar)
- Gestão completa de usuários
- Relatórios e analytics
- Configurações da plataforma

---

## 📋 Checklist de Implementação

- [x] `questionnaire.html` - Estrutura de 11 passos
- [x] `css/questionnaire.css` - Estilos completos
- [x] `js/questionnaire.js` - Lógica de navegação e salvamento
- [x] `js/questionnaire-data.js` - Dados UWorld e Research
- [x] Auto-save com debouncing
- [x] Progress bar animada
- [x] Validação de campos obrigatórios
- [x] Campos condicionais
- [x] Sistemas UWorld colapsáveis
- [x] Rastreamento de dificuldade
- [x] Gerenciamento de contatos
- [x] Finalização e redirecionamento
- [ ] Testes de integração
- [ ] Página dashboard.html (próximo)
- [ ] Página students.html (próximo)
- [ ] Página admin.html (próximo)

---

**Desenvolvido para Ward Academy** 🎓
*Plataforma de Acompanhamento Individual para USMLE*
