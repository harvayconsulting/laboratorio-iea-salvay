import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { BasicInfoFields } from "./form/BasicInfoFields";
import { DateFields } from "./form/DateFields";
import { NumericFields } from "./form/NumericFields";
import { StatusField } from "./form/StatusField";
import { capacitacionFormSchema, type CapacitacionFormValues } from "./types";

export function CapacitacionForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const form = useForm<CapacitacionFormValues>({
    resolver: zodResolver(capacitacionFormSchema),
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
    mutationFn: async (values: CapacitacionFormValues) => {
      console.log("Submitting values:", values);
      
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

      console.log("Prepared data:", capacitacionData);

      const { data, error } = await supabase
        .from("ieasalvay_capacitaciones")
        .insert(capacitacionData)
        .select()
        .maybeSingle();

      if (error) {
        console.error("Supabase error:", error);
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

  function onSubmit(values: CapacitacionFormValues) {
    console.log("Form values:", values);
    createCapacitacion(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoFields form={form} />
          <DateFields form={form} />
          <NumericFields form={form} />
          <StatusField form={form} />
        </div>

        <FormField
          control={form.control}
          name="documentacion_impacto"
          render={({ field }) => (
            <div>
              <label className="block text-sm font-medium mb-1">
                Documentación de Impacto
              </label>
              <Textarea {...field} />
            </div>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar Capacitación"}
        </Button>
      </form>
    </Form>
  );
}