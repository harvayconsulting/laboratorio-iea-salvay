
import { format } from "date-fns";
import { useQuery } from "@tanstack/react-query";
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
            </TableRow>
          ))}
          {(!capacitaciones || capacitaciones.length === 0) && (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-4">
                No hay capacitaciones registradas
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
