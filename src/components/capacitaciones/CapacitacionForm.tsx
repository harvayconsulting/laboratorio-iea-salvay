import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

export function CapacitacionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const formSchema = z.object({
    nombre_curso: z.string().min(1, "El nombre del curso es requerido"),
    programa: z.string().optional(),
    entidad: z.string().min(1, "La entidad es requerida"),
    documentacion_impacto: z.string().optional(),
    fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
    fecha_conclusion: z
      .string()
      .optional()
      .refine(
        (fecha_conclusion, ctx) => {
          if (!fecha_conclusion) return true;
          const data = ctx.path[0] === "fecha_conclusion" ? ctx.path[0] : null;
          if (!data) return true;
          
          const fecha_inicio = (ctx as any).getData()?.fecha_inicio;
          if (!fecha_inicio) return true;
          
          return new Date(fecha_conclusion) >= new Date(fecha_inicio);
        },
        {
          message: "La fecha de conclusión no puede ser anterior a la fecha de inicio",
        }
      ),
    cantidad_horas: z.string().optional(),
    costo: z.string().optional(),
    estado: z.enum(["Pendiente", "En curso", "Concluido", "Cancelado"]),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_curso: "",
      programa: "",
      entidad: "",
      documentacion_impacto: "",
      fecha_inicio: "",
      fecha_conclusion: "",
      cantidad_horas: "",
      costo: "",
      estado: "Pendiente",
    },
  });

  const { mutate: createCapacitacion, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      if (!user?.user_id) {
        throw new Error("Usuario no autenticado");
      }

      const { data, error } = await supabase
        .from("ieasalvay_capacitaciones")
        .insert({
          nombre_curso: values.nombre_curso,
          programa: values.programa || null,
          entidad: values.entidad,
          nombre_profesional: user.user_name,
          documentacion_impacto: values.documentacion_impacto || null,
          fecha_inicio: values.fecha_inicio,
          fecha_conclusion: values.fecha_conclusion || null,
          cantidad_horas: values.cantidad_horas ? parseInt(values.cantidad_horas) : null,
          costo: values.costo ? parseFloat(values.costo) : null,
          estado: values.estado,
          user_id: user.user_id,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Capacitación creada",
        description: "La capacitación ha sido registrada exitosamente.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["capacitaciones"] });
    },
    onError: (error) => {
      console.error("Error creating capacitacion:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la capacitación. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createCapacitacion(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombre_curso"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Curso</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="programa"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Programa</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="entidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Entidad</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_inicio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Inicio</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fecha_conclusion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Conclusión</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="cantidad_horas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad de Horas</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="costo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Costo</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
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
                <FormLabel>Estado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un estado" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Pendiente">Pendiente</SelectItem>
                    <SelectItem value="En curso">En curso</SelectItem>
                    <SelectItem value="Concluido">Concluido</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="documentacion_impacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Documentación de Impacto</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar Capacitación"}
        </Button>
      </form>
    </Form>
  );
}