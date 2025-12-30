/* ============================================================================
   WARD ACADEMY - SUPABASE CONFIGURATION
   ============================================================================ */

// Supabase credentials
const SUPABASE_URL = 'https://lbxjqejzabylfqdoknhh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxieGpxZWp6YWJ5bGZxZG9rbmhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjcxMDEzMDEsImV4cCI6MjA4MjY3NzMwMX0.bbtQiSh87-DNZc_PGlZwPZR4_o3IveWLV_RooSO4luA';

// Initialize Supabase client
let supabase;

function initSupabase() {
    if (!supabase) {
        supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
    return supabase;
}

// Initialize on load
document.addEventListener('DOMContentLoaded', () => {
    initSupabase();
});
