
import { supabase } from '@/integrations/supabase/client';

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
    console.log('Saving questionnaire data:', data);
    
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
      console.log('Updated existing questionnaire entry');
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
      console.log('Created new questionnaire entry');
    }
  } catch (error) {
    console.error('Error saving questionnaire data:', error);
    throw error;
  }
}

// Function to check if a user exists in registration_data by email or phone
export async function checkUserExists(email?: string, phone?: string): Promise<string | null> {
  try {
    if (!email && !phone) return null;
    
    const query = supabase.from('registration_data').select('user_id');
    
    if (email) {
      query.eq('email', email);
    } else if (phone) {
      query.eq('phone', phone);
    }
    
    const { data, error } = await query.maybeSingle();
    
    if (error) throw error;
    
    return data ? data.user_id : null;
  } catch (error) {
    console.error('Error checking user existence:', error);
    return null;
  }
}
