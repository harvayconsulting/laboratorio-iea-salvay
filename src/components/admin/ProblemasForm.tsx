
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCustomToast } from "@/hooks/useCustomToast";

const problemaSchema = z.object({
  categoria: z.enum(["autorizacion", "paciente", "reactivos"]),
  descripcion: z.string().min(1, "La descripción es requerida"),
  estado: z.enum(["resuelto", "pendiente", "impacto aceptado"]),
  archivos: z.any().optional(),
});

type ProblemaFormValues = z.infer<typeof problemaSchema>;

export function ProblemasForm() {
  const { user } = useAuth();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Check authentication status and admin role
  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      navigate('/');
      showToast("Error", "Acceso no autorizado", "error");
    }
  }, [user, navigate, showToast]);

  const form = useForm<ProblemaFormValues>({
    resolver: zodResolver(problemaSchema),
    defaultValues: {
      categoria: "autorizacion",
      descripcion: "",
      estado: "pendiente",
    },
  });

  const createProblema = useMutation({
    mutationFn: async (values: ProblemaFormValues) => {
      if (!user?.user_id || user.user_type !== 'admin') {
        throw new Error("Usuario no autorizado");
      }

      console.log("Attempting to create problema with user_id:", user.user_id);

      const { data, error } = await supabase
        .from("ieasalvay_bioquimicas_problemas")
        .insert([
          {
            user_id: user.user_id,
            categoria: values.categoria,
            descripcion: values.descripcion,
            estado: values.estado,
          },
        ])
        .select();

      if (error) {
        console.error("Error creating problema:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      showToast("Éxito", "Problema registrado correctamente", "success");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["problemas"] });
    },
    onError: (error: Error) => {
      console.error("Error detallado al crear problema:", error);
      showToast(
        "Error",
        "No se pudo registrar el problema. Por favor, intente nuevamente.",
        "error"
      );
    },
  });

  const onSubmit = async (values: ProblemaFormValues) => {
    if (!user || user.user_type !== 'admin') {
      showToast("Error", "Usuario no autorizado", "error");
      return;
    }
    
    try {
      await createProblema.mutateAsync(values);
    } catch (error) {
      console.error("Error en el submit:", error);
    }
  };

  if (!user || user.user_type !== 'admin') {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Carga de Problemas</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría del Problema</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="autorizacion">Autorización</SelectItem>
                      <SelectItem value="paciente">Paciente</SelectItem>
                      <SelectItem value="reactivos">Reactivos</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="descripcion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción del Problema</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estado"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado del Problema</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione un estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="pendiente">Pendiente</SelectItem>
                      <SelectItem value="resuelto">Resuelto</SelectItem>
                      <SelectItem value="impacto aceptado">Impacto Aceptado</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="archivos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Archivos Adjuntos</FormLabel>
                  <FormControl>
                    <Input type="file" multiple {...field} className="cursor-pointer" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={createProblema.isPending}>
              {createProblema.isPending ? "Guardando..." : "Guardar"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
