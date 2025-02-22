
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subMonths } from "date-fns";

export function CurrentNBUTable() {
  const { data: currentNBUs, isLoading } = useQuery({
    queryKey: ['current-nbus'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ieasalvay_nbu')
        .select(`
          value,
          effective_date,
          obrasocial:ieasalvay_obrasocial(
            nameprovider
          )
        `)
        .order('effective_date', { ascending: false });

      if (error) {
        console.error('Error fetching current NBUs:', error);
        throw error;
      }

      // Get most recent NBU for each provider and sort by provider name
      const latestNBUs = data.reduce((acc: any[], curr) => {
        const existingProvider = acc.find(
          item => item.obrasocial.nameprovider === curr.obrasocial.nameprovider
        );
        
        if (!existingProvider) {
          acc.push(curr);
        }
        return acc;
      }, []);

      return latestNBUs.sort((a, b) => 
        a.obrasocial.nameprovider.localeCompare(b.obrasocial.nameprovider)
      );
    },
  });

  if (isLoading) {
    return <div>Cargando valores actuales...</div>;
  }

  const threeMonthsAgo = subMonths(new Date(), 3);

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Valores Actuales NBU</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Obra Social</TableHead>
              <TableHead>Valor Actual NBU</TableHead>
              <TableHead>Fecha de Actualización</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentNBUs?.map((nbu: any) => (
              <TableRow key={nbu.obrasocial.nameprovider}>
                <TableCell>{nbu.obrasocial.nameprovider}</TableCell>
                <TableCell>${nbu.value}</TableCell>
                <TableCell className={
                  nbu.effective_date && new Date(nbu.effective_date) < threeMonthsAgo 
                    ? "text-red-500" 
                    : ""
                }>
                  {nbu.effective_date ? format(new Date(nbu.effective_date), 'dd/MM/yyyy') : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
