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
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/lib/auth";

const formSchema = z.object({
  nombre_curso: z.string().min(1, "El nombre del curso es requerido"),
  programa: z.string().optional(),
  entidad: z.string().min(1, "La entidad es requerida"),
  nombre_profesional: z.string().min(1, "El nombre del profesional es requerido"),
  documentacion_impacto: z.string().optional(),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
  fecha_conclusion: z.string().optional(),
  cantidad_horas: z.string()
    .refine(val => !val || (Number(val) >= 0 && Number(val) <= 9999), {
      message: "La cantidad de horas debe ser un número entre 0 y 9999"
    })
    .optional(),
  costo: z.string()
    .refine(val => !val || (Number(val) >= 0 && Number(val) <= 999999.99), {
      message: "El costo debe ser un número entre 0 y 999999.99"
    })
    .optional(),
  estado: z.enum(["Pendiente", "En curso", "Concluido", "Cancelado"]),
});

export function CapacitacionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre_curso: "",
      programa: "",
      entidad: "",
      nombre_profesional: "",
      documentacion_impacto: "",
      fecha_inicio: new Date().toISOString().split("T")[0],
      fecha_conclusion: "",
      cantidad_horas: "",
      costo: "",
      estado: "Pendiente",
    },
  });

  const { mutate: createCapacitacion, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      console.log("Submitting values:", values);
      
      // Prepare the data object with proper type handling and validation
      const capacitacionData = {
        nombre_curso: values.nombre_curso,
        programa: values.programa || null,
        entidad: values.entidad,
        nombre_profesional: values.nombre_profesional,
        documentacion_impacto: values.documentacion_impacto || null,
        fecha_inicio: values.fecha_inicio,
        fecha_conclusion: values.fecha_conclusion || null,
        cantidad_horas: values.cantidad_horas ? parseInt(values.cantidad_horas) : null,
        costo: values.costo ? parseFloat(values.costo) : null,
        estado: values.estado,
        user_id: user?.user_id || null,
      };

      // Additional validation for numeric fields
      if (capacitacionData.cantidad_horas && (capacitacionData.cantidad_horas < 0 || capacitacionData.cantidad_horas > 9999)) {
        throw new Error("La cantidad de horas debe estar entre 0 y 9999");
      }

      if (capacitacionData.costo && (capacitacionData.costo < 0 || capacitacionData.costo > 999999.99)) {
        throw new Error("El costo debe estar entre 0 y 999999.99");
      }

      console.log("Prepared data:", capacitacionData);

      const { data, error } = await supabase
        .from("ieasalvay_capacitaciones")
        .insert(capacitacionData)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
        if (error.message.includes("numeric field overflow")) {
          throw new Error("El valor ingresado es demasiado grande para el campo numérico");
        }
        throw new Error(error.message);
      }

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
    onError: (error: Error) => {
      console.error("Error creating capacitacion:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Form values:", values);
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
                  <Input {...field} />
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
            name="nombre_profesional"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Profesional</FormLabel>
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
});
