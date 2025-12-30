-- ============================================================================
-- WARD ACADEMY - COMPLETE DATABASE RESET AND REBUILD
-- ============================================================================
-- Este script RESETA completamente o banco de dados e recria do zero
-- ATENÇÃO: Isso vai DELETAR TODOS OS DADOS EXISTENTES!
-- ============================================================================

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Drop all existing tables (in reverse order of dependencies)
DROP TABLE IF EXISTS daily_checkins CASCADE;
DROP TABLE IF EXISTS research_stages_completed CASCADE;
DROP TABLE IF EXISTS research_coauthors CASCADE;
DROP TABLE IF EXISTS research_projects CASCADE;
DROP TABLE IF EXISTS blog_comments CASCADE;
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS schedule_delays CASCADE;
DROP TABLE IF EXISTS schedules CASCADE;
DROP TABLE IF EXISTS landmarks CASCADE;
DROP TABLE IF EXISTS uworld_diary CASCADE;
DROP TABLE IF EXISTS study_diary CASCADE;
DROP TABLE IF EXISTS links_repository CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS user_preparation_status CASCADE;
DROP TABLE IF EXISTS user_background CASCADE;
DROP TABLE IF EXISTS user_observerships CASCADE;
DROP TABLE IF EXISTS user_research_contacts CASCADE;
DROP TABLE IF EXISTS user_research_data CASCADE;
DROP TABLE IF EXISTS user_anki_data CASCADE;
DROP TABLE IF EXISTS user_english_level CASCADE;
DROP TABLE IF EXISTS user_uworld_progress CASCADE;
DROP TABLE IF EXISTS user_uworld_data CASCADE;
DROP TABLE IF EXISTS user_usmle_data CASCADE;
DROP TABLE IF EXISTS user_basic_data CASCADE;
DROP TABLE IF EXISTS users CASCADE;

-- ============================================================================
-- TABELA: users (Principal)
-- ============================================================================
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('aluno', 'mentor_iria', 'mentor_marcos', 'mentor_guilherme', 'mentor_romulo', 'admin')),
    first_login_completed BOOLEAN DEFAULT FALSE,
    questionnaire_step INTEGER DEFAULT 0,
    diary_study_enabled BOOLEAN DEFAULT FALSE,
    diary_uworld_enabled BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_basic_data (Dados pessoais e profissionais)
-- ============================================================================
CREATE TABLE user_basic_data (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    cpf TEXT,
    orcid TEXT,
    address_line1 TEXT,
    address_line2 TEXT,
    city TEXT,
    state TEXT,
    zip_code TEXT,
    country TEXT,
    graduation_date DATE,
    medical_school TEXT,
    current_institution TEXT,
    current_specialty TEXT,
    intended_specialty_usa TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_usmle_data (Dados do USMLE)
-- ============================================================================
CREATE TABLE user_usmle_data (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    pathway TEXT CHECK (pathway IN ('traditional', 'alternate')),
    has_visa BOOLEAN,
    visa_type TEXT,
    current_stage TEXT CHECK (current_stage IN ('starting', 'step1_done', 'step2ck_done', 'oet_done', 'step3_done', 'other')),
    other_stage_details TEXT,
    next_exam TEXT,
    next_exam_date DATE,
    first_pass_months INTEGER DEFAULT 6,
    second_pass_months INTEGER DEFAULT 2,
    dedicated_months INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_uworld_data (Dados do UWorld)
-- ============================================================================
CREATE TABLE user_uworld_data (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    purchased BOOLEAN DEFAULT FALSE,
    activated BOOLEAN DEFAULT FALSE,
    expiration_date DATE,
    subscription_length TEXT,
    questions_done INTEGER DEFAULT 0,
    overall_percentage DECIMAL(5,2),
    lowest_percentage DECIMAL(5,2),
    lowest_system TEXT,
    highest_percentage DECIMAL(5,2),
    highest_system TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_uworld_progress (Progresso por System/Category)
-- ============================================================================
CREATE TABLE user_uworld_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    system TEXT NOT NULL,
    category TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    difficulty_marked BOOLEAN DEFAULT FALSE,
    difficulty_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, system, category)
);

-- ============================================================================
-- TABELA: user_english_level (Nível de inglês)
-- ============================================================================
CREATE TABLE user_english_level (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    reading_level TEXT,
    listening_level TEXT,
    additional_comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_anki_data (Dados do Anki)
-- ============================================================================
CREATE TABLE user_anki_data (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    downloaded BOOLEAN DEFAULT FALSE,
    used BOOLEAN DEFAULT FALSE,
    uses_anking BOOLEAN DEFAULT FALSE,
    frequency TEXT,
    creates_own_cards TEXT,
    devices JSONB DEFAULT '[]'::jsonb,
    main_device TEXT,
    average_cards_per_day INTEGER,
    using_since DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_research_data (Dados de pesquisa)
-- ============================================================================
CREATE TABLE user_research_data (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    experience_level TEXT,
    participated_systematic_review TEXT,
    review_role TEXT,
    review_status TEXT,
    interest_areas JSONB DEFAULT '[]'::jsonb,
    target_institutions JSONB DEFAULT '[]'::jsonb,
    wants_research_ward TEXT CHECK (wants_research_ward IN ('immediate', 'after_usmle', 'no')),
    can_collaborate_stages TEXT,
    has_networking_contacts BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_research_contacts (Contatos de networking)
-- ============================================================================
CREATE TABLE user_research_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contact_name TEXT NOT NULL,
    specialty TEXT,
    institution TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_observerships (Estágios médicos)
-- ============================================================================
CREATE TABLE user_observerships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_past BOOLEAN DEFAULT TRUE,
    institution TEXT,
    year INTEGER,
    specialty TEXT,
    location_type TEXT CHECK (location_type IN ('hospital', 'private_clinic')),
    approximate_cost DECIMAL(10,2),
    got_recommendation_letter BOOLEAN,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_background (História pessoal)
-- ============================================================================
CREATE TABLE user_background (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_location TEXT CHECK (current_location IN ('brazil', 'usa', 'other')),
    other_location TEXT,
    personal_story TEXT,
    family_agreement TEXT,
    how_got_to_usa TEXT,
    visa_type_usa TEXT,
    how_got_visa TEXT,
    works_in_usa BOOLEAN,
    how_got_job TEXT,
    did_clerkship_usa BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: user_preparation_status (Status atual de preparação)
-- ============================================================================
CREATE TABLE user_preparation_status (
    user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    currently_preparing_for TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: messages (Recados dos mentores)
-- ============================================================================
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: links_repository (Repositório de links)
-- ============================================================================
CREATE TABLE links_repository (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category TEXT CHECK (category IN ('step1', 'step2ck', 'step3', 'oet', 'research')),
    added_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: study_diary (Diário de estudos)
-- ============================================================================
CREATE TABLE study_diary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    entry_text TEXT NOT NULL CHECK (LENGTH(entry_text) <= 250),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- ============================================================================
-- TABELA: uworld_diary (Diário do UWorld)
-- ============================================================================
CREATE TABLE uworld_diary (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    questions_done INTEGER NOT NULL,
    questions_correct INTEGER NOT NULL,
    time_spent_minutes INTEGER,
    system_category TEXT,
    difficulties_text TEXT CHECK (LENGTH(difficulties_text) <= 250),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: landmarks (Marcos e chamadas)
-- ============================================================================
CREATE TABLE landmarks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    landmark_type TEXT NOT NULL,
    title TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completion_date DATE,
    is_urgent BOOLEAN DEFAULT FALSE,
    notes JSONB DEFAULT '[]'::jsonb,
    order_position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: schedules (Cronogramas)
-- ============================================================================
CREATE TABLE schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    system TEXT NOT NULL,
    category TEXT NOT NULL,
    questions INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    order_position INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    uploaded_by UUID REFERENCES users(id)
);

-- ============================================================================
-- TABELA: schedule_delays (Atrasos no cronograma)
-- ============================================================================
CREATE TABLE schedule_delays (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: blog_posts (Posts do blog)
-- ============================================================================
CREATE TABLE blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    dislikes INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    pin_until DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: blog_comments (Comentários do blog)
-- ============================================================================
CREATE TABLE blog_comments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    post_id UUID REFERENCES blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    likes INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: research_projects (Projetos de pesquisa)
-- ============================================================================
CREATE TABLE research_projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT CHECK (type IN ('single_arm', 'double_arm', 'network', 'no_meta')),
    intervention TEXT,
    comparison TEXT,
    interventions JSONB,
    population TEXT,
    current_stage TEXT,
    deadline DATE,
    google_drive_link TEXT,
    comments TEXT,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: research_coauthors (Coautores das pesquisas)
-- ============================================================================
CREATE TABLE research_coauthors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- ============================================================================
-- TABELA: research_stages_completed (Etapas concluídas das pesquisas)
-- ============================================================================
CREATE TABLE research_stages_completed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    project_id UUID REFERENCES research_projects(id) ON DELETE CASCADE,
    stage_name TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    authors JSONB DEFAULT '[]'::jsonb,
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- TABELA: daily_checkins (Check-ins diários)
-- ============================================================================
CREATE TABLE daily_checkins (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    status TEXT CHECK (status IN ('tranquilo', 'preciso_ajuda', 'parado')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, date)
);

-- ============================================================================
-- ÍNDICES para melhor performance
-- ============================================================================
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_messages_user_id ON messages(user_id);
CREATE INDEX idx_messages_is_read ON messages(is_read);
CREATE INDEX idx_links_category ON links_repository(category);
CREATE INDEX idx_study_diary_user_date ON study_diary(user_id, date);
CREATE INDEX idx_uworld_diary_user_date ON uworld_diary(user_id, date);
CREATE INDEX idx_landmarks_user_id ON landmarks(user_id);
CREATE INDEX idx_landmarks_completed ON landmarks(completed);
CREATE INDEX idx_schedules_user_id ON schedules(user_id);
CREATE INDEX idx_blog_posts_created_at ON blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_is_pinned ON blog_posts(is_pinned);
CREATE INDEX idx_research_projects_created_by ON research_projects(created_by);
CREATE INDEX idx_research_coauthors_user_id ON research_coauthors(user_id);
CREATE INDEX idx_daily_checkins_user_date ON daily_checkins(user_id, date);

-- ============================================================================
-- INSERIR USUÁRIOS INICIAIS (Mentores e Admin)
-- ============================================================================

-- Marcos Vilela (Admin/TI)
INSERT INTO users (email, password_hash, name, role, first_login_completed)
VALUES (
    'marcosantoniodv@gmail.com',
    crypt('Luna11anos', gen_salt('bf')),
    'Marcos Vilela',
    'admin',
    TRUE
);

-- Dra. Iria da Costa
INSERT INTO users (email, password_hash, name, role, first_login_completed)
VALUES (
    'iria@wardacademy.com',
    crypt('senha_temporaria', gen_salt('bf')),
    'Dra. Iria da Costa',
    'mentor_iria',
    TRUE
);

-- Guilherme Lavor
INSERT INTO users (email, password_hash, name, role, first_login_completed)
VALUES (
    'guilherme@wardacademy.com',
    crypt('senha_temporaria', gen_salt('bf')),
    'Guilherme Lavor',
    'mentor_guilherme',
    TRUE
);

-- Rômulo Sanglard
INSERT INTO users (email, password_hash, name, role, first_login_completed)
VALUES (
    'romulo@wardacademy.com',
    crypt('senha_temporaria', gen_salt('bf')),
    'Rômulo Sanglard',
    'mentor_romulo',
    TRUE
);

-- ============================================================================
-- FUNCTIONS para atualização automática de updated_at
-- ============================================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Aplicar trigger em todas as tabelas relevantes
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_basic_data_updated_at BEFORE UPDATE ON user_basic_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_usmle_data_updated_at BEFORE UPDATE ON user_usmle_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_uworld_data_updated_at BEFORE UPDATE ON user_uworld_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_uworld_progress_updated_at BEFORE UPDATE ON user_uworld_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_english_level_updated_at BEFORE UPDATE ON user_english_level FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_anki_data_updated_at BEFORE UPDATE ON user_anki_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_research_data_updated_at BEFORE UPDATE ON user_research_data FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_observerships_updated_at BEFORE UPDATE ON user_observerships FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_background_updated_at BEFORE UPDATE ON user_background FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_diary_updated_at BEFORE UPDATE ON study_diary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_uworld_diary_updated_at BEFORE UPDATE ON uworld_diary FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_landmarks_updated_at BEFORE UPDATE ON landmarks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_schedules_updated_at BEFORE UPDATE ON schedules FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_comments_updated_at BEFORE UPDATE ON blog_comments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON research_projects FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_research_stages_completed_updated_at BEFORE UPDATE ON research_stages_completed FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FIM DO SCRIPT
-- ============================================================================
-- Schema criado com sucesso!
-- Próximos passos: Criar as páginas HTML/CSS/JS
-- ============================================================================
