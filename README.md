# Ward Academy - Plataforma de Acompanhamento Individual

Plataforma web para acompanhamento individual de alunos da Ward Academy, com recursos de gestão de estudos, cronograma, landmarks, blog, pesquisa e muito mais.

## 🎨 Design

- **Fundo**: Branco (#FFFFFF)
- **Texto**: Preto (#000000)
- **Detalhes**: Laranja Queimado (#CC5500)

## 📋 Funcionalidades

### Para Alunos:
- ✅ Sistema de login seguro
- ✅ Questionário inicial completo com múltiplas páginas
- ✅ Dashboard personalizado
- ✅ Perfil editável com dados completos
- ✅ Sistema de Landmarks (marcos/chamadas com mentores)
- ✅ Cronograma de estudos personalizável
- ✅ Diário de estudos (opcional)
- ✅ Diário do UWorld (opcional)
- ✅ Repositório de links compartilhados
- ✅ Blog da Ward para interação com outros alunos
- ✅ Gerenciamento de projetos de pesquisa
- ✅ Recados dos mentores
- ✅ Atualização diária de progresso

### Para Mentores:
- ✅ Dashboard específico para cada mentor
- ✅ Visualização de todos os alunos
- ✅ Gerenciamento de landmarks
- ✅ Linha do tempo de atividades (Dra. Iria)
- ✅ Chamadas pendentes e urgentes
- ✅ Gerenciamento de pesquisas
- ✅ Sistema de blog sem limite de caracteres
- ✅ Adição de links no repositório

### Para Admin (Marcos):
- ✅ Painel administrativo completo
- ✅ Adicionar/remover usuários
- ✅ Editar dados de qualquer usuário
- ✅ Resetar senhas
- ✅ Gerenciar cronogramas
- ✅ Acesso total a todos os recursos

## 🚀 Configuração

### 1. Configurar o Supabase

1. Crie uma conta no [Supabase](https://supabase.com)
2. Crie um novo projeto
3. No SQL Editor do Supabase, execute o arquivo `supabase_schema.sql`
4. Copie a URL e a chave anônima do seu projeto

### 2. Configurar as Credenciais

Edite o arquivo `js/supabase-config.js` e substitua:

```javascript
const SUPABASE_URL = 'https://your-project.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key-here';
```

### 3. Criar Usuários Iniciais

Use o painel admin após configurar o Supabase, ou execute via SQL.

**IMPORTANTE**: Em produção, use bcrypt para hash das senhas!

### 4. Hospedar no GitHub Pages

1. Faça commit de todos os arquivos para o repositório
2. Vá em Settings > Pages
3. Selecione a branch principal como fonte
4. Aguarde alguns minutos para o deploy

## 📁 Estrutura de Arquivos

```
ward/
├── index.html              # Página de login
├── dashboard.html          # Dashboard principal
├── questionnaire.html      # Questionário inicial (em desenvolvimento)
├── css/
│   └── styles.css         # Estilos globais
├── js/
│   ├── supabase-config.js # Configuração Supabase
│   └── questionnaire-data.js # Dados UWorld
├── supabase_schema.sql    # Schema do banco de dados
└── README.md              # Este arquivo
```

## 🔐 Tipos de Usuário

- **Student**: Alunos com acesso aos próprios dados
- **Mentor_Iria**: Dra. Iria (dashboard com linha do tempo)
- **Mentor_Marcos**: Marcos (admin completo)
- **Mentor_Guilherme**: Guilherme (foco em Anki)
- **Mentor_Romulo**: Rômulo (foco em pesquisa)

## 🔧 Credenciais dos Mentores

As credenciais dos mentores são criadas automaticamente ao executar o arquivo `supabase_schema.sql`.

Os emails registrados são:
- **Marcos Vilela (Admin)**: marcosantoniodv@gmail.com
- **Dra. Iria da Costa**: costamdiria@gmail.com
- **Guilherme Lavor**: guilhermelavor@yahoo.com.br
- **Rômulo Sanglard**: romulossanglard@gmail.com

**Nota**: As senhas iniciais estão definidas no schema SQL. Todos os mentores podem alterar suas senhas no dashboard após o primeiro login.

## 📝 Status do Projeto

### ✅ Completo:
- Schema do banco de dados Supabase
- Sistema de autenticação
- Estilos CSS completos
- Página de login
- Dashboard principal com diferenciação de usuários
- Funções JavaScript para Supabase
- Dados do UWorld (Step 1, 2 CK, 3)
- Questionário inicial (estrutura HTML)

### 🚧 Em Desenvolvimento:
- Páginas HTML adicionais (profile, landmarks, research, blog, etc.)
- JavaScript do questionário
- Páginas específicas de mentores
- Diários de estudo

## 📧 Contato

Marcos Vilela: marcosantoniodv@gmail.com

## 📄 Licença

© 2024 Ward Academy. Todos os direitos reservados.
