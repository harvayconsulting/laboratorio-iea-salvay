import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";

export type NewUserData = {
  user_name: string;
  password: string;
  user_type: "admin" | "bioquimica";
};

export const useCreateUser = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  return useMutation({
    mutationFn: async (values: NewUserData) => {
      // First verify if current user is admin
      if (!user || user.user_type !== 'admin') {
        throw new Error('No tienes permisos para crear usuarios. Debes ser administrador.');
      }

      // Check if username already exists
      const { data: existingUser } = await supabase
        .from('ieasalvay_usuarios')
        .select('user_name')
        .eq('user_name', values.user_name)
        .maybeSingle();

      if (existingUser) {
        throw new Error('El nombre de usuario ya existe');
      }

      // Create new user
      const { data, error } = await supabase
        .from('ieasalvay_usuarios')
        .insert([values])
        .select()
        .single();

      if (error) {
        console.error('Error creating user:', error);
        if (error.code === '42501') {
          throw new Error('No tienes permisos para crear usuarios');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};