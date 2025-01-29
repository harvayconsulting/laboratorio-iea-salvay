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

const PROVIDERS = [
  { value: 'AVALIAN', label: 'Avalian' },
  { value: 'APROSS', label: 'Apross' },
  { value: 'GALENO', label: 'Galeno' },
  { value: 'OSDE', label: 'OSDE' },
  { value: 'SWISS_MEDICAL', label: 'Swiss Medical' },
];

export function NBUHistory() {
  const [selectedProvider, setSelectedProvider] = useState<string>(PROVIDERS[0].value);

  const { data: nbuHistory, isLoading } = useQuery({
    queryKey: ['nbu-history', selectedProvider],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ieasalvay_nbu')
        .select('*')
        .eq('provider', selectedProvider)
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
        <div className="mb-6">
          <Select value={selectedProvider} onValueChange={setSelectedProvider}>
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