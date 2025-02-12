
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from '@/components/layout/AppSidebar';
import { DashboardStats as RecesosStats } from '@/components/recesos/RecesosStats';
import { RecesosTable } from '@/components/recesos/RecesosTable';
import { RecesosChart } from '@/components/recesos/RecesosChart';
import { RequestForm } from '@/components/recesos/RequestForm';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const Recesos = () => {
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
          <h1 className="text-2xl font-bold mb-6">Gestión de Recesos</h1>
          
          {/* Top section with stats and chart */}
          <div className="grid gap-4 md:grid-cols-2 mb-6">
            <RecesosStats />
            <RecesosChart />
          </div>
          
          {/* Request form section */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle>Cargar nuevo receso</CardTitle>
              </CardHeader>
              <CardContent>
                <RequestForm />
              </CardContent>
            </Card>
          </div>
          
          {/* Historical table section */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Histórico de Recesos</CardTitle>
              </CardHeader>
              <CardContent>
                <RecesosTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Recesos;
