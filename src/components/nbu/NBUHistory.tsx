import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { ProviderSelect } from "./ProviderSelect";
import { NBUTable } from "./NBUTable";

interface ObraSocial {
  id: number;
  nameprovider: string;
  startdateprovider?: string;
  contactprovider?: string;
}

export function NBUHistory() {
  const [selectedProvider, setSelectedProvider] = useState<number | null>(null);

  const { data: providers } = useQuery({
    queryKey: ['providers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ieasalvay_obrasocial')
        .select('*')
        .order('nameprovider');
      
      if (error) {
        console.error('Error fetching providers:', error);
        throw error;
      }
      return data as ObraSocial[];
    },
  });

  const { data: nbuHistory, isLoading, error, refetch } = useQuery({
    queryKey: ['nbu-history', selectedProvider],
    queryFn: async () => {
      console.log('Selected provider:', selectedProvider);
      const { data, error } = await supabase
        .from('ieasalvay_nbu')
        .select(`
          *,
          obrasocial:ieasalvay_obrasocial(*)
        `)
        .eq('id_obrasocial', selectedProvider)
        .order('effective_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching NBU history:', error);
        throw error;
      }

      console.log('Raw query response:', data);
      return data;
    },
    refetchOnWindowFocus: false,
    enabled: !!selectedProvider,
  });

  useEffect(() => {
    if (selectedProvider) {
      refetch();
    }
  }, [selectedProvider, refetch]);

  if (error) {
    console.error('Query error:', error);
    return <div>Error al cargar los datos: {error.message}</div>;
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
        <ProviderSelect 
          providers={providers || []}
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
        />
        <NBUTable nbuHistory={nbuHistory} />
      </CardContent>
    </Card>
  );
}