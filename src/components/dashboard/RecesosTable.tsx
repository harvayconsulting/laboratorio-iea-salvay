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
import { getRecesos, deleteReceso, updateReceso, type Receso } from '@/lib/supabase';
import { formatDate, calculateDays } from '@/lib/dates';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditForm } from './EditForm';
import { useState } from 'react';

type UpdateRecesoInput = {
  id: string;
  start_date: Date;
  end_date: Date;
  comments?: string;
};

export const RecesosTable = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedReceso, setSelectedReceso] = useState<Receso | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [recesoToDelete, setRecesoToDelete] = useState<string | null>(null);

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
      setIsDeleteDialogOpen(false);
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
    mutationFn: async (data: UpdateRecesoInput) => {
      const { id, ...updates } = data;
      return updateReceso(id, {
        start_date: updates.start_date.toISOString(),
        end_date: updates.end_date.toISOString(),
        comments: updates.comments,
      });
    },
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
    <>
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
              <TableCell>{receso.user?.user_name}</TableCell>
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
                      <DialogContent aria-describedby="edit-form-description">
                        <DialogHeader>
                          <DialogTitle>Editar Receso</DialogTitle>
                          <DialogDescription id="edit-form-description">
                            Modifica los detalles del receso seleccionado
                          </DialogDescription>
                        </DialogHeader>
                        <EditForm
                          receso={selectedReceso}
                          onSubmit={(data) => updateMutation.mutate({ id: receso.id, ...data })}
                        />
                      </DialogContent>
                    </Dialog>
                    <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => setRecesoToDelete(receso.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent aria-describedby="delete-confirmation-description">
                        <DialogHeader>
                          <DialogTitle>Confirmar Eliminación</DialogTitle>
                          <DialogDescription id="delete-confirmation-description">
                            ¿Está seguro de que desea eliminar este receso?
                          </DialogDescription>
                        </DialogHeader>
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                          >
                            Cancelar
                          </Button>
                          <Button
                            variant="destructive"
                            onClick={() => {
                              if (recesoToDelete) {
                                handleDelete(recesoToDelete);
                              }
                            }}
                          >
                            Eliminar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};