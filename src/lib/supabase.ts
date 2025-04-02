
import { createClient } from '@supabase/supabase-js';

// Initialize the Supabase client
// In a real implementation, these would be environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anonymous Key not provided');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for our Supabase tables
export type QuestionnaireEntry = {
  id?: string;
  page: number;
  answers: Record<string, any>;
  contact_info?: Record<string, any>;
  is_submitted: boolean;
  created_at?: string;
  updated_at?: string;
  user_id?: string;
};

export async function saveQuestionnaireData(data: Partial<QuestionnaireEntry>): Promise<void> {
  try {
    // Get existing entry if any (based on user_id if available)
    let existingEntry = null;
    
    if (data.user_id) {
      const { data: existingData, error: fetchError } = await supabase
        .from('questionnaire_data')
        .select('*')
        .eq('user_id', data.user_id)
        .maybeSingle();
      
      if (fetchError) throw fetchError;
      existingEntry = existingData;
    }

    if (existingEntry) {
      // Update existing entry
      const { error: updateError } = await supabase
        .from('questionnaire_data')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', existingEntry.id);
      
      if (updateError) throw updateError;
    } else {
      // Create new entry
      const { error: insertError } = await supabase
        .from('questionnaire_data')
        .insert({
          ...data,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      
      if (insertError) throw insertError;
    }
    
    console.log('Questionnaire data saved successfully');
  } catch (error) {
    console.error('Error saving questionnaire data:', error);
    throw error;
  }
}
