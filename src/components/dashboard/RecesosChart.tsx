import { useQuery } from '@tanstack/react-query';
import { getRecesos } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis, Legend } from 'recharts';
import { calculateDays } from '@/lib/dates';

const chartConfig = {
  mickaela: {
    label: "Mickaela",
    color: "hsl(var(--chart-1))",
  },
  sasha: {
    label: "Sasha",
    color: "hsl(var(--chart-2))",
  },
};

export const RecesosChart = () => {
  const { user } = useAuth();
  const { data: recesos } = useQuery({
    queryKey: ['recesos', user?.user_id],
    queryFn: () => getRecesos(user?.user_type, user?.user_id),
  });

  const chartData = recesos?.reduce((acc: any[], receso) => {
    const date = new Date(receso.start_date).toISOString().split('T')[0];
    const days = calculateDays(receso.start_date, receso.end_date);
    const userName = receso.user?.user_name.toLowerCase();

    const existingDate = acc.find(item => item.date === date);
    if (existingDate) {
      existingDate[userName] = days;
    } else {
      acc.push({
        date,
        [userName]: days,
      });
    }
    return acc;
  }, []) || [];

  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">Historial de Recesos</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart 
            data={chartData} 
            barSize={10}
            margin={{ top: 5, right: 5, bottom: 5, left: 5 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={20}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("es-AR", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("es-AR", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    });
                  }}
                />
              }
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
                dataKey="recesos" 
                fill="var(--color-recesos)" 
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};