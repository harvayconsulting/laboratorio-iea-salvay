import { useQuery } from "@tanstack/react-query";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

export function NBUHistory() {
  const { data: nbuHistory, isLoading } = useQuery({
    queryKey: ['nbu-history'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ieasalvay_nbu')
        .select('*')
        .order('effective_date', { ascending: false });
      
      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return <div>Cargando histórico...</div>;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Histórico NBU</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <TableCell>{nbu.provider.replace(/_/g, ' ')}</TableCell>
                  <TableCell>{nbu.value}</TableCell>
                  <TableCell>
                    {format(new Date(nbu.effective_date), 'dd/MM/yyyy')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}