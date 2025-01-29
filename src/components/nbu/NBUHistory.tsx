import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";
import { Database } from "@/integrations/supabase/types";
import { ProviderSelect } from "./ProviderSelect";
import { NBUTable } from "./NBUTable";

type InsuranceProvider = Database['public']['Enums']['insurance_provider'];

export function NBUHistory() {
  const [selectedProvider, setSelectedProvider] = useState<InsuranceProvider>('AVALIAN');

  const { data: nbuHistory, isLoading, error, refetch } = useQuery({
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
    refetchOnWindowFocus: false,
    enabled: !!selectedProvider,
  });

  useEffect(() => {
    refetch();
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
          selectedProvider={selectedProvider}
          onProviderChange={setSelectedProvider}
        />
        <NBUTable nbuHistory={nbuHistory} />
      </CardContent>
    </Card>
  );
}