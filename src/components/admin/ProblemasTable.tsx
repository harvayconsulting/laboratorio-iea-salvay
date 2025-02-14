
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

interface Problema {
  id: string;
  categoria: "autorizacion" | "paciente" | "reactivos";
  descripcion: string;
  estado: "resuelto" | "pendiente" | "impacto aceptado";
  created_at: string;
  user: {
    user_name: string;
  };
}

export function ProblemasTable() {
  const { data: problemas, isLoading } = useQuery({
    queryKey: ["problemas"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ieasalvay_bioquimicas_problemas")
        .select(`
          *,
          user:user_id (
            user_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Problema[];
    },
  });

  if (isLoading) return <div>Cargando problemas...</div>;

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Fecha</TableHead>
            <TableHead>Bioquímica</TableHead>
            <TableHead>Categoría</TableHead>
            <TableHead>Descripción</TableHead>
            <TableHead>Estado</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemas?.map((problema) => (
            <TableRow key={problema.id}>
              <TableCell>
                {format(new Date(problema.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{problema.user?.user_name}</TableCell>
              <TableCell>
                <Badge variant="secondary">{problema.categoria}</Badge>
              </TableCell>
              <TableCell className="max-w-md truncate">{problema.descripcion}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    problema.estado === "resuelto"
                      ? "success"
                      : problema.estado === "pendiente"
                      ? "destructive"
                      : "pending"
                  }
                >
                  {problema.estado}
                </Badge>
              </TableCell>
            </TableRow>
          ))}
          {(!problemas || problemas.length === 0) && (
            <TableRow>
              <TableCell colSpan={5} className="text-center py-4">
                No hay problemas registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
