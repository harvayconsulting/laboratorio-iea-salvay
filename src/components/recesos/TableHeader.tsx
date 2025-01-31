import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableHeaderProps {
  isAdmin: boolean;
}

export const RecesosTableHeader = ({ isAdmin }: TableHeaderProps) => (
  <TableHeader>
    <TableRow>
      {isAdmin && <TableHead>Bioquímica</TableHead>}
      <TableHead>Fecha Inicio</TableHead>
      <TableHead>Fecha Fin</TableHead>
      <TableHead>Días</TableHead>
      <TableHead>Comentarios</TableHead>
      {isAdmin && <TableHead>Acciones</TableHead>}
    </TableRow>
  </TableHeader>
);