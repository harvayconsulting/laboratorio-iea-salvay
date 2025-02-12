
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export const CapacitacionesChart = () => {
  const { data: capacitaciones } = useQuery({
    queryKey: ['capacitaciones-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ieasalvay_capacitaciones')
        .select(`
          *,
          user:user_id (
            user_name
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });

  // Procesar datos para el gráfico de capacitaciones
  const capacitacionesData = capacitaciones?.reduce((acc: any[], cap: any) => {
    const month = new Date(cap.fecha_inicio).toLocaleDateString('es-AR', { month: 'short' });
    const userName = cap.user?.user_name.toLowerCase();

    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth[userName] = (existingMonth[userName] || 0) + 1;
    } else {
      acc.push({
        month,
        [userName]: 1,
      });
    }
    return acc;
  }, []) || [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Capacitaciones por Usuario</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={capacitacionesData}>
            <XAxis 
              dataKey="month"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Cantidad', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12 }
              }}
            />
            <Tooltip />
            <Legend />
            <Bar
              dataKey="mickaela"
              name="Mickaela"
              fill="hsl(var(--chart-1))"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="sasha"
              name="Sasha"
              fill="hsl(var(--chart-2))"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};
