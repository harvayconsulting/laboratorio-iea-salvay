
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export function NBUChart() {
  const { data: nbuData, isLoading } = useQuery({
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

      // Get most recent NBU for each provider
      const latestNBUs = data.reduce((acc: any[], curr) => {
        const existingProvider = acc.find(
          item => item.obrasocial.nameprovider === curr.obrasocial.nameprovider
        );
        
        if (!existingProvider) {
          acc.push({
            name: curr.obrasocial.nameprovider,
            value: curr.value
          });
        }
        return acc;
      }, []);

      return latestNBUs.sort((a, b) => b.value - a.value);
    },
  });

  if (isLoading) return <div>Cargando...</div>;

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
