import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReceso } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';

export const RequestForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comments, setComments] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: createReceso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recesos'] });
      toast({
        title: 'Éxito',
        description: 'Receso solicitado correctamente',
      });
      setStartDate('');
      setEndDate('');
      setComments('');
    },
    onError: (error) => {
      console.error('Error creating receso:', error);
      toast({
        title: 'Error',
        description: 'No se pudo crear el receso. Por favor intente nuevamente.',
        variant: 'destructive',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.user_id) {
      toast({
        title: 'Error',
        description: 'Usuario no autenticado',
        variant: 'destructive',
      });
      return;
    }

    mutation.mutate({
      user_id: user.user_id,
      start_date: startDate,
      end_date: endDate,
      comments,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <label htmlFor="startDate">Fecha Inicio</label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <label htmlFor="endDate">Fecha Fin</label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            required
          />
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="comments">Comentarios</label>
        <Textarea
          id="comments"
          value={comments}
          onChange={(e) => setComments(e.target.value)}
          rows={3}
        />
      </div>
      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? 'Solicitando...' : 'Solicitar Receso'}
      </Button>
    </form>
  );
};