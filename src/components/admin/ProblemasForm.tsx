
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
  biochemist_id: z.string().min(1, "La bioquímica es requerida"),
  archivos: z.any().optional(),
});

type ProblemaFormValues = z.infer<typeof problemaSchema>;

export function ProblemasForm() {
  const { user } = useAuth();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch biochemists
  const { data: biochemists } = useQuery({
    queryKey: ["biochemists"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ieasalvay_usuarios")
        .select("*")
        .eq("user_type", "bioquimica");

      if (error) throw error;
      return data;
    },
  });

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      navigate('/');
      showToast("Error", "Acceso no autorizado", "error");
    }
  }, [user, navigate, showToast]);

  const form = useForm<ProblemaFormValues>({
    resolver: zodResolver(problemaSchema),
    defaultValues: {
      categoria: undefined,
      descripcion: "",
      estado: undefined,
      biochemist_id: undefined,
    },
  });

  const createProblema = useMutation({
    mutationFn: async (values: ProblemaFormValues) => {
      if (!user?.user_id || user.user_type !== 'admin') {
        throw new Error("Usuario no autorizado");
      }

      // First, validate we have all required data
      if (!values.categoria || !values.descripcion || !values.estado || !values.biochemist_id) {
        throw new Error("Faltan campos requeridos");
      }

      const { data, error } = await supabase
        .from("ieasalvay_bioquimicas_problemas")
        .insert({
          user_id: user.user_id,
          categoria: values.categoria,
          descripcion: values.descripcion,
          estado: values.estado,
          biochemist_id: values.biochemist_id,
          created_at: new Date().toISOString(), // Explicitly set creation date
          updated_at: new Date().toISOString(),  // Explicitly set update date
        })
        .select('*')
        .single();

      if (error) {
        console.error("Error creating problema:", error);
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      showToast("Éxito", "Problema registrado correctamente", "success");
      form.reset({
        categoria: undefined,
        descripcion: "",
        estado: undefined,
        biochemist_id: undefined,
      });
      queryClient.invalidateQueries({ queryKey: ["problemas"] });
    },
    onError: (error: Error) => {
      console.error("Error detallado al crear problema:", error);
      showToast(
        "Error",
        "No se pudo registrar el problema. Por favor, intente nuevamente y asegúrese de estar autenticado.",
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
              name="biochemist_id"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bioquímica</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una bioquímica" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {biochemists?.map((biochemist) => (
                        <SelectItem key={biochemist.user_id} value={biochemist.user_id}>
                          {biochemist.user_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="categoria"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría del Problema</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  <FormLabel>Archivos Adjuntos (Opcional)</FormLabel>
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
