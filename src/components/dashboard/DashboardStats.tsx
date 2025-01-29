import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useQuery } from '@tanstack/react-query';
import { getRecesos } from '@/lib/supabase';
import { calculateDays } from '@/lib/dates';

export const DashboardStats = () => {
  const { data: recesos } = useQuery({
    queryKey: ['recesos'],
    queryFn: getRecesos,
  });

  const stats = {
    Mickaela: { total: 21, taken: 15, remaining: 6 },
    Sasha: { total: 21, taken: 14, remaining: 7 },
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