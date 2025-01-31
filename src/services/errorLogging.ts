import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

type ErrorLog = Database['public']['Tables']['error_logs']['Insert']

export const logError = async (error: Error, additionalInfo?: {
  userId?: string;
  component?: string;
  action?: string;
}) => {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    user_id: additionalInfo?.userId,
    component: additionalInfo?.component,
    action: additionalInfo?.action
  };

  console.error('Error logged:', errorLog);

  try {
    const { error: uploadError } = await supabase
      .from('error_logs')
      .insert(errorLog);

    if (uploadError) {
      console.error('Error saving log to Supabase:', uploadError);
    }
  } catch (dbError) {
    console.error('Failed to save error log:', dbError);
  }
};