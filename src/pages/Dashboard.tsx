
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { RecesosChart } from '@/components/recesos/RecesosChart';
import { CapacitacionesChart } from '@/components/capacitaciones/CapacitacionesChart';
import { PlaceholderCard } from '@/components/dashboard/PlaceholderCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
            <CapacitacionesChart />

            {/* Frame 3 & 4: Placeholders */}
            <PlaceholderCard />
            <PlaceholderCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
