import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://demo.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'demo-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper functions for database operations
export const db = {
  // Wizard profiles
  async getApprovedWizards(archetype = null) {
    let query = supabase
      .from('wizard_profiles')
      .select('*')
      .eq('status', 'approved');
    
    if (archetype) {
      query = query.eq('archetype', archetype);
    }
    
    return await query;
  },

  async getWizardById(id) {
    return await supabase
      .from('wizard_profiles')
      .select('*')
      .eq('id', id)
      .single();
  },

  // Quiz attempts
  async saveQuizAttempt(data) {
    return await supabase
      .from('quiz_attempts')
      .insert(data);
  },

  async saveSeekerProfile(data) {
    return await supabase
      .from('seeker_profiles')
      .insert(data);
  },

  // Academy progress
  async getAcademyProgress(userId) {
    return await supabase
      .from('academy_progress')
      .select('*')
      .eq('user_id', userId)
      .single();
  },

  async updateAcademyProgress(userId, data) {
    return await supabase
      .from('academy_progress')
      .upsert({ user_id: userId, ...data });
  }
};