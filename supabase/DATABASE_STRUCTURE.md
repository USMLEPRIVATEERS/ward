# 🗄️ ESTRUTURA DO BANCO DE DADOS - WARD ACADEMY

## 📋 Visão Geral

Este documento descreve a estrutura completa do banco de dados do sistema Ward Academy.

## 🔐 Extensões Necessárias

- `uuid-ossp`: Geração de UUIDs
- `pgcrypto`: Criptografia de senhas

## 📊 Tabelas Principais

### 1. **users** (Usuários do sistema)
Armazena todos os usuários (alunos e mentores)

**Campos principais:**
- `id`: UUID (chave primária)
- `email`: Email único do usuário
- `password_hash`: Senha criptografada com bcrypt
- `name`: Nome completo
- `role`: Tipo de usuário (aluno, mentor_iria, mentor_marcos, mentor_guilherme, mentor_romulo, admin)
- `first_login_completed`: Se completou o questionário inicial
- `questionnaire_step`: Passo atual do questionário (0-11)
- `diary_study_enabled`: Se ativou diário de estudos
- `diary_uworld_enabled`: Se ativou diário do UWorld

### 2. **user_basic_data** (Dados básicos do usuário)
Informações pessoais e profissionais coletadas no questionário

**Campos principais:**
- `cpf`: CPF do usuário
- `orcid`: ORCID (para publicações)
- `address_*`: Endereço completo (internacional)
- `graduation_date`: Data de formatura em medicina
- `medical_school`: Faculdade de medicina
- `current_institution`: Instituição atual de trabalho
- `current_specialty`: Especialidade atual
- `intended_specialty_usa`: Especialidade pretendida nos EUA

### 3. **user_usmle_data** (Dados do USMLE)
Informações sobre a preparação para o USMLE

**Campos principais:**
- `pathway`: traditional ou alternate
- `has_visa`: Se possui visto americano
- `current_stage`: Etapa atual (starting, step1_done, step2ck_done, etc)
- `next_exam`: Próxima prova
- `next_exam_date`: Data da próxima prova
- `first_pass_months`: Duração planejada do First Pass (1-12 meses)
- `second_pass_months`: Duração planejada do Second Pass (0-6 meses)
- `dedicated_months`: Duração planejada do Dedicated (0-3 meses)

### 4. **user_uworld_data** (Dados do UWorld)
Informações sobre o uso do UWorld

**Campos principais:**
- `purchased`: Se comprou o UWorld
- `activated`: Se ativou a assinatura
- `expiration_date`: Data de vencimento
- `questions_done`: Número de questões feitas
- `overall_percentage`: Porcentagem geral de acertos
- `lowest_percentage` / `highest_percentage`: Menor/maior porcentagem
- `lowest_system` / `highest_system`: System com menor/maior desempenho

### 5. **user_uworld_progress** (Progresso no UWorld)
Registro de Systems/Categories concluídos

**Campos principais:**
- `system`: Nome do system
- `category`: Nome da category
- `completed`: Se foi concluído
- `difficulty_marked`: Se marcou como difícil
- `difficulty_notes`: Notas sobre dificuldades

### 6. **user_english_level** (Nível de inglês)
Autoavaliação do nível de inglês

**Campos principais:**
- `reading_level`: Nível de leitura
- `listening_level`: Nível de escuta
- `additional_comments`: Comentários adicionais

### 7. **user_anki_data** (Dados do Anki)
Informações sobre uso do Anki

**Campos principais:**
- `downloaded` / `used`: Se baixou/usa o Anki
- `uses_anking`: Se usa o deck AnKing
- `frequency`: Frequência de uso
- `creates_own_cards`: Se cria cards próprios
- `devices`: Array JSON com dispositivos usados
- `main_device`: Dispositivo principal
- `average_cards_per_day`: Média de cards por dia
- `using_since`: Desde quando usa

### 8. **user_research_data** (Dados de pesquisa)
Informações sobre experiência e interesse em pesquisa

**Campos principais:**
- `experience_level`: Nível de experiência
- `participated_systematic_review`: Se participou de revisão sistemática
- `interest_areas`: Array JSON com 5 áreas de interesse
- `target_institutions`: Array JSON com 3 instituições-alvo
- `wants_research_ward`: immediate, after_usmle ou no
- `can_collaborate_stages`: Etapas em que pode colaborar

### 9. **user_research_contacts** (Contatos de networking)
Contatos para networking em pesquisa

**Campos principais:**
- `contact_name`: Nome do contato
- `specialty`: Especialidade
- `institution`: Instituição

### 10. **user_observerships** (Estágios médicos)
Registro de observerships/clerkships

**Campos principais:**
- `is_past`: Se é passado ou planejado
- `institution`: Instituição
- `year`: Ano
- `specialty`: Especialidade
- `location_type`: hospital ou private_clinic
- `approximate_cost`: Custo aproximado
- `got_recommendation_letter`: Se conseguiu carta de recomendação

### 11. **user_background** (História pessoal)
História e contexto do aluno

**Campos principais:**
- `current_location`: brazil, usa ou other
- `personal_story`: História pessoal
- `family_agreement`: Acordo da família
- `how_got_to_usa`: Como foi para os EUA (se aplicável)
- `works_in_usa`: Se trabalha nos EUA

### 12. **user_preparation_status** (Status de preparação)
O que o aluno está preparando atualmente

**Campos principais:**
- `currently_preparing_for`: Step 1, Step 2 CK, Step 3, OET, etc

### 13. **messages** (Recados)
Mensagens dos mentores para os alunos

**Campos principais:**
- `user_id`: Destinatário
- `message`: Conteúdo da mensagem
- `is_read`: Se foi lida
- `created_by`: Mentor que enviou

### 14. **links_repository** (Repositório de links)
Links úteis compartilhados

**Campos principais:**
- `title`: Título do link
- `url`: URL
- `description`: Descrição
- `category`: step1, step2ck, step3, oet, research
- `added_by`: Quem adicionou

### 15. **study_diary** (Diário de estudos)
Entradas diárias de estudo (máximo 250 caracteres)

**Campos principais:**
- `date`: Data da entrada
- `entry_text`: Texto (max 250 chars)

### 16. **uworld_diary** (Diário do UWorld)
Registro de sessões do UWorld

**Campos principais:**
- `date`: Data
- `questions_done`: Questões feitas
- `questions_correct`: Questões corretas
- `time_spent_minutes`: Tempo gasto
- `system_category`: System e category
- `difficulties_text`: Dificuldades (max 250 chars)

### 17. **landmarks** (Marcos e chamadas)
Registro de landmarks (entrada, chamadas, etc)

**Campos principais:**
- `landmark_type`: Tipo do landmark
- `title`: Título/descrição
- `completed`: Se foi concluído
- `completion_date`: Data de conclusão
- `is_urgent`: Se está marcado como urgente
- `notes`: Array JSON com observações
- `order_position`: Ordem de exibição

### 18. **schedules** (Cronogramas)
Cronograma personalizado de estudos

**Campos principais:**
- `system`: System do UWorld
- `category`: Category do UWorld
- `questions`: Número de questões
- `completed`: Se foi concluído
- `uploaded_by`: Mentor que fez upload

### 19. **schedule_delays** (Atrasos no cronograma)
Registro de atrasos sinalizados pelo aluno

**Campos principais:**
- `start_date`: Início do atraso
- `end_date`: Fim do atraso
- `reason`: Motivo do atraso

### 20. **blog_posts** (Posts do blog)
Posts feitos no blog da Ward

**Campos principais:**
- `content`: Conteúdo do post
- `likes` / `dislikes`: Curtidas/descurtidas
- `is_pinned`: Se está pinado
- `pin_until`: Até quando está pinado

### 21. **blog_comments** (Comentários do blog)
Comentários nos posts

**Campos principais:**
- `post_id`: Post comentado
- `content`: Conteúdo do comentário
- `likes`: Curtidas

### 22. **research_projects** (Projetos de pesquisa)
Revisões sistemáticas em andamento

**Campos principais:**
- `type`: single_arm, double_arm, network, no_meta
- `intervention`: Intervenção
- `comparison`: Comparação (para double_arm)
- `interventions`: Array JSON (para network)
- `population`: População
- `current_stage`: Etapa atual
- `deadline`: Data limite
- `google_drive_link`: Link da pasta do Drive
- `comments`: Comentários

### 23. **research_coauthors** (Coautores)
Relacionamento entre projetos e coautores

**Campos principais:**
- `project_id`: Projeto
- `user_id`: Coautor

### 24. **research_stages_completed** (Etapas da pesquisa)
Etapas concluídas de cada projeto

**Campos principais:**
- `project_id`: Projeto
- `stage_name`: Nome da etapa
- `completed`: Se foi concluída
- `authors`: Array JSON com autores envolvidos
- `completed_date`: Data de conclusão

### 25. **daily_checkins** (Check-ins diários)
Check-ins que aparecem ao abrir o app

**Campos principais:**
- `date`: Data do check-in
- `status`: tranquilo, preciso_ajuda, parado
- `message`: Mensagem opcional

## 🔑 Usuários Iniciais

O script cria 4 usuários iniciais:

1. **Marcos Vilela** (Admin/TI)
   - Email: marcosantoniodv@gmail.com
   - Senha: Luna11anos
   - Role: admin

2. **Dra. Iria da Costa** (Mentora)
   - Email: iria@wardacademy.com
   - Senha: senha_temporaria
   - Role: mentor_iria

3. **Guilherme Lavor** (Mentor)
   - Email: guilherme@wardacademy.com
   - Senha: senha_temporaria
   - Role: mentor_guilherme

4. **Rômulo Sanglard** (Mentor)
   - Email: romulo@wardacademy.com
   - Senha: senha_temporaria
   - Role: mentor_romulo

## 📈 Índices Criados

Para otimizar performance, foram criados índices em:
- Email de usuários
- Role de usuários
- Mensagens por usuário
- Links por categoria
- Diários por usuário e data
- Landmarks por usuário
- Posts do blog por data
- Pesquisas por criador
- E outros campos frequentemente consultados

## 🔄 Triggers

Todas as tabelas relevantes possuem triggers para atualizar automaticamente o campo `updated_at` quando houver UPDATE.

## ⚠️ Observações Importantes

1. **Senhas**: Todas as senhas são criptografadas usando bcrypt (através da função `crypt()` do PostgreSQL)
2. **UUIDs**: Todas as chaves primárias usam UUID v4 para maior segurança
3. **Cascade Delete**: Quando um usuário é deletado, todos os seus dados relacionados são automaticamente removidos
4. **Validações**: Diversos campos possuem constraints CHECK para garantir integridade dos dados
5. **JSONB**: Usado para campos que armazenam arrays ou objetos (devices do Anki, interest_areas, etc)

## 🚀 Como Aplicar o Schema

1. Acesse o Supabase SQL Editor
2. Cole o conteúdo do arquivo `reset_complete_schema.sql`
3. Execute o script
4. Verifique se todas as tabelas foram criadas com sucesso

**ATENÇÃO**: Este script DROP todas as tabelas existentes! Use com cuidado!
