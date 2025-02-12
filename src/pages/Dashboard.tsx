import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { RecesosChart } from '@/components/recesos/RecesosChart';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Query para obtener las capacitaciones
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

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-white">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frame 1: Gráfico de Recesos */}
            <Card>
              <CardHeader>
                <CardTitle>Recesos por Usuario</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <RecesosChart />
              </CardContent>
            </Card>

            {/* Frame 2: Gráfico de Capacitaciones */}
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

            {/* Frame 3: Placeholder para futuros gráficos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximamente</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Contenido en desarrollo
              </CardContent>
            </Card>

            {/* Frame 4: Placeholder para futuros gráficos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximamente</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Contenido en desarrollo
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
