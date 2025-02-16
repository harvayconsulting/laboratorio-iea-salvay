
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText } from "lucide-react";
import { useCustomToast } from "@/hooks/useCustomToast";

interface Problema {
  id: string;
  categoria: string;
  descripcion: string;
  estado: string;
  created_at: string;
  archivos_urls: string[] | null;
  biochemist: {
    user_name: string;
  };
}

export function ProblemasTable() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showToast } = useCustomToast();
  const [problemToDelete, setProblemToDelete] = useState<string | null>(null);

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const { data: problemas, isLoading } = useQuery({
    queryKey: ["problemas"],
    queryFn: async () => {
      if (!user) throw new Error("No authenticated user");

      const { data, error } = await supabase
        .from("ieasalvay_bioquimicas_problemas")
        .select(`
          *,
          biochemist:biochemist_id (
            user_name
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Problema[];
    },
    enabled: !!user,
  });

  const deleteProblema = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("ieasalvay_bioquimicas_problemas")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      showToast("Éxito", "Problema eliminado correctamente", "success");
      queryClient.invalidateQueries({ queryKey: ["problemas"] });
    },
    onError: (error) => {
      console.error("Error al eliminar problema:", error);
      showToast("Error", "No se pudo eliminar el problema", "error");
    },
  });

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro que desea eliminar este problema?")) {
      try {
        await deleteProblema.mutateAsync(id);
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleEdit = (problema: Problema) => {
    // TODO: Implement edit functionality
    console.log("Edit problema:", problema);
  };

  if (!user || user.user_type !== 'admin') return null;
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
            <TableHead>Adjuntos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {problemas?.map((problema) => (
            <TableRow key={problema.id}>
              <TableCell>
                {format(new Date(problema.created_at), "dd/MM/yyyy HH:mm")}
              </TableCell>
              <TableCell>{problema.biochemist?.user_name || "No asignado"}</TableCell>
              <TableCell>
                <Badge variant="secondary">{problema.categoria}</Badge>
              </TableCell>
              <TableCell className="max-w-md truncate">{problema.descripcion}</TableCell>
              <TableCell>
                {problema.archivos_urls && problema.archivos_urls.length > 0 ? (
                  <div className="flex gap-2">
                    {problema.archivos_urls.map((url, index) => (
                      <a
                        key={index}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <FileText className="h-4 w-4" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Sin archivo adjunto</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    problema.estado === "resuelto"
                      ? "success"
                      : problema.estado === "pendiente"
                      ? "destructive"
                      : "default"
                  }
                >
                  {problema.estado}
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(problema)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(problema.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {(!problemas || problemas.length === 0) && (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-4">
                No hay problemas registrados
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
