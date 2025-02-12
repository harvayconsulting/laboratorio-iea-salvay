
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useCustomToast } from "@/hooks/useCustomToast";
import { CapacitacionFormValues } from "./schema";

export interface Capacitacion {
  id: string;
  nombre_curso: string;
  programa: string | null;
  entidad: string;
  nombre_profesional: string;
  documentacion_impacto: string | null;
  fecha_inicio: string;
  fecha_conclusion: string | null;
  cantidad_horas: number | null;
  costo: number | null;
  estado: "Pendiente" | "En curso" | "Concluido" | "Cancelado";
  user_id: string;
  created_at: string;
}

export function useCapacitacionesTable() {
  const { user } = useAuth();
  const { showToast } = useCustomToast();
  const queryClient = useQueryClient();
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [capacitacionToDelete, setCapacitacionToDelete] = useState<string | null>(null);
  const [capacitacionToEdit, setCapacitacionToEdit] = useState<Capacitacion | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const { data: capacitaciones, isLoading } = useQuery({
    queryKey: ["capacitaciones"],
    queryFn: async () => {
      let query = supabase
        .from("ieasalvay_capacitaciones")
        .select("*")
        .order("created_at", { ascending: false });

      if (user?.user_type !== "admin") {
        query = query.eq("user_id", user?.user_id);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching capacitaciones:', error);
        showToast(
          'Error',
          'No se pudieron cargar las capacitaciones. Por favor, intente nuevamente.',
          'error'
        );
        throw error;
      }
      
      return data as Capacitacion[];
    },
    enabled: !!user?.user_id,
  });

  const { mutate: deleteCapacitacion } = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ieasalvay_capacitaciones")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      showToast(
        'Capacitación eliminada',
        'La capacitación ha sido eliminada exitosamente',
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ["capacitaciones"] });
      setIsDeleteDialogOpen(false);
      setCapacitacionToDelete(null);
    },
    onError: (error) => {
      console.error('Error deleting capacitacion:', error);
      showToast(
        'Error',
        'No se pudo eliminar la capacitación. Por favor, intente nuevamente.',
        'error'
      );
    },
  });

  const { mutate: updateCapacitacion } = useMutation({
    mutationFn: async (values: CapacitacionFormValues) => {
      if (!capacitacionToEdit) return;

      const { error } = await supabase
        .from("ieasalvay_capacitaciones")
        .update({
          ...capacitacionToEdit,
          nombre_curso: values.nombre_curso,
          programa: values.programa || null,
          entidad: values.entidad,
          documentacion_impacto: values.documentacion_impacto || null,
          fecha_inicio: values.fecha_inicio,
          fecha_conclusion: values.fecha_conclusion || null,
          cantidad_horas: values.cantidad_horas ? parseInt(values.cantidad_horas) : null,
          costo: values.costo ? parseFloat(values.costo) : null,
          estado: values.estado,
        })
        .eq("id", capacitacionToEdit.id);

      if (error) throw error;
    },
    onSuccess: () => {
      showToast(
        'Capacitación actualizada',
        'La capacitación ha sido actualizada exitosamente',
        'success'
      );
      queryClient.invalidateQueries({ queryKey: ["capacitaciones"] });
      setIsEditDialogOpen(false);
      setCapacitacionToEdit(null);
    },
    onError: (error) => {
      console.error('Error updating capacitacion:', error);
      showToast(
        'Error',
        'No se pudo actualizar la capacitación. Por favor, intente nuevamente.',
        'error'
      );
    },
  });

  const handleDelete = (id: string) => {
    setCapacitacionToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const handleEdit = (capacitacion: Capacitacion) => {
    setCapacitacionToEdit(capacitacion);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = () => {
    if (capacitacionToDelete) {
      deleteCapacitacion(capacitacionToDelete);
    }
  };

  const formatForForm = (capacitacion: Capacitacion): CapacitacionFormValues => {
    return {
      nombre_curso: capacitacion.nombre_curso,
      programa: capacitacion.programa || "",
      entidad: capacitacion.entidad,
      documentacion_impacto: capacitacion.documentacion_impacto || "",
      fecha_inicio: capacitacion.fecha_inicio,
      fecha_conclusion: capacitacion.fecha_conclusion || "",
      cantidad_horas: capacitacion.cantidad_horas?.toString() || "",
      costo: capacitacion.costo?.toString() || "",
      estado: capacitacion.estado,
    };
  };

  return {
    capacitaciones,
    isLoading,
    isDeleteDialogOpen,
    setIsDeleteDialogOpen,
    isEditDialogOpen,
    setIsEditDialogOpen,
    capacitacionToEdit,
    handleDelete,
    handleEdit,
    confirmDelete,
    updateCapacitacion,
    formatForForm,
  };
}
