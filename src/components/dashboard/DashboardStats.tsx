import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getRecesos } from '@/lib/supabase';
import { calculateDays } from '@/lib/dates';

interface UserStats {
  total: number;
  taken: number;
  remaining: number;
}

interface StatsMap {
  [key: string]: UserStats;
}

export const DashboardStats = () => {
  const { data: recesos } = useQuery({
    queryKey: ['recesos'],
    queryFn: () => getRecesos(),
  });

  const calculateUserStats = (userName: string): UserStats => {
    if (!recesos) return { total: 0, taken: 0, remaining: 0 };

    const userRecesos = recesos.filter(
      (receso) => receso.user?.user_name.toLowerCase() === userName.toLowerCase()
    );

    const totalDays = userName.toLowerCase() === 'mickaela' ? 12 : 10;
    let takenDays = 0;

    userRecesos.forEach((receso) => {
      if (receso.start_date && receso.end_date) {
        takenDays += calculateDays(receso.start_date, receso.end_date);
      }
    });

    return {
      total: totalDays,
      taken: takenDays,
      remaining: totalDays - takenDays,
    };
  };

  const stats: StatsMap = {
    Mickaela: calculateUserStats('mickaela'),
    Sasha: calculateUserStats('sasha'),
  };

  return (
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
  );
};