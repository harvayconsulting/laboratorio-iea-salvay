import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CapacitacionFormValues } from "./schema";
import { UseFormReset } from "react-hook-form";

export const useCapacitacionForm = (reset: UseFormReset<CapacitacionFormValues>) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { mutate: createCapacitacion, isPending } = useMutation({
    mutationFn: async (values: CapacitacionFormValues) => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        throw new Error("Usuario no autenticado");
      }

      const { data, error } = await supabase
        .from("ieasalvay_capacitaciones")
        .insert({
          nombre_curso: values.nombre_curso,
          programa: values.programa || null,
          entidad: values.entidad,
          nombre_profesional: user.email, // Using email as nombre_profesional temporarily
          documentacion_impacto: values.documentacion_impacto || null,
          fecha_inicio: values.fecha_inicio,
          fecha_conclusion: values.fecha_conclusion || null,
          cantidad_horas: values.cantidad_horas ? parseInt(values.cantidad_horas) : null,
          costo: values.costo ? parseFloat(values.costo) : null,
          estado: values.estado,
          user_id: user.id,
        })
        .select()
        .single();

      if (error) {
        console.error("Error details:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Capacitación creada",
        description: "La capacitación ha sido registrada exitosamente.",
      });
      reset();
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

  return { createCapacitacion, isPending };
};