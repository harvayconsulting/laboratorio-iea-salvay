import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { EditForm } from './EditForm';
import { type Receso } from '@/lib/supabase';

interface TableActionsProps {
  receso: Receso;
  onEdit: (data: any) => void;
  onDelete: (id: string) => void;
  setIsDeleteDialogOpen: (value: boolean) => void;
  setRecesoToDelete: (id: string) => void;
  setSelectedReceso: (receso: Receso) => void;
  isDeleteDialogOpen: boolean;
}

export const TableActions = ({
  receso,
  onEdit,
  onDelete,
  setIsDeleteDialogOpen,
  setRecesoToDelete,
  setSelectedReceso,
  isDeleteDialogOpen
}: TableActionsProps) => (
  <div className="space-x-2">
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
          <DialogDescription>
            Modifica los detalles del receso seleccionado
          </DialogDescription>
        </DialogHeader>
        <EditForm receso={receso} onSubmit={onEdit} />
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
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirmar Eliminación</DialogTitle>
          <DialogDescription>
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
            onClick={() => onDelete(receso.id)}
          >
            Eliminar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);