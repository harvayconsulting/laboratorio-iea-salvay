
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { CapacitacionActionsCell } from "./CapacitacionesActionsCell";
import { DeleteCapacitacionDialog } from "./DeleteCapacitacionDialog";
import { EditCapacitacionDialog } from "./EditCapacitacionDialog";
import { useCapacitacionesTable } from "./useCapacitacionesTable";

export function CapacitacionesTable() {
  const {
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
  } = useCapacitacionesTable();

  if (isLoading) {
    return <div>Cargando capacitaciones...</div>;
  }

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
                  <CapacitacionActionsCell
                    onEdit={() => handleEdit(capacitacion)}
                    onDelete={() => handleDelete(capacitacion.id)}
                  />
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

      <DeleteCapacitacionDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
      />

      <EditCapacitacionDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        initialData={capacitacionToEdit ? formatForForm(capacitacionToEdit) : null}
        onSubmit={updateCapacitacion}
      />
    </>
  );
}
