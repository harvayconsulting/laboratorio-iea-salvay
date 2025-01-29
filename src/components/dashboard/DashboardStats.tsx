import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getRecesos } from '@/lib/supabase';
import { calculateDays } from '@/lib/dates';
import { useAuth } from '@/lib/auth';

interface UserStats {
  total: number;
  taken: number;
  remaining: number;
}

interface StatsMap {
  [key: string]: UserStats;
}

export const DashboardStats = () => {
  const { user } = useAuth();
  const { data: recesos } = useQuery({
    queryKey: ['recesos', user?.user_id],
    queryFn: () => getRecesos(user?.user_type, user?.user_id),
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

  const stats: StatsMap = user?.user_type === 'bioquimica' 
    ? { [`Métricas Receso - ${user.user_name}`]: calculateUserStats(user.user_name) }
    : {
        'Métricas Receso - Mickaela': calculateUserStats('mickaela'),
        'Métricas Receso - Sasha': calculateUserStats('sasha'),
      };

  return (
    <div className="grid gap-4">
      {Object.entries(stats).map(([name, stat]) => (
        <Card key={name} className="h-[300px]">
          <CardHeader className="p-4">
            <CardTitle className="text-base sm:text-lg">{name}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 sm:space-y-6 mt-2 sm:mt-4">
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base">Días totales:</span>
                <span className="text-lg sm:text-xl font-semibold">{stat.total}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base">Días tomados:</span>
                <span className="text-lg sm:text-xl font-semibold">{stat.taken}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm sm:text-base">Días restantes:</span>
                <span className="text-lg sm:text-xl font-semibold">{stat.remaining}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};