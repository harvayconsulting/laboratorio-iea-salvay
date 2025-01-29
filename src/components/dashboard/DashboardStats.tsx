import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getRecesos } from '@/lib/supabase';
import { calculateDays } from '@/lib/dates';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';
import { useMemo } from 'react';

interface UserStats {
  total: number;
  taken: number;
  remaining: number;
}

interface StatsMap {
  [key: string]: UserStats;
}

interface MonthlyData {
  month: string;
  [key: string]: string | number;
}

export const DashboardStats = () => {
  const { data: recesos } = useQuery({
    queryKey: ['recesos'],
    queryFn: getRecesos,
  });

  const stats = useMemo<StatsMap>(() => {
    if (!recesos) return {};

    const userStats: StatsMap = {};
    const totalDays = 21; // Días totales por usuario

    recesos.forEach((receso) => {
      const userName = receso.user?.user_name;
      if (!userName) return;

      if (!userStats[userName]) {
        userStats[userName] = { total: totalDays, taken: 0, remaining: totalDays };
      }

      const days = calculateDays(receso.start_date, receso.end_date);
      userStats[userName].taken += days;
      userStats[userName].remaining = totalDays - userStats[userName].taken;
    });

    return userStats;
  }, [recesos]);

  const chartData = useMemo<MonthlyData[]>(() => {
    if (!recesos) return [];

    const monthlyData: { [key: string]: { [key: string]: number } } = {};
    
    recesos.forEach((receso) => {
      const startDate = new Date(receso.start_date);
      const month = startDate.toLocaleString('es-AR', { month: 'long' });
      const userName = receso.user?.user_name;
      if (!userName) return;

      if (!monthlyData[month]) {
        monthlyData[month] = {};
      }

      const days = calculateDays(receso.start_date, receso.end_date);
      
      if (!monthlyData[month][userName]) {
        monthlyData[month][userName] = 0;
      }
      
      monthlyData[month][userName] += days;
    });

    return Object.entries(monthlyData).map(([month, users]) => ({
      month,
      ...users
    }));
  }, [recesos]);

  const chartConfig = {
    Mickaela: {
      label: "Mickaela",
      color: "hsl(var(--chart-1))"
    },
    Sasha: {
      label: "Sasha",
      color: "hsl(var(--chart-2))"
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2">
        {Object.entries(stats).map(([name, stat]) => (
          <Card key={name}>
            <CardHeader>
              <CardTitle>{name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Días totales:</span>
                  <span>{stat.total}</span>
                </div>
                <div className="flex justify-between">
                  <span>Días tomados:</span>
                  <span>{stat.taken}</span>
                </div>
                <div className="flex justify-between">
                  <span>Días restantes:</span>
                  <span>{stat.remaining}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Distribución de Recesos por Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px] mt-4">
            <BarChart data={chartData}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="Mickaela" fill="var(--color-Mickaela)" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Sasha" fill="var(--color-Sasha)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};