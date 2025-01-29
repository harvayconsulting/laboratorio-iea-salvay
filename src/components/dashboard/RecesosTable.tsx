import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Pencil, Trash2 } from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecesos, deleteReceso } from '@/lib/supabase';
import { formatDate, calculateDays } from '@/lib/dates';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export const RecesosTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recesos, isLoading } = useQuery({
    queryKey: ['recesos'],
    queryFn: getRecesos,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteReceso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recesos'] });
      toast({
        title: 'Éxito',
        description: 'Receso eliminado correctamente',
      });
    },
    onError: (error) => {
      console.error('Error deleting receso:', error);
      toast({
        title: 'Error',
        description: 'No se pudo eliminar el receso',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Bioquímica</TableHead>
          <TableHead>Fecha Inicio</TableHead>
          <TableHead>Fecha Fin</TableHead>
          <TableHead>Días</TableHead>
          <TableHead>Comentarios</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recesos?.map((receso) => (
          <TableRow key={receso.id}>
            <TableCell>{receso.user.user_name}</TableCell>
            <TableCell>{formatDate(receso.start_date)}</TableCell>
            <TableCell>{formatDate(receso.end_date)}</TableCell>
            <TableCell>
              {receso.start_date && receso.end_date
                ? calculateDays(receso.start_date, receso.end_date)
                : '-'}
            </TableCell>
            <TableCell>{receso.comments || '-'}</TableCell>
            <TableCell className="space-x-2">
              {user?.user_type === 'admin' && (
                <>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {/* TODO: Implement edit */}}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (window.confirm('¿Está seguro de eliminar este receso?')) {
                        deleteMutation.mutate(receso.id);
                      }
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};