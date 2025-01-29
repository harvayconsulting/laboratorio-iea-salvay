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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { Database } from "@/integrations/supabase/types";

type InsuranceProvider = Database['public']['Enums']['insurance_provider'];

const PROVIDERS: { value: InsuranceProvider; label: string }[] = [
  { value: 'AVALIAN', label: 'Avalian' },
  { value: 'APROSS', label: 'Apross' },
  { value: 'CAJA_ABOGADOS', label: 'Caja Abogados' },
  { value: 'CAJA_NOTARIAL', label: 'Caja Notarial' },
  { value: 'CPCE', label: 'CPCE' },
  { value: 'DASPU', label: 'DASPU' },
  { value: 'FEDERADA_1', label: 'Federada 1' },
  { value: 'FEDERADA_2_3_4000', label: 'Federada 2/3/4000' },
  { value: 'JERARQUICOS_PMO', label: 'Jerárquicos PMO' },
  { value: 'JERARQUICOS_ALTA_FRECUENCIA', label: 'Jerárquicos Alta Frecuencia' },
  { value: 'GALENO', label: 'Galeno' },
  { value: 'MEDIFE', label: 'Medife' },
  { value: 'MUTUAL_TAXI', label: 'Mutual Taxi' },
  { value: 'NOBIS', label: 'Nobis' },
  { value: 'OMINT', label: 'Omint' },
  { value: 'OSDE', label: 'OSDE' },
  { value: 'PAMI_1EROS_6', label: 'PAMI (1eros 6)' },
  { value: 'PAMI_(7MO_ADELANTE)', label: 'PAMI (7mo adelante)' },
  { value: 'PARTICULARES_BAJA', label: 'Particulares (baja)' },
  { value: 'PARTICULARES_ALTA', label: 'Particulares (alta)' },
  { value: 'PREVENCIÓN_A1_A2', label: 'Prevención A1/A2' },
  { value: 'PREVENCIÓN_A3_A6', label: 'Prevención A3/A6' },
  { value: 'SANCOR_500', label: 'Sancor 500' },
  { value: 'SANCOR_1000', label: 'Sancor 1000' },
  { value: 'SIPSSA', label: 'SIPSSA' },
  { value: 'SWISS_MEDICAL', label: 'Swiss Medical' },
];

export function NBUHistory() {
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider>(PROVIDERS[0].value);

  const { data: nbuHistory, isLoading, error } = useQuery({
    queryKey: ['nbu-history', selectedProvider],
    queryFn: async () => {
      console.log('Selected provider:', selectedProvider);
      const { data, error } = await supabase
        .from('ieasalvay_nbu')
        .select('*')
        .eq('provider', selectedProvider)
        .order('effective_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching NBU history:', error);
        throw error;
      }

      console.log('Raw query response:', data);
      return data;
    },
  });

  if (error) {
    console.error('Query error:', error);
  }

  if (isLoading) {
    return <div>Cargando histórico...</div>;
  }

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle>Histórico NBU</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <Select 
            value={selectedProvider} 
            onValueChange={(value: InsuranceProvider) => {
              console.log('Changing provider to:', value);
              setSelectedProvider(value);
            }}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Seleccionar prestador" />
            </SelectTrigger>
            <SelectContent>
              {PROVIDERS.map((provider) => (
                <SelectItem key={provider.value} value={provider.value}>
                  {provider.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
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
                  <TableCell>{PROVIDERS.find(p => p.value === nbu.provider)?.label || nbu.provider}</TableCell>
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
      </CardContent>
    </Card>
  );
}