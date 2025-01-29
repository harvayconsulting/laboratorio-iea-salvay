import { supabase } from '@/integrations/supabase/client';

export type UserType = 'admin' | 'bioquimica';

export interface User {
  user_id: string;
  user_name: string;
  user_type: UserType;
}

export interface Receso {
  id: string;
  user_id: string;
  start_date: string;
  end_date: string;
  comments?: string;
  created_date: string;
  user?: {
    user_id: string;
    user_name: string;
    user_type: UserType;
  };
}

export const getUser = async (username: string, password: string) => {
  const { data, error } = await supabase
    .from('ieasalvay_usuarios')
    .select('*')
    .eq('user_name', username)
    .eq('password', password)
    .single();

  if (error) throw error;
  return data as User;
};

export const getRecesos = async () => {
  const { data, error } = await supabase
    .from('ieasalvay_recesos')
    .select(`
      *,
      user:user_id (
        user_id,
        user_name,
        user_type
      )
    `)
    .order('created_date', { ascending: false })
    .limit(100);

  if (error) {
    console.error('Error fetching recesos:', error);
    throw error;
  }
  return data as Receso[];
};

export const createReceso = async (receso: Omit<Receso, 'id' | 'created_date'>) => {
  console.log('Creating receso with data:', receso);
  const { data, error } = await supabase
    .from('ieasalvay_recesos')
    .insert([receso]);

  if (error) {
    console.error('Error creating receso:', error);
    throw error;
  }

  // Fetch the created record to return it with all its data
  const { data: createdReceso, error: fetchError } = await supabase
    .from('ieasalvay_recesos')
    .select(`
      *,
      user:user_id (
        user_id,
        user_name,
        user_type
      )
    `)
    .eq('user_id', receso.user_id)
    .order('created_date', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (fetchError) {
    console.error('Error fetching created receso:', fetchError);
    throw fetchError;
  }

  if (!createdReceso) {
    throw new Error('No se pudo crear el receso');
  }

  return createdReceso;
};

export const updateReceso = async (id: string, updates: Partial<Omit<Receso, 'id' | 'created_date' | 'user'>>) => {
  const { data, error } = await supabase
    .from('ieasalvay_recesos')
    .update(updates)
    .eq('id', id)
    .select()
    .maybeSingle();

  if (error) {
    console.error('Error updating receso:', error);
    throw error;
  }
  
  if (!data) {
    throw new Error('No se encontró el receso especificado');
  }
  
  return data as Receso;
};

export const deleteReceso = async (id: string) => {
  const { error } = await supabase
    .from('ieasalvay_recesos')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting receso:', error);
    throw error;
  }
};