import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";

export type NewUserData = {
  user_name: string;
  password: string;
  user_type: "admin" | "bioquimica";
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: NewUserData) => {
      if (!user?.user_id) {
        throw new Error('Debes iniciar sesión para crear usuarios.');
      }

      // First verify if the current user is an admin
      const { data: currentUser, error: verifyError } = await supabase
        .from('ieasalvay_usuarios')
        .select('user_type')
        .eq('user_id', user.user_id)
        .single();

      if (verifyError) {
        console.error('Error verificando permisos:', verifyError);
        throw new Error('Error al verificar permisos de administrador');
      }

      if (currentUser?.user_type !== 'admin') {
        throw new Error('Solo los administradores pueden crear usuarios');
      }

      // Check if username already exists
      const { data: existingUser, error: checkError } = await supabase
        .from('ieasalvay_usuarios')
        .select('user_name')
        .eq('user_name', values.user_name)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing user:', checkError);
        throw new Error('Error al verificar el nombre de usuario');
      }

      if (existingUser) {
        throw new Error('El nombre de usuario ya existe');
      }

      // Create new user
      const { data, error } = await supabase
        .from('ieasalvay_usuarios')
        .insert([{
          user_name: values.user_name,
          password: values.password,
          user_type: values.user_type,
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        throw new Error('Error al crear el usuario: ' + error.message);
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
  });
};