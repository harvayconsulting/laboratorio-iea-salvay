
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCustomToast } from "./useCustomToast";

export type NewUserData = {
  user_name: string;
  password: string;
  user_type: "admin" | "bioquimica";
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const { showToast } = useCustomToast();

  return useMutation({
    mutationFn: async (values: NewUserData) => {
      if (!user?.user_id) {
        throw new Error('Debes iniciar sesión para crear usuarios.');
      }

      const { data: currentUser, error: verifyError } = await supabase
        .from('ieasalvay_usuarios')
        .select('user_type')
        .eq('user_id', user.user_id)
        .single();

      if (verifyError) {
        throw new Error('Error al verificar permisos de administrador');
      }

      if (currentUser?.user_type !== 'admin') {
        throw new Error('Solo los administradores pueden crear usuarios');
      }

      const { data: existingUser, error: checkError } = await supabase
        .from('ieasalvay_usuarios')
        .select('user_name')
        .eq('user_name', values.user_name)
        .maybeSingle();

      if (checkError) {
        throw new Error('Error al verificar el nombre de usuario');
      }

      if (existingUser) {
        throw new Error('El nombre de usuario ya existe');
      }

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
        throw new Error('Error al crear el usuario: ' + error.message);
      }

      return data;
    },
    onSuccess: () => {
      showToast(
        'Usuario creado',
        'El usuario ha sido creado exitosamente',
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      showToast(
        'Error',
        error.message || 'No se pudo crear el usuario',
        'error'
      );
    },
  });
};
