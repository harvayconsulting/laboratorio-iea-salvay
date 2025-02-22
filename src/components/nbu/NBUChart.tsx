
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function NBUChart() {
  const { data: nbuData, isLoading, error } = useQuery({
    queryKey: ['nbu-chart'],
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

      if (error) throw error;
      if (!data || data.length === 0) return [];

      // Get most recent NBU for each provider
      const latestNBUs = data.reduce((acc: any[], curr) => {
        if (!curr.obrasocial?.nameprovider) return acc;
        
        const existingProvider = acc.find(
          item => item.name === curr.obrasocial.nameprovider
        );
        
        if (!existingProvider) {
          acc.push({
            name: curr.obrasocial.nameprovider,
            value: Number(curr.value) || 0
          });
        }
        return acc;
      }, []);

      return latestNBUs.sort((a, b) => b.value - a.value);
    },
  });

  if (error) {
    console.error("Error loading NBU data:", error);
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valores NBU por Obra Social</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p className="text-red-500">Error al cargar los datos</p>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valores NBU por Obra Social</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p>Cargando...</p>
        </CardContent>
      </Card>
    );
  }

  if (!nbuData || nbuData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Valores NBU por Obra Social</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] flex items-center justify-center">
          <p>No hay datos disponibles</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Valores NBU por Obra Social</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={nbuData}>
            <XAxis 
              dataKey="name"
              tick={{ fontSize: 12 }}
              interval={0}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Valor NBU ($)', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12 }
              }}
            />
            <Tooltip />
            <Bar
              dataKey="value"
              fill="hsl(var(--primary))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
