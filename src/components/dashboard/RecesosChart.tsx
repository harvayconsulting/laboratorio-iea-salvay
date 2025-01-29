import { useQuery } from '@tanstack/react-query';
import { getRecesos } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { calculateDays } from '@/lib/dates';

const chartConfig = {
  recesos: {
    label: "Días de Receso",
    color: "hsl(var(--chart-1))",
  },
};

export const RecesosChart = () => {
  const { user } = useAuth();
  const { data: recesos } = useQuery({
    queryKey: ['recesos', user?.user_id],
    queryFn: () => getRecesos(user?.user_type, user?.user_id),
  });

  const chartData = recesos?.map(receso => ({
    date: new Date(receso.start_date).toISOString().split('T')[0],
    recesos: calculateDays(receso.start_date, receso.end_date),
  })) || [];

  return (
    <Card className="h-[300px]">
      <CardHeader>
        <CardTitle className="text-lg">Historial de Recesos</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[200px]">
          <BarChart data={chartData} barSize={15}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
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
            <Bar 
              dataKey="recesos" 
              fill="var(--color-recesos)" 
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};