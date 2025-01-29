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
import { getRecesos, deleteReceso, updateReceso } from '@/lib/supabase';
import { formatDate, calculateDays } from '@/lib/dates';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditForm } from './EditForm';
import { useState } from 'react';

export const RecesosTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReceso, setSelectedReceso] = useState(null);

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

  const updateMutation = useMutation({
    mutationFn: ({ id, ...updates }) => updateReceso(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recesos'] });
      toast({
        title: 'Éxito',
        description: 'Receso actualizado correctamente',
      });
    },
    onError: (error) => {
      console.error('Error updating receso:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar el receso',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) return <div>Cargando...</div>;

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setSelectedReceso(receso)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Editar Receso</DialogTitle>
                      </DialogHeader>
                      <EditForm
                        receso={selectedReceso}
                        onSubmit={(data) => updateMutation.mutate({ id: receso.id, ...data })}
                      />
                    </DialogContent>
                  </Dialog>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      if (window.confirm('¿Está seguro de eliminar este receso?')) {
                        handleDelete(receso.id);
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