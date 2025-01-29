import { useQuery } from '@tanstack/react-query';
import { getRecesos } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { calculateDays } from '@/lib/dates';

export const RecesosChart = () => {
  const { user } = useAuth();
  const { data: recesos } = useQuery({
    queryKey: ['recesos', user?.user_id],
    queryFn: () => getRecesos(user?.user_type, user?.user_id),
  });

  const chartData = recesos?.reduce((acc: any[], receso) => {
    const month = new Date(receso.start_date).toLocaleDateString('es-AR', { month: 'short' });
    const days = calculateDays(receso.start_date, receso.end_date);
    const userName = receso.user?.user_name.toLowerCase();

    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth[userName] = (existingMonth[userName] || 0) + days;
    } else {
      acc.push({
        month,
        [userName]: days,
      });
    }
    return acc;
  }, []) || [];

  return (
    <Card className="h-[300px]">
      <CardHeader className="p-4">
        <CardTitle className="text-base sm:text-lg">Historial de Recesos</CardTitle>
      </CardHeader>
      <CardContent className="p-2 sm:p-4">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={chartData}
            margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
          >
            <XAxis 
              dataKey="month"
              tick={{ fontSize: 12 }}
              interval={0}
            />
            <YAxis
              tick={{ fontSize: 12 }}
              label={{ 
                value: 'Días', 
                angle: -90, 
                position: 'insideLeft',
                style: { fontSize: 12 }
              }}
            />
            <Tooltip
              formatter={(value: number) => [`${value} días`]}
              labelFormatter={(label) => `Mes: ${label}`}
            />
            {user?.user_type === 'admin' ? (
              <>
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
                <Legend />
              </>
            ) : (
              <Bar
                dataKey={user?.user_name.toLowerCase()}
                name="Días de Receso"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};