import { supabase } from "@/integrations/supabase/client";

interface ErrorLog {
  message: string;
  stack?: string;
  timestamp: string;
  userId?: string;
  component?: string;
  action?: string;
}

export const logError = async (error: Error, additionalInfo?: {
  userId?: string;
  component?: string;
  action?: string;
}) => {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    ...additionalInfo
  };

  console.error('Error logged:', errorLog);

  try {
    const { data, error: uploadError } = await supabase
      .from('error_logs')
      .insert([errorLog]);

    if (uploadError) {
      console.error('Error saving log to Supabase:', uploadError);
    }
  } catch (dbError) {
    console.error('Failed to save error log:', dbError);
  }
};