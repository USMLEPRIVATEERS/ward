-- =====================================================
-- Ward Academy Platform Tables
-- Migration 04: Core platform functionality
-- =====================================================

-- Add role to users table
ALTER TABLE public.users
ADD COLUMN IF NOT EXISTS role VARCHAR(50) DEFAULT 'student';

-- Valid roles: 'student', 'marcos', 'iria', 'guilherme', 'romulo'
-- Marcos: Full admin access
-- Iria: Mentor focused on USMLE guidance
-- Guilherme: Mentor focused on Anki
-- Romulo: Mentor focused on research

-- =====================================================
-- MESSAGES TABLE
-- Mentors can leave messages for students
-- =====================================================
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- STUDY DIARY TABLE
-- Students can log daily study activities
-- =====================================================
CREATE TABLE IF NOT EXISTS public.study_diary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- Students can log UWorld practice sessions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.uworld_diary (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- Shared links for resources
-- =====================================================
CREATE TABLE IF NOT EXISTS public.links_repository (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    description TEXT,
    category VARCHAR(50) NOT NULL, -- step1, step2ck, step3, oet, pesquisa
    added_by UUID REFERENCES public.users(id),
    added_by_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS links_category_idx ON public.links_repository(category);
CREATE INDEX IF NOT EXISTS links_created_at_idx ON public.links_repository(created_at DESC);

-- =====================================================
-- BLOG POSTS TABLE
-- Community blog for students and mentors
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- Comments on blog posts
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_comments (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS blog_comments_post_id_idx ON public.blog_comments(post_id);

-- =====================================================
-- BLOG LIKES TABLE
-- Track who liked/disliked posts
-- =====================================================
CREATE TABLE IF NOT EXISTS public.blog_likes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    post_id UUID NOT NULL REFERENCES public.blog_posts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    is_like BOOLEAN NOT NULL, -- true = like, false = dislike
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(post_id, user_id)
);

CREATE INDEX IF NOT EXISTS blog_likes_post_id_idx ON public.blog_likes(post_id);

-- =====================================================
-- RESEARCH PROJECTS TABLE
-- Track systematic reviews and research projects
-- =====================================================
CREATE TABLE IF NOT EXISTS public.research_projects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    meta_analysis_type VARCHAR(50), -- single_arm, double_arm, network, none
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
-- Multiple students can collaborate on a research project
-- =====================================================
CREATE TABLE IF NOT EXISTS public.research_project_collaborators (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    user_name VARCHAR(255) NOT NULL,
    role VARCHAR(100), -- first_author, co_author, etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(project_id, user_id)
);

CREATE INDEX IF NOT EXISTS research_collaborators_project_id_idx ON public.research_project_collaborators(project_id);
CREATE INDEX IF NOT EXISTS research_collaborators_user_id_idx ON public.research_project_collaborators(user_id);

-- =====================================================
-- RESEARCH PROJECT STAGES TABLE
-- Track completion of research stages
-- =====================================================
CREATE TABLE IF NOT EXISTS public.research_project_stages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.research_projects(id) ON DELETE CASCADE,
    stage_name VARCHAR(255) NOT NULL,
    stage_order INTEGER NOT NULL,
    is_completed BOOLEAN DEFAULT FALSE,
    authors_involved TEXT, -- comma-separated names
    completed_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS research_stages_project_id_idx ON public.research_project_stages(project_id);

-- =====================================================
-- DEFAULT LANDMARKS TABLE
-- Template for landmarks that get created for each new user
-- =====================================================
CREATE TABLE IF NOT EXISTS public.default_landmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landmark_type VARCHAR(50) NOT NULL, -- call, milestone, etc.
    mentor_name VARCHAR(100), -- 'Dra Iria', 'Marcos', 'Guilherme'
    call_number INTEGER,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    display_order INTEGER NOT NULL,
    show_condition VARCHAR(100), -- e.g., 'wants_research', 'always'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- LANDMARKS TABLE
-- User-specific milestones and calls
-- =====================================================
CREATE TABLE IF NOT EXISTS public.landmarks (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- Both mentors and students can add notes to landmarks
-- =====================================================
CREATE TABLE IF NOT EXISTS public.landmark_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    landmark_id UUID NOT NULL REFERENCES public.landmarks(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id),
    user_name VARCHAR(255) NOT NULL,
    note_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS landmark_notes_landmark_id_idx ON public.landmark_notes(landmark_id);

-- =====================================================
-- SCHEDULES TABLE
-- Student study schedules (cronogramas)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schedules (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- Individual rows in a schedule
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schedule_rows (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
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
-- Track when students report delays in their schedule
-- =====================================================
CREATE TABLE IF NOT EXISTS public.schedule_delays (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    schedule_id UUID NOT NULL REFERENCES public.schedules(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.users(id),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS schedule_delays_schedule_id_idx ON public.schedule_delays(schedule_id);

-- =====================================================
-- DAILY CHECK-IN TABLE
-- Modal window responses when students open the platform
-- =====================================================
CREATE TABLE IF NOT EXISTS public.daily_checkins (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    checkin_date DATE NOT NULL,
    status VARCHAR(50), -- 'tranquilo', 'preciso_ajuda', 'parado'
    comments TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, checkin_date)
);

CREATE INDEX IF NOT EXISTS daily_checkins_user_id_idx ON public.daily_checkins(user_id);
CREATE INDEX IF NOT EXISTS daily_checkins_date_idx ON public.daily_checkins(checkin_date DESC);

-- =====================================================
-- INSERT DEFAULT LANDMARKS
-- These will be copied to each new user after questionnaire completion
-- =====================================================

-- First, check if default landmarks exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM public.default_landmarks) THEN
        -- Dra Iria's calls
        INSERT INTO public.default_landmarks (mentor_name, call_number, title, description, display_order, show_condition) VALUES
        ('Dra Iria', 1, '1ª Chamada com a Dra Iria', 'Conversa sobre background e USMLE', 1, 'always'),
        ('Dra Iria', 2, '2ª Chamada com a Dra Iria', 'Como usar o UWorld', 4, 'always'),
        ('Dra Iria', 3, '3ª Chamada com a Dra Iria', 'Conversa sobre como tem sido as primeiras semanas de estudo', 7, 'always'),
        ('Dra Iria', 4, '4ª Chamada com a Dra Iria', 'Conversa sobre o desempenho no blocão da Ward', 11, 'always'),
        ('Dra Iria', 5, '5ª Chamada com a Dra Iria', 'Acompanhamento de progresso', 17, 'always');

        -- Guilherme's calls
        INSERT INTO public.default_landmarks (mentor_name, call_number, title, description, display_order, show_condition) VALUES
        ('Guilherme', 1, '1ª Chamada com o Guilherme', 'Configurando o Anki', 2, 'always'),
        ('Guilherme', 2, '2ª Chamada com o Guilherme', 'Como tem sido o uso do Anki nas últimas semanas', 8, 'always');

        -- Marcos' calls (general)
        INSERT INTO public.default_landmarks (mentor_name, call_number, title, description, display_order, show_condition) VALUES
        ('Marcos', 1, '1ª Chamada com o Marcos', 'Organizando os próximos passos', 3, 'always');

        -- Marcos' research calls (conditional)
        INSERT INTO public.default_landmarks (mentor_name, call_number, title, description, display_order, show_condition) VALUES
        ('Marcos', 2, '2ª Chamada com o Marcos', 'Conversa sobre pesquisa', 5, 'wants_research'),
        ('Marcos', 3, '3ª Chamada com o Marcos', 'Como usar os databases corretamente', 9, 'wants_research'),
        ('Marcos', 4, '4ª Chamada com o Marcos', 'Validando uma ideia de revisão sistemática', 12, 'wants_research'),
        ('Marcos', 5, '5ª Chamada com o Marcos', 'Triagem por título e resumo', 13, 'wants_research'),
        ('Marcos', 6, '6ª Chamada com o Marcos', 'Triagem por manuscritos completos', 14, 'wants_research'),
        ('Marcos', 7, '7ª Chamada com o Marcos', 'Extração de dados', 15, 'wants_research'),
        ('Marcos', 8, '8ª Chamada com o Marcos', 'Risco de viés', 16, 'wants_research'),
        ('Marcos', 9, '9ª Chamada com o Marcos', 'Escrita científica', 18, 'wants_research'),
        ('Marcos', 10, '10ª Chamada com o Marcos', 'Submissão do manuscrito', 19, 'wants_research');

        -- Milestones
        INSERT INTO public.default_landmarks (mentor_name, title, description, display_order, show_condition) VALUES
        (NULL, 'Entrou na Ward Academy', 'Data de ingresso na Ward Academy', 0, 'always'),
        (NULL, 'Second Pass', 'Início do second pass', 20, 'always'),
        (NULL, 'Simulados (Self Assessments NBMEs)', 'Fase de simulados', 21, 'always'),
        (NULL, 'Dedicated', 'Período de dedicated', 22, 'always'),
        (NULL, 'Agendar a Prova', 'Prova agendada', 23, 'always'),
        (NULL, 'Chamada Pré-Prova', 'Preparação final antes da prova', 24, 'always'),
        (NULL, 'Chamada Pós-Prova', 'Debrief após a prova', 25, 'always');
    END IF;
END $$;

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
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

-- =====================================================
-- RLS POLICIES
-- Students can see their own data
-- Mentors can see all data
-- =====================================================

-- Helper function to check if user is a mentor
CREATE OR REPLACE FUNCTION public.is_mentor(user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
    user_role VARCHAR(50);
BEGIN
    SELECT role INTO user_role FROM public.users WHERE id = user_id;
    RETURN user_role IN ('marcos', 'iria', 'guilherme', 'romulo');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Messages policies
CREATE POLICY messages_select_policy ON public.messages FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY messages_insert_policy ON public.messages FOR INSERT WITH CHECK (
    public.is_mentor(auth.uid())
);

CREATE POLICY messages_update_policy ON public.messages FOR UPDATE USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY messages_delete_policy ON public.messages FOR DELETE USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

-- Study diary policies
CREATE POLICY study_diary_select_policy ON public.study_diary FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY study_diary_insert_policy ON public.study_diary FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY study_diary_update_policy ON public.study_diary FOR UPDATE USING (
    user_id = auth.uid()
);

CREATE POLICY study_diary_delete_policy ON public.study_diary FOR DELETE USING (
    user_id = auth.uid()
);

-- UWorld diary policies
CREATE POLICY uworld_diary_select_policy ON public.uworld_diary FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY uworld_diary_insert_policy ON public.uworld_diary FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY uworld_diary_update_policy ON public.uworld_diary FOR UPDATE USING (
    user_id = auth.uid()
);

CREATE POLICY uworld_diary_delete_policy ON public.uworld_diary FOR DELETE USING (
    user_id = auth.uid()
);

-- Links repository policies (all can see, mentors and students can add)
CREATE POLICY links_select_policy ON public.links_repository FOR SELECT USING (true);

CREATE POLICY links_insert_policy ON public.links_repository FOR INSERT WITH CHECK (true);

CREATE POLICY links_update_policy ON public.links_repository FOR UPDATE USING (
    public.is_mentor(auth.uid())
);

CREATE POLICY links_delete_policy ON public.links_repository FOR DELETE USING (
    public.is_mentor(auth.uid())
);

-- Blog posts policies (all can see and create)
CREATE POLICY blog_posts_select_policy ON public.blog_posts FOR SELECT USING (true);

CREATE POLICY blog_posts_insert_policy ON public.blog_posts FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY blog_posts_update_policy ON public.blog_posts FOR UPDATE USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY blog_posts_delete_policy ON public.blog_posts FOR DELETE USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

-- Blog comments policies
CREATE POLICY blog_comments_select_policy ON public.blog_comments FOR SELECT USING (true);

CREATE POLICY blog_comments_insert_policy ON public.blog_comments FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Blog likes policies
CREATE POLICY blog_likes_select_policy ON public.blog_likes FOR SELECT USING (true);

CREATE POLICY blog_likes_insert_policy ON public.blog_likes FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY blog_likes_update_policy ON public.blog_likes FOR UPDATE USING (
    user_id = auth.uid()
);

CREATE POLICY blog_likes_delete_policy ON public.blog_likes FOR DELETE USING (
    user_id = auth.uid()
);

-- Research projects policies
CREATE POLICY research_projects_select_policy ON public.research_projects FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.research_project_collaborators
        WHERE project_id = research_projects.id AND user_id = auth.uid()
    ) OR public.is_mentor(auth.uid())
);

CREATE POLICY research_projects_insert_policy ON public.research_projects FOR INSERT WITH CHECK (
    public.is_mentor(auth.uid())
);

CREATE POLICY research_projects_update_policy ON public.research_projects FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.research_project_collaborators
        WHERE project_id = research_projects.id AND user_id = auth.uid()
    ) OR public.is_mentor(auth.uid())
);

-- Research collaborators policies
CREATE POLICY research_collaborators_select_policy ON public.research_project_collaborators FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY research_collaborators_insert_policy ON public.research_project_collaborators FOR INSERT WITH CHECK (
    public.is_mentor(auth.uid())
);

-- Research stages policies
CREATE POLICY research_stages_select_policy ON public.research_project_stages FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.research_project_collaborators
        WHERE project_id = research_project_stages.project_id AND user_id = auth.uid()
    ) OR public.is_mentor(auth.uid())
);

CREATE POLICY research_stages_update_policy ON public.research_project_stages FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.research_project_collaborators
        WHERE project_id = research_project_stages.project_id AND user_id = auth.uid()
    ) OR public.is_mentor(auth.uid())
);

-- Landmarks policies
CREATE POLICY landmarks_select_policy ON public.landmarks FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY landmarks_update_policy ON public.landmarks FOR UPDATE USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

-- Landmark notes policies
CREATE POLICY landmark_notes_select_policy ON public.landmark_notes FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.landmarks
        WHERE landmarks.id = landmark_notes.landmark_id
        AND (landmarks.user_id = auth.uid() OR public.is_mentor(auth.uid()))
    )
);

CREATE POLICY landmark_notes_insert_policy ON public.landmark_notes FOR INSERT WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.landmarks
        WHERE landmarks.id = landmark_notes.landmark_id
        AND (landmarks.user_id = auth.uid() OR public.is_mentor(auth.uid()))
    )
);

-- Schedules policies
CREATE POLICY schedules_select_policy ON public.schedules FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY schedules_insert_policy ON public.schedules FOR INSERT WITH CHECK (
    public.is_mentor(auth.uid())
);

CREATE POLICY schedules_update_policy ON public.schedules FOR UPDATE USING (
    public.is_mentor(auth.uid())
);

-- Schedule rows policies
CREATE POLICY schedule_rows_select_policy ON public.schedule_rows FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM public.schedules
        WHERE schedules.id = schedule_rows.schedule_id
        AND (schedules.user_id = auth.uid() OR public.is_mentor(auth.uid()))
    )
);

CREATE POLICY schedule_rows_update_policy ON public.schedule_rows FOR UPDATE USING (
    EXISTS (
        SELECT 1 FROM public.schedules
        WHERE schedules.id = schedule_rows.schedule_id
        AND (schedules.user_id = auth.uid() OR public.is_mentor(auth.uid()))
    )
);

-- Schedule delays policies
CREATE POLICY schedule_delays_select_policy ON public.schedule_delays FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY schedule_delays_insert_policy ON public.schedule_delays FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

-- Daily check-ins policies
CREATE POLICY daily_checkins_select_policy ON public.daily_checkins FOR SELECT USING (
    user_id = auth.uid() OR public.is_mentor(auth.uid())
);

CREATE POLICY daily_checkins_insert_policy ON public.daily_checkins FOR INSERT WITH CHECK (
    user_id = auth.uid()
);

CREATE POLICY daily_checkins_update_policy ON public.daily_checkins FOR UPDATE USING (
    user_id = auth.uid()
);
