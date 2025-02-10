
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createReceso } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { differenceInBusinessDays, isBefore, parseISO } from 'date-fns';

export const RequestForm = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [comments, setComments] = useState('');
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const validateDates = (start: string, end: string): string | null => {
    if (!start || !end) return null;
    
    const startDate = parseISO(start);
    const endDate = parseISO(end);
    
    if (isBefore(endDate, startDate)) {
      return 'La fecha de fin no puede ser anterior a la fecha de inicio';
    }
    
    const businessDays = differenceInBusinessDays(endDate, startDate);
    
    if (businessDays > 3) {
      return 'El receso no puede exceder los 4 días hábiles';
    }
    
    return null;
  };

  const mutation = useMutation({
    mutationFn: createReceso,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recesos'] });
      toast({
        title: 'Éxito',
        description: 'Receso solicitado con éxito',
        style: { background: '#F2FCE2', border: '1px solid #c1e1b9' },
        duration: 3000,
      });
      setStartDate('');
      setEndDate('');
      setComments('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: 'No es posible solicitar el receso, por favor consulte al administrador',
        style: { background: '#ea384c', color: 'white' },
        duration: 5000,
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user?.user_id) {
      toast({
        title: 'Error',
        description: 'Usuario no autenticado',
        style: { background: '#ea384c', color: 'white' },
        duration: 3000,
      });
      return;
    }

    const validationError = validateDates(startDate, endDate);
    if (validationError) {
      toast({
        title: 'Error de validación',
        description: validationError,
        style: { background: '#ea384c', color: 'white' },
        duration: 3000,
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
