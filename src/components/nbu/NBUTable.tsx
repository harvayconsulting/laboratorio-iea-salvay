import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface NBU {
  id: string;
  id_obrasocial: number;
  value: number;
  effective_date: string;
  obrasocial: {
    id: number;
    nameprovider: string;
  };
}

interface NBUTableProps {
  nbuHistory: NBU[] | null;
}

export function NBUTable({ nbuHistory }: NBUTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Prestador</TableHead>
            <TableHead>Valor</TableHead>
            <TableHead>Fecha de Vigencia</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {nbuHistory?.map((nbu) => (
            <TableRow key={nbu.id}>
              <TableCell>{nbu.obrasocial.nameprovider}</TableCell>
              <TableCell>{nbu.value}</TableCell>
              <TableCell>
                {format(new Date(nbu.effective_date), 'dd/MM/yyyy')}
              </TableCell>
            </TableRow>
          ))}
          {(!nbuHistory || nbuHistory.length === 0) && (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4">
                No hay datos históricos para este prestador
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}