-- =====================================================
-- Ward Academy Platform Tables (FIXED VERSION)
-- Migration 04: Core platform functionality
-- =====================================================

-- Add role to users table (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = 'users'
        AND column_name = 'role'
    ) THEN
        ALTER TABLE public.users ADD COLUMN role VARCHAR(50) DEFAULT 'student';
    END IF;
END $$;

-- =====================================================
-- MESSAGES TABLE
-- Mentors can leave messages for students
-- =====================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    from_mentor VARCHAR(100) NOT NULL,
    message_text TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

CREATE INDEX IF NOT EXISTS messages_user_id_idx ON public.messages(user_id);
CREATE INDEX IF NOT EXISTS messages_is_read_idx ON public.messages(is_read);

-- =====================================================
-- STUDY DIARY TABLE (check if exists first)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.study_diary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    entry_text VARCHAR(250) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, entry_date)
);

CREATE INDEX IF NOT EXISTS study_diary_user_id_idx ON public.study_diary(user_id);
CREATE INDEX IF NOT EXISTS study_diary_entry_date_idx ON public.study_diary(entry_date DESC);

-- =====================================================
-- UWORLD DIARY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.uworld_diary (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    entry_date DATE NOT NULL,
    questions_done INTEGER NOT NULL,
    questions_correct INTEGER NOT NULL,
    time_spent_minutes INTEGER,
    system_category VARCHAR(255),
    difficulties TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS uworld_diary_user_id_idx ON public.uworld_diary(user_id);
CREATE INDEX IF NOT EXISTS uworld_diary_entry_date_idx ON public.uworld_diary(entry_date DESC);

-- =====================================================
-- LINKS REPOSITORY TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.links_repository (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL,
    added_by UUID REFERENCES public.users(id),
    added_by_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS links_category_idx ON public.links_repository(category);
CREATE INDEX IF NOT EXISTS links_created_at_idx ON public.links_repository(created_at DESC);

-- =====================================================
-- BLOG POSTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_role VARCHAR(50) NOT NULL,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    dislikes_count INTEGER DEFAULT 0,
    is_pinned BOOLEAN DEFAULT FALSE,
    pinned_until TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_posts_user_id_idx ON public.blog_posts(user_id);
CREATE INDEX IF NOT EXISTS blog_posts_created_at_idx ON public.blog_posts(created_at DESC);
CREATE INDEX IF NOT EXISTS blog_posts_is_pinned_idx ON public.blog_posts(is_pinned);

-- =====================================================
-- BLOG COMMENTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_comments_post_id_idx ON public.blog_comments(post_id);

-- =====================================================
-- BLOG LIKES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_likes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_like BOOLEAN NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS blog_likes_post_id_idx ON public.blog_likes(post_id);

-- =====================================================
-- RESEARCH PROJECTS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.research_projects (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    meta_analysis_type VARCHAR(50),
    intervention TEXT,
    comparison TEXT,
    population TEXT,
    current_stage VARCHAR(100),
    deadline DATE,
    google_drive_link TEXT,
    comments TEXT,
    created_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS research_projects_created_by_idx ON public.research_projects(created_by);

-- =====================================================
-- RESEARCH PROJECT COLLABORATORS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.research_project_collaborators (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS research_collaborators_project_id_idx ON public.research_project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS research_collaborators_user_id_idx ON public.research_project_collaborators(user_id);

-- =====================================================
-- RESEARCH PROJECT STAGES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.research_project_stages (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
    stage_name VARCHAR(255) NOT NULL,
    stage_order INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    authors_involved TEXT,
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS research_stages_project_id_idx ON public.research_project_stages(project_id);

-- =====================================================
-- DEFAULT LANDMARKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.default_landmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    landmark_type VARCHAR(50) NOT NULL,
    mentor_name VARCHAR(100),
    call_number INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    show_condition VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LANDMARKS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.landmarks (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    landmark_type VARCHAR(50) NOT NULL,
    mentor_name VARCHAR(100),
    call_number INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    show_condition VARCHAR(100),
    is_completed BOOLEAN DEFAULT FALSE,
    completed_date DATE,
    is_urgent BOOLEAN DEFAULT FALSE,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS landmarks_user_id_idx ON public.landmarks(user_id);
CREATE INDEX IF NOT EXISTS landmarks_completed_idx ON public.landmarks(is_completed);
CREATE INDEX IF NOT EXISTS landmarks_urgent_idx ON public.landmarks(is_urgent);

-- =====================================================
-- LANDMARK NOTES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.landmark_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    landmark_id UUID NOT NULL REFERENCES public.landmarks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id),
    user_name VARCHAR(255) NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS landmark_notes_landmark_id_idx ON public.landmark_notes(landmark_id);

-- =====================================================
-- SCHEDULES TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    created_by UUID REFERENCES public.users(id),
    created_by_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS schedules_user_id_idx ON public.schedules(user_id);

-- =====================================================
-- SCHEDULE ROWS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schedule_rows (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
    row_order INTEGER NOT NULL,
    system VARCHAR(255),
    category VARCHAR(255),
    questions_count INTEGER,
    is_completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS schedule_rows_schedule_id_idx ON public.schedule_rows(schedule_id);
CREATE INDEX IF NOT EXISTS schedule_rows_order_idx ON public.schedule_rows(schedule_id, row_order);

-- =====================================================
-- SCHEDULE DELAYS TABLE
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schedule_delays (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS schedule_delays_schedule_id_idx ON public.schedule_delays(schedule_id);

-- =====================================================
-- DAILY CHECK-IN TABLE (renaming from daily_updates to avoid conflict)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    status VARCHAR(50),
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, checkin_date)
);

CREATE INDEX IF NOT EXISTS daily_checkins_user_id_idx ON public.daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS daily_checkins_date_idx ON public.daily_checkins(checkin_date DESC);

-- =====================================================
-- USER SETTINGS TABLE (for diary activation, etc)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_settings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    study_diary_enabled BOOLEAN DEFAULT FALSE,
    uworld_diary_enabled BOOLEAN DEFAULT FALSE,
    current_exam_prep VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id)
);

CREATE INDEX IF NOT EXISTS user_settings_user_id_idx ON public.user_settings(user_id);

-- =====================================================
-- INSERT DEFAULT LANDMARKS
-- =====================================================

INSERT INTO public.default_landmarks (mentor_name, call_number, title, description, display_order, show_condition)
VALUES
    -- Entry milestone
    (NULL, NULL, 'Entrou na Ward Academy', 'Data de ingresso na Ward Academy', 0, 'always'),

    -- Dra Iria's calls
    ('Dra Iria', 1, '1ª Chamada com a Dra Iria', 'Conversa sobre background e USMLE', 1, 'always'),
    ('Dra Iria', 2, '2ª Chamada com a Dra Iria', 'Como usar o UWorld', 4, 'always'),
    ('Dra Iria', 3, '3ª Chamada com a Dra Iria', 'Conversa sobre como tem sido as primeiras semanas de estudo', 7, 'always'),
    ('Dra Iria', 4, '4ª Chamada com a Dra Iria', 'Conversa sobre o desempenho no blocão da Ward', 11, 'always'),
    ('Dra Iria', 5, '5ª Chamada com a Dra Iria', 'Acompanhamento de progresso', 17, 'always'),

    -- Guilherme's calls
    ('Guilherme', 1, '1ª Chamada com o Guilherme', 'Configurando o Anki', 2, 'always'),
    ('Guilherme', 2, '2ª Chamada com o Guilherme', 'Como tem sido o uso do Anki nas últimas semanas', 8, 'always'),

    -- Marcos' calls (general)
    ('Marcos', 1, '1ª Chamada com o Marcos', 'Organizando os próximos passos', 3, 'always'),

    -- Marcos' research calls (conditional)
    ('Marcos', 2, '2ª Chamada com o Marcos', 'Conversa sobre pesquisa', 5, 'wants_research'),
    ('Marcos', 3, '3ª Chamada com o Marcos', 'Como usar os databases corretamente', 9, 'wants_research'),
    ('Marcos', 4, '4ª Chamada com o Marcos', 'Validando uma ideia de revisão sistemática', 12, 'wants_research'),
    ('Marcos', 5, '5ª Chamada com o Marcos', 'Triagem por título e resumo', 13, 'wants_research'),
    ('Marcos', 6, '6ª Chamada com o Marcos', 'Triagem por manuscritos completos', 14, 'wants_research'),
    ('Marcos', 7, '7ª Chamada com o Marcos', 'Extração de dados', 15, 'wants_research'),
    ('Marcos', 8, '8ª Chamada com o Marcos', 'Risco de viés', 16, 'wants_research'),
    ('Marcos', 9, '9ª Chamada com o Marcos', 'Escrita científica', 18, 'wants_research'),
    ('Marcos', 10, '10ª Chamada com o Marcos', 'Submissão do manuscrito', 19, 'wants_research'),

    -- Milestones
    (NULL, NULL, 'Second Pass', 'Início do second pass', 20, 'always'),
    (NULL, NULL, 'Simulados (Self Assessments NBMEs)', 'Fase de simulados', 21, 'always'),
    (NULL, NULL, 'Dedicated', 'Período de dedicated', 22, 'always'),
    (NULL, NULL, 'Agendar a Prova', 'Prova agendada', 23, 'always'),
    (NULL, NULL, 'Chamada Pré-Prova', 'Preparação final antes da prova', 24, 'always'),
    (NULL, NULL, 'Chamada Pós-Prova', 'Debrief após a prova', 25, 'always')
ON CONFLICT DO NOTHING;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- Note: Simplified RLS for custom authentication
-- =====================================================

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.study_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.uworld_diary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.links_repository ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_project_collaborators ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_project_stages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmarks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.landmark_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_rows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.schedule_delays ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_settings ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- RLS POLICIES - PERMISSIVE FOR NOW
-- In production, you'll need to implement proper JWT-based auth
-- =====================================================

-- For now, allow all authenticated users to access their own data
-- This assumes you're using session-based auth in your application

CREATE POLICY allow_all_messages ON public.messages FOR ALL USING (true);
CREATE POLICY allow_all_study_diary ON public.study_diary FOR ALL USING (true);
CREATE POLICY allow_all_uworld_diary ON public.uworld_diary FOR ALL USING (true);
CREATE POLICY allow_all_links ON public.links_repository FOR ALL USING (true);
CREATE POLICY allow_all_blog_posts ON public.blog_posts FOR ALL USING (true);
CREATE POLICY allow_all_blog_comments ON public.blog_comments FOR ALL USING (true);
CREATE POLICY allow_all_blog_likes ON public.blog_likes FOR ALL USING (true);
CREATE POLICY allow_all_research_projects ON public.research_projects FOR ALL USING (true);
CREATE POLICY allow_all_research_collaborators ON public.research_project_collaborators FOR ALL USING (true);
CREATE POLICY allow_all_research_stages ON public.research_project_stages FOR ALL USING (true);
CREATE POLICY allow_all_landmarks ON public.landmarks FOR ALL USING (true);
CREATE POLICY allow_all_landmark_notes ON public.landmark_notes FOR ALL USING (true);
CREATE POLICY allow_all_schedules ON public.schedules FOR ALL USING (true);
CREATE POLICY allow_all_schedule_rows ON public.schedule_rows FOR ALL USING (true);
CREATE POLICY allow_all_schedule_delays ON public.schedule_delays FOR ALL USING (true);
CREATE POLICY allow_all_daily_checkins ON public.daily_checkins FOR ALL USING (true);
CREATE POLICY allow_all_user_settings ON public.user_settings FOR ALL USING (true);

-- =====================================================
-- GRANT PERMISSIONS
-- =====================================================

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres;
