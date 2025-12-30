-- Ward Academy Student Tracking Platform - Supabase Schema
-- Database schema for student tracking, mentoring, and research management

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS AND AUTHENTICATION
-- ============================================

-- Main users table (extends Supabase auth.users)
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    user_type VARCHAR(50) NOT NULL CHECK (user_type IN ('student', 'mentor_marcos', 'mentor_iria', 'mentor_guilherme', 'mentor_romulo')),
    first_login BOOLEAN DEFAULT TRUE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User profiles - complete personal information
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    cpf VARCHAR(14),
    orcid VARCHAR(100),
    email_confirmed VARCHAR(255),
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state_province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),
    medical_graduation_date DATE,
    medical_school VARCHAR(255),
    current_institution VARCHAR(255),
    current_specialty VARCHAR(255),
    desired_us_specialty VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- QUESTIONNAIRE RESPONSES
-- ============================================

-- USMLE pathway information
CREATE TABLE public.usmle_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    pathway VARCHAR(50) CHECK (pathway IN ('traditional', 'alternate')),
    has_us_visa BOOLEAN,
    visa_type VARCHAR(100),
    current_stage VARCHAR(100),
    current_stage_other TEXT,
    next_exam_date DATE,
    first_pass_months INTEGER,
    second_pass_months INTEGER,
    dedicated_months INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UWorld information
CREATE TABLE public.uworld_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    purchased BOOLEAN,
    activated BOOLEAN,
    expiration_date DATE,
    subscription_length VARCHAR(50),
    total_questions_done INTEGER,
    overall_percentage DECIMAL(5,2),
    lowest_percentage DECIMAL(5,2),
    lowest_percentage_system VARCHAR(100),
    highest_percentage DECIMAL(5,2),
    highest_percentage_system VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UWorld systems and categories completed
CREATE TABLE public.uworld_systems_completed (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    exam_type VARCHAR(50) CHECK (exam_type IN ('step1', 'step2ck', 'step3')),
    system_name VARCHAR(255),
    category_name VARCHAR(255),
    is_difficult BOOLEAN DEFAULT FALSE,
    difficulty_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- English proficiency
CREATE TABLE public.english_proficiency (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    reading_comprehension VARCHAR(50),
    vocabulary_level VARCHAR(50),
    listening_comprehension VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Anki usage information
CREATE TABLE public.anki_info (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    downloaded BOOLEAN,
    used BOOLEAN,
    uses_anking BOOLEAN,
    usage_frequency VARCHAR(50),
    creates_own_cards VARCHAR(50),
    devices_used TEXT[], -- Array of devices
    most_used_device VARCHAR(100),
    average_cards_per_day INTEGER,
    using_since DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research experience
CREATE TABLE public.research_experience (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    orcid_id VARCHAR(100),
    research_address TEXT,
    research_email VARCHAR(255),
    research_institution VARCHAR(255),
    research_specialty VARCHAR(255),
    research_department VARCHAR(255),
    experience_level VARCHAR(100),
    systematic_review_participation VARCHAR(100),
    systematic_review_status VARCHAR(100),
    research_interests TEXT[], -- Array of 5 interests
    target_institutions TEXT[], -- Array of 3 institutions
    wants_to_research VARCHAR(50),
    can_help_with TEXT,
    has_research_contacts BOOLEAN,
    research_contacts JSONB, -- Array of {name, specialty, institution}
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Clinical rotations (observers/clerkships)
CREATE TABLE public.clinical_rotations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    rotation_type VARCHAR(50) CHECK (rotation_type IN ('clerkship', 'observership', 'planned')),
    institution VARCHAR(255),
    year INTEGER,
    specialty VARCHAR(100),
    setting VARCHAR(50) CHECK (setting IN ('private_practice', 'hospital')),
    approximate_cost DECIMAL(10,2),
    got_lor BOOLEAN,
    comments TEXT,
    planned_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Personal background
CREATE TABLE public.personal_background (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    current_location VARCHAR(100),
    personal_story TEXT,
    family_support BOOLEAN,
    us_immigration_story TEXT,
    current_visa VARCHAR(100),
    us_employment_status TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Questionnaire progress tracking
CREATE TABLE public.questionnaire_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    current_page INTEGER DEFAULT 1,
    total_pages INTEGER DEFAULT 7,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- DAILY UPDATES AND DIARIES
-- ============================================

-- Daily login updates
CREATE TABLE public.daily_updates (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    update_text TEXT,
    status VARCHAR(50) CHECK (status IN ('good', 'need_help', 'paused', 'skipped')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Study diary
CREATE TABLE public.study_diary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_text VARCHAR(250) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- UWorld diary
CREATE TABLE public.uworld_diary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    questions_done INTEGER,
    questions_correct INTEGER,
    time_spent_minutes INTEGER,
    system_name VARCHAR(255),
    category_name VARCHAR(255),
    difficulties VARCHAR(250),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User settings for diaries
CREATE TABLE public.user_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    study_diary_enabled BOOLEAN DEFAULT FALSE,
    uworld_diary_enabled BOOLEAN DEFAULT FALSE,
    current_exam_prep VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LANDMARKS AND CALLS
-- ============================================

-- Landmarks (scheduled calls with mentors)
CREATE TABLE public.landmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    landmark_type VARCHAR(100) NOT NULL,
    mentor_name VARCHAR(100),
    call_number INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_date DATE,
    is_urgent BOOLEAN DEFAULT FALSE,
    display_order INTEGER,
    observations TEXT,
    show_condition VARCHAR(100), -- e.g., 'wants_research' to show only if user wants to do research
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Default landmarks template
CREATE TABLE public.default_landmarks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    landmark_type VARCHAR(100) NOT NULL,
    mentor_name VARCHAR(100),
    call_number INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    display_order INTEGER,
    show_condition VARCHAR(100)
);

-- ============================================
-- SCHEDULES
-- ============================================

-- Study schedules
CREATE TABLE public.schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    system_name VARCHAR(255),
    category_name VARCHAR(255),
    questions INTEGER,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Schedule delays
CREATE TABLE public.schedule_delays (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- LINKS REPOSITORY
-- ============================================

-- Links repository
CREATE TABLE public.links (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    added_by UUID REFERENCES public.users(id),
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) CHECK (category IN ('step1', 'step2ck', 'step3', 'oet', 'research')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- BLOG
-- ============================================

-- Blog posts
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    is_pinned BOOLEAN DEFAULT FALSE,
    pinned_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Blog likes/dislikes
CREATE TABLE public.blog_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    is_like BOOLEAN, -- true for like, false for dislike
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

-- Blog comments
CREATE TABLE public.blog_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    post_id UUID REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    author_id UUID REFERENCES public.users(id),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- RESEARCH PROJECTS
-- ============================================

-- Research projects
CREATE TABLE public.research_projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_by UUID REFERENCES public.users(id),
    meta_analysis_type VARCHAR(50) CHECK (meta_analysis_type IN ('single_arm', 'double_arm', 'network', 'none')),
    intervention TEXT,
    comparison TEXT,
    population TEXT,
    title TEXT NOT NULL,
    current_stage VARCHAR(100),
    deadline DATE,
    drive_link TEXT,
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Research project authors (students involved)
CREATE TABLE public.research_authors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    role VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

-- Research project stages
CREATE TABLE public.research_stages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID REFERENCES public.research_projects(id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    authors_involved TEXT, -- Comma-separated list of author names
    completed_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MESSAGES
-- ============================================

-- Messages from mentors to students
CREATE TABLE public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    recipient_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES public.users(id),
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_user_type ON public.users(user_type);
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_landmarks_user_id ON public.landmarks(user_id);
CREATE INDEX idx_schedules_user_id ON public.schedules(user_id);
CREATE INDEX idx_blog_posts_created_at ON public.blog_posts(created_at DESC);
CREATE INDEX idx_blog_posts_pinned ON public.blog_posts(is_pinned, pinned_until);
CREATE INDEX idx_research_authors_user_id ON public.research_authors(user_id);
CREATE INDEX idx_research_authors_project_id ON public.research_authors(project_id);
CREATE INDEX idx_study_diary_user_date ON public.study_diary(user_id, entry_date DESC);
CREATE INDEX idx_uworld_diary_user_date ON public.uworld_diary(user_id, entry_date DESC);
CREATE INDEX idx_messages_recipient ON public.messages(recipient_id, is_read);

-- ============================================
-- ROW LEVEL SECURITY POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usmle_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uworld_info ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uworld_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Policies will be added based on authentication implementation

-- ============================================
-- INITIAL DATA - Default Landmarks
-- ============================================

INSERT INTO public.default_landmarks (landmark_type, mentor_name, call_number, title, display_order, show_condition) VALUES
('initial_call', 'Dra Iria', 1, '1ª Chamada com a Dra Iria: Conversa sobre background e USMLE', 1, NULL),
('anki_setup', 'Guilherme', 1, '1ª Chamada com o Guilherme: Configurando o Anki', 2, NULL),
('next_steps', 'Marcos', 1, '1ª Chamada com o Marcos: Organizando os próximos passos', 3, NULL),
('uworld_intro', 'Dra Iria', 2, '2ª Chamada com a Dra Iria: Como usar o UWorld', 4, NULL),
('research_intro', 'Marcos', 2, '2ª Chamada com o Marcos: Conversa sobre pesquisa', 5, 'wants_research'),
('first_weeks', 'Dra Iria', 3, '3ª Chamada com a Dra Iria: Conversa sobre as primeiras semanas de estudo', 6, NULL),
('anki_followup', 'Guilherme', 2, '2ª Chamada com o Guilherme: Como tem sido o uso do Anki nas últimas semanas', 7, NULL),
('databases', 'Marcos', 3, '3ª Chamada com o Marcos: Como usar os databases corretamente', 8, 'wants_research'),
('ward_block', 'Dra Iria', 4, '4ª Chamada com a Dra Iria: Conversa sobre o desempenho no blocão da Ward', 9, NULL),
('systematic_review', 'Marcos', 4, '4ª Chamada com o Marcos: Validando uma ideia de revisão sistemática', 10, 'wants_research'),
('title_abstract', 'Marcos', 5, '5ª Chamada com o Marcos: Triagem por título e resumo', 11, 'wants_research'),
('system_completion', 'Dra Iria', NULL, 'Chamadas com a Dra Iria ao finalizar cada System do UWorld', 12, NULL),
('full_text', 'Marcos', 6, '6ª Chamada com o Marcos: Triagem por manuscritos completos', 13, 'wants_research'),
('data_extraction', 'Marcos', 7, '7ª Chamada com o Marcos: Extração de dados', 14, 'wants_research'),
('risk_of_bias', 'Marcos', 8, '8ª Chamada com o Marcos: Risco de viés', 15, 'wants_research'),
('scientific_writing', 'Marcos', 9, '9ª Chamada com o Marcos: Escrita científica', 16, 'wants_research'),
('manuscript_submission', 'Marcos', 10, '10ª Chamada com o Marcos: Submissão do manuscrito', 17, 'wants_research'),
('second_pass', 'Dra Iria', NULL, 'Chamada com a Dra Iria sobre Second Pass', 18, NULL),
('self_assessments', 'Dra Iria', NULL, 'Chamada com a Dra Iria sobre Simulados (Self Assessments NBMEs)', 19, NULL),
('dedicated', 'Dra Iria', NULL, 'Chamada com a Dra Iria sobre Dedicated', 20, NULL),
('schedule_exam', 'Dra Iria', NULL, 'Chamada com a Dra Iria sobre agendar a prova', 21, NULL),
('pre_exam', 'Dra Iria', NULL, 'Chamada com a Dra Iria pré-prova', 22, NULL),
('post_exam', 'Dra Iria', NULL, 'Chamada com a Dra Iria pós-prova', 23, NULL);

-- ============================================
-- INITIAL USERS - Mentors
-- ============================================

-- Insert mentors (passwords should be hashed in production)
INSERT INTO public.users (email, password_hash, user_type, first_login) VALUES
('marcosantoniodv@gmail.com', '$2a$10$XQz9Z9Z9Z9Z9Z9Z9Z9Z9ZO', 'mentor_marcos', FALSE); -- Password: Luna11anos (needs to be properly hashed)

-- Note: Other mentors should be added with their credentials
-- In production, use proper password hashing like bcrypt
