
import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types for our Supabase tables
export type QuestionnaireEntry = {
  id?: number; // Changed from string to number to match Supabase schema
  page: number; // Made this required because the database requires it
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

    // Make sure page is always set
    if (!data.page && data.page !== 0) {
      console.error('Page number is required');
      throw new Error('Page number is required');
    }

    if (existingEntry) {
      // Update existing entry
      // We don't include id in the update data
      const updateData = {
        ...data,
        updated_at: new Date().toISOString()
      };
      
      // Remove id from update data (it's a number in DB but might be string in our code)
      delete updateData.id;
      
      const { error: updateError } = await supabase
        .from('questionnaire_data')
        .update(updateData)
        .eq('id', existingEntry.id);
      
      if (updateError) throw updateError;
      console.log('Updated existing questionnaire entry');
    } else {
      // Create new entry
      const insertData = {
        ...data,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Remove any undefined id when inserting
      if (insertData.id === undefined) {
        delete insertData.id;
      }
      
      const { error: insertError } = await supabase
        .from('questionnaire_data')
        .insert(insertData);
      
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
