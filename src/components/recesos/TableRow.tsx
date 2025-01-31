import { TableCell, TableRow } from '@/components/ui/table';
import { formatDate, calculateDays } from '@/lib/dates';
import { type Receso } from '@/lib/supabase';
import { TableActions } from './TableActions';

interface RecesoRowProps {
  receso: Receso;
  isAdmin: boolean;
  onEdit: (data: any) => void;
  onDelete: (id: string) => void;
  setIsDeleteDialogOpen: (value: boolean) => void;
  setRecesoToDelete: (id: string) => void;
  setSelectedReceso: (receso: Receso) => void;
  isDeleteDialogOpen: boolean;
}

export const RecesoRow = ({
  receso,
  isAdmin,
  onEdit,
  onDelete,
  setIsDeleteDialogOpen,
  setRecesoToDelete,
  setSelectedReceso,
  isDeleteDialogOpen
}: RecesoRowProps) => (
  <TableRow>
    {isAdmin && <TableCell>{receso.user?.user_name}</TableCell>}
    <TableCell>{formatDate(receso.start_date)}</TableCell>
    <TableCell>{formatDate(receso.end_date)}</TableCell>
    <TableCell>
      {receso.start_date && receso.end_date
        ? calculateDays(receso.start_date, receso.end_date)
        : '-'}
    </TableCell>
    <TableCell>{receso.comments || '-'}</TableCell>
    {isAdmin && (
      <TableCell>
        <TableActions
          receso={receso}
          onEdit={onEdit}
          onDelete={onDelete}
          setIsDeleteDialogOpen={setIsDeleteDialogOpen}
          setRecesoToDelete={setRecesoToDelete}
          setSelectedReceso={setSelectedReceso}
          isDeleteDialogOpen={isDeleteDialogOpen}
        />
      </TableCell>
    )}
  </TableRow>
);