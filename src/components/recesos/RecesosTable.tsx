import { Table, TableBody } from '@/components/ui/table';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getRecesos, deleteReceso, updateReceso, type Receso } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';
import { useState } from 'react';
import { RecesosTableHeader } from './TableHeader';
import { RecesoRow } from './TableRow';

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
    queryKey: ['recesos', user?.user_id],
    queryFn: () => getRecesos(user?.user_type, user?.user_id),
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
    mutationFn: ({ id, ...updates }: UpdateRecesoInput) => {
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

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
    } catch (error) {
      console.error('Error in handleDelete:', error);
    }
  };

  if (isLoading) return <div>Cargando...</div>;

  return (
    <Table>
      <RecesosTableHeader isAdmin={user?.user_type === 'admin'} />
      <TableBody>
        {recesos?.map((receso) => (
          <RecesoRow
            key={receso.id}
            receso={receso}
            isAdmin={user?.user_type === 'admin'}
            onEdit={(data) => updateMutation.mutate({ id: receso.id, ...data })}
            onDelete={handleDelete}
            setIsDeleteDialogOpen={setIsDeleteDialogOpen}
            setRecesoToDelete={setRecesoToDelete}
            setSelectedReceso={setSelectedReceso}
            isDeleteDialogOpen={isDeleteDialogOpen}
          />
        ))}
      </TableBody>
    </Table>
  );
};