
import { format } from "date-fns";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { Badge } from "@/components/ui/badge";
import { useCustomToast } from "@/hooks/useCustomToast";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { CapacitacionForm } from "./CapacitacionForm";

interface Capacitacion {
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

export function CapacitacionesTable() {
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
    mutationFn: async (capacitacion: Capacitacion) => {
      const { error } = await supabase
        .from("ieasalvay_capacitaciones")
        .update(capacitacion)
        .eq("id", capacitacion.id);

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

  if (isLoading) {
    return <div>Cargando capacitaciones...</div>;
  }

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

  const getEstadoBadgeVariant = (estado: Capacitacion["estado"]) => {
    switch (estado) {
      case "Pendiente":
        return "pending";
      case "En curso":
        return "inprogress";
      case "Concluido":
        return "success";
      case "Cancelado":
        return "destructive";
      default:
        return "default";
    }
  };

  const formatCurrency = (value: number | null) => {
    if (value === null) return "-";
    return new Intl.NumberFormat("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Curso</TableHead>
              <TableHead>Profesional</TableHead>
              <TableHead>Entidad</TableHead>
              <TableHead>Fecha Inicio</TableHead>
              <TableHead>Fecha Conclusión</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Horas</TableHead>
              <TableHead>Costo</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {capacitaciones?.map((capacitacion) => (
              <TableRow key={capacitacion.id}>
                <TableCell className="font-medium">{capacitacion.nombre_curso}</TableCell>
                <TableCell>{capacitacion.nombre_profesional}</TableCell>
                <TableCell>{capacitacion.entidad}</TableCell>
                <TableCell>{format(new Date(capacitacion.fecha_inicio), "dd/MM/yyyy")}</TableCell>
                <TableCell>
                  {capacitacion.fecha_conclusion
                    ? format(new Date(capacitacion.fecha_conclusion), "dd/MM/yyyy")
                    : "-"}
                </TableCell>
                <TableCell>
                  <Badge variant={getEstadoBadgeVariant(capacitacion.estado)}>
                    {capacitacion.estado}
                  </Badge>
                </TableCell>
                <TableCell>{capacitacion.cantidad_horas || "-"}</TableCell>
                <TableCell>{formatCurrency(capacitacion.costo)}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(capacitacion)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(capacitacion.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {(!capacitaciones || capacitaciones.length === 0) && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-4">
                  No hay capacitaciones registradas
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Está seguro que desea eliminar esta capacitación? Esta acción no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Editar Capacitación</DialogTitle>
          </DialogHeader>
          {capacitacionToEdit && (
            <CapacitacionForm 
              initialData={capacitacionToEdit}
              onSubmit={updateCapacitacion}
              onCancel={() => setIsEditDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
