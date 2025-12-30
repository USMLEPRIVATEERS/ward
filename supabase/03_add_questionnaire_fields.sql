-- ============================================
-- MIGRATION: Add missing questionnaire fields
-- ============================================

-- ============================================
-- ENGLISH PROFICIENCY - Add detailed questions
-- ============================================
ALTER TABLE public.english_proficiency
ADD COLUMN IF NOT EXISTS english_level VARCHAR(50),
ADD COLUMN IF NOT EXISTS oet_taken BOOLEAN,
ADD COLUMN IF NOT EXISTS oet_listening INTEGER,
ADD COLUMN IF NOT EXISTS oet_reading INTEGER,
ADD COLUMN IF NOT EXISTS oet_writing INTEGER,
ADD COLUMN IF NOT EXISTS oet_speaking INTEGER,
ADD COLUMN IF NOT EXISTS taking_classes BOOLEAN,
ADD COLUMN IF NOT EXISTS english_school VARCHAR(255),
-- Detailed questions
ADD COLUMN IF NOT EXISTS understands_uworld BOOLEAN,
ADD COLUMN IF NOT EXISTS needs_translation BOOLEAN,
ADD COLUMN IF NOT EXISTS understands_lectures BOOLEAN,
ADD COLUMN IF NOT EXISTS listening_difficulty BOOLEAN,
ADD COLUMN IF NOT EXISTS frequent_word_lookup BOOLEAN;

-- ============================================
-- ANKI INFO - Add missing fields
-- ============================================
ALTER TABLE public.anki_info
ADD COLUMN IF NOT EXISTS usage_frequency VARCHAR(50), -- todos os dias, dia sim dia não, poucas vezes na semana, quase não usa
ADD COLUMN IF NOT EXISTS creates_own_cards VARCHAR(50), -- sim, não, não uso apenas o anking
ADD COLUMN IF NOT EXISTS devices_used TEXT[], -- array: computador, mac, iphone, telefone, tablet, ipad
ADD COLUMN IF NOT EXISTS primary_device VARCHAR(50),
ADD COLUMN IF NOT EXISTS using_since DATE;

-- ============================================
-- RESEARCH EXPERIENCE - Add comprehensive fields
-- ============================================

-- First, let's check if we need to modify the research_experience table
ALTER TABLE public.research_experience
ADD COLUMN IF NOT EXISTS orcid_confirmed VARCHAR(50),
ADD COLUMN IF NOT EXISTS email_confirmed VARCHAR(255),
ADD COLUMN IF NOT EXISTS full_name_confirmed VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_institution_confirmed VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_specialty_confirmed VARCHAR(255),
ADD COLUMN IF NOT EXISTS current_department VARCHAR(255),

-- Experience level (detailed)
ADD COLUMN IF NOT EXISTS experience_level VARCHAR(100), -- nenhuma, projetos_nao_concluidos, apresentados_congresso, publicacoes_nao_indexadas, publicacoes_pubmed

-- Systematic review participation
ADD COLUMN IF NOT EXISTS participated_systematic_review BOOLEAN,
ADD COLUMN IF NOT EXISTS systematic_review_role VARCHAR(50), -- pontual, primeiro_autor, outro
ADD COLUMN IF NOT EXISTS systematic_review_status VARCHAR(50), -- publicada_indexada, nao_indexada, apresentada_congresso, em_producao, abandonada

-- Research interests (5 areas)
ADD COLUMN IF NOT EXISTS research_area_1 TEXT,
ADD COLUMN IF NOT EXISTS research_area_2 TEXT,
ADD COLUMN IF NOT EXISTS research_area_3 TEXT,
ADD COLUMN IF NOT EXISTS research_area_4 TEXT,
ADD COLUMN IF NOT EXISTS research_area_5 TEXT,

-- Institutions for networking (3)
ADD COLUMN IF NOT EXISTS target_institution_1 VARCHAR(255),
ADD COLUMN IF NOT EXISTS target_institution_2 VARCHAR(255),
ADD COLUMN IF NOT EXISTS target_institution_3 VARCHAR(255),

-- Ward Academy research timeline
ADD COLUMN IF NOT EXISTS ward_research_timing VARCHAR(50), -- imediatamente, depois_usmle, nao_suficiente

-- Collaboration capabilities
ADD COLUMN IF NOT EXISTS collaboration_stages TEXT; -- free text field

-- ============================================
-- CLINICAL ROTATIONS - Add comprehensive fields for observerships
-- ============================================
ALTER TABLE public.clinical_rotations
ADD COLUMN IF NOT EXISTS did_clerkship_usa BOOLEAN,
ADD COLUMN IF NOT EXISTS clerkship_details TEXT,
ADD COLUMN IF NOT EXISTS year INTEGER,
ADD COLUMN IF NOT EXISTS specialty VARCHAR(255),
ADD COLUMN IF NOT EXISTS is_private_clinic BOOLEAN,
ADD COLUMN IF NOT EXISTS cost_approximate DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS got_recommendation_letter BOOLEAN,
ADD COLUMN IF NOT EXISTS observership_comments TEXT,

-- Future observerships
ADD COLUMN IF NOT EXISTS plans_more_observerships BOOLEAN,
ADD COLUMN IF NOT EXISTS planned_count INTEGER,
ADD COLUMN IF NOT EXISTS planned_when TEXT,
ADD COLUMN IF NOT EXISTS planned_institutions TEXT,
ADD COLUMN IF NOT EXISTS planned_specialties TEXT,
ADD COLUMN IF NOT EXISTS planned_private_clinic BOOLEAN;

-- ============================================
-- PERSONAL BACKGROUND - Add location-based conditional questions
-- ============================================
ALTER TABLE public.personal_background
ADD COLUMN IF NOT EXISTS current_location VARCHAR(50), -- brasil, eua, outro
ADD COLUMN IF NOT EXISTS location_other VARCHAR(255),

-- For Brazil/Other location
ADD COLUMN IF NOT EXISTS life_story TEXT,
ADD COLUMN IF NOT EXISTS family_situation TEXT,
ADD COLUMN IF NOT EXISTS work_situation TEXT,
ADD COLUMN IF NOT EXISTS why_usmle TEXT,
ADD COLUMN IF NOT EXISTS family_agreement BOOLEAN,

-- For USA location
ADD COLUMN IF NOT EXISTS how_moved_to_usa TEXT,
ADD COLUMN IF NOT EXISTS visa_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS how_got_visa TEXT,
ADD COLUMN IF NOT EXISTS works_in_usa BOOLEAN,
ADD COLUMN IF NOT EXISTS how_got_job TEXT;

COMMENT ON COLUMN public.english_proficiency.understands_uworld IS 'Consegue ler e entender as questões do UWorld sem traduzir?';
COMMENT ON COLUMN public.english_proficiency.needs_translation IS 'Está traduzindo o UWorld?';
COMMENT ON COLUMN public.english_proficiency.understands_lectures IS 'Consegue entender aulas do Boards and Beyond e outros cursos?';
COMMENT ON COLUMN public.english_proficiency.listening_difficulty IS 'Tem dificuldade com escuta em inglês?';
COMMENT ON COLUMN public.english_proficiency.frequent_word_lookup IS 'Precisa frequentemente pesquisar por palavras?';

COMMENT ON COLUMN public.anki_info.usage_frequency IS 'Frequência: todos os dias, dia sim dia não, poucas vezes na semana, quase não usa';
COMMENT ON COLUMN public.anki_info.creates_own_cards IS 'Cria seus próprios flashcards: sim, não, não uso apenas o anking';
COMMENT ON COLUMN public.anki_info.devices_used IS 'Dispositivos: computador, mac, iphone, telefone, tablet, ipad';
COMMENT ON COLUMN public.anki_info.primary_device IS 'Qual dispositivo usa com mais frequência';

COMMENT ON COLUMN public.research_experience.experience_level IS 'Nível: nenhuma, projetos_nao_concluidos, apresentados_congresso, publicacoes_nao_indexadas, publicacoes_pubmed';
COMMENT ON COLUMN public.research_experience.ward_research_timing IS 'Quando: imediatamente, depois_usmle, nao_suficiente';

COMMENT ON COLUMN public.personal_background.current_location IS 'Onde mora: brasil, eua, outro';
