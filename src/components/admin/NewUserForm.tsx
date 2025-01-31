import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const formSchema = z.object({
  user_name: z.string().min(1, "El nombre de usuario es requerido"),
  password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
  user_type: z.enum(["admin", "bioquimica"] as const),
});

type FormValues = z.infer<typeof formSchema>;

export const NewUserForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      user_name: "",
      password: "",
      user_type: undefined,
    },
  });

  // Check if user is authenticated and is admin
  if (!user) {
    return (
      <div className="text-red-500">
        Debes iniciar sesión para crear usuarios.
      </div>
    );
  }

  if (user.user_type !== 'admin') {
    return (
      <div className="text-red-500">
        No tienes permisos para crear usuarios. Debes ser administrador.
      </div>
    );
  }

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Creating user with values:", values);
      
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

      const { data, error } = await supabase
        .from('ieasalvay_usuarios')
        .insert([{
          user_name: values.user_name,
          password: values.password,
          user_type: values.user_type,
        }])
        .select()
        .maybeSingle();

      if (error) {
        console.error('Error creating user:', error);
        throw error;
      }

      if (!data) {
        throw new Error('No se pudo crear el usuario');
      }

      return data;
    },
    onSuccess: () => {
      toast({
        title: "Usuario creado",
        description: "El usuario ha sido creado exitosamente.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      console.error('Error creating user:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "No se pudo crear el usuario. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => createUser(data))} className="space-y-4">
        <FormField
          control={form.control}
          name="user_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de Usuario</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Contraseña</FormLabel>
              <FormControl>
                <Input type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="user_type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Usuario</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione el tipo de usuario" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="admin">Administrador</SelectItem>
                  <SelectItem value="bioquimica">Bioquímica</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Creando..." : "Crear Usuario"}
        </Button>
      </form>
    </Form>
  );
};