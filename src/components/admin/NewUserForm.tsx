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

type FormValues = {
  user_name: string;
  password: string;
  user_type: 'admin' | 'bioquimica';
};

export const NewUserForm = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const form = useForm<FormValues>();
  const { user } = useAuth();

  // Check if user is authenticated and is admin
  if (!user || user.user_type !== 'admin') {
    return (
      <div className="text-red-500">
        No tienes permisos para crear usuarios. Debes ser administrador.
      </div>
    );
  }

  const { mutate: createUser, isPending } = useMutation({
    mutationFn: async (values: FormValues) => {
      console.log("Creating user with values:", values); // Debug log
      
      const { data, error } = await supabase
        .from('ieasalvay_usuarios')
        .insert([values])
        .select()
        .single();

      if (error) {
        console.error('Error details:', error); // Debug log
        throw error;
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
        description: "No se pudo crear el usuario. Por favor, intente nuevamente.",
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