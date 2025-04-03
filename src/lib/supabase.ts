import { supabase } from '@/integrations/supabase/client';
import { Database } from '@/integrations/supabase/types';

// Types for our Supabase tables
export type QuestionnaireEntry = {
  id?: number; 
  page: number; 
  answers: Record<string, any>;
  contact_info?: Record<string, any>;
  is_submitted: boolean;
  created_at?: string;
  updated_at?: string;
  user_id: string; 
};

export async function saveQuestionnaireData(data: Partial<QuestionnaireEntry>): Promise<void> {
  try {
    console.log('Saving questionnaire data:', data);
    
    // First, ensure the user exists in the registration_data table
    // This fixes the foreign key constraint error
    if (data.user_id) {
      const { data: existingUser } = await supabase
        .from('registration_data')
        .select('user_id')
        .eq('user_id', data.user_id)
        .maybeSingle();
      
      if (!existingUser) {
        // Create the user in registration_data if they don't exist
        const { error: insertUserError } = await supabase
          .from('registration_data')
          .insert({
            user_id: data.user_id,
            created_at: new Date().toISOString()
          });
        
        if (insertUserError) {
          console.error('Error creating user in registration_data:', insertUserError);
          // Continue anyway - we'll show the error but still attempt to save
        }
      }
    }
    
    // Make sure page is always set
    if (!data.page && data.page !== 0) {
      data.page = 1; // Default to page 1 instead of throwing error
      console.log('Page number defaulted to 1');
    }

    // Make sure user_id is always set
    if (!data.user_id) {
      console.error('User ID is required');
      throw new Error('User ID is required');
    }

    // Always create a new entry for the page's data
    // This allows multiple entries per user+page
    const insertData = {
      ...data,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      page: data.page, 
      user_id: data.user_id
    };
    
    // Remove any undefined id when inserting
    if (insertData.id === undefined) {
      delete insertData.id;
    }
    
    const { error: insertError } = await supabase
      .from('questionnaire_data')
      .insert(insertData);
    
    if (insertError) {
      console.error('Error creating questionnaire entry:', insertError);
    } else {
      console.log('Created new questionnaire entry for page', data.page);
    }
  } catch (error) {
    console.error('Error saving questionnaire data:', error);
    // Don't throw the error so the flow can continue
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
