import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecesosTable } from '@/components/dashboard/RecesosTable';
import { RequestForm } from '@/components/dashboard/RequestForm';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RecesosChart } from '@/components/dashboard/RecesosChart';

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
    <div className="min-h-screen bg-[#ffebee] w-full">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="bg-white rounded-lg shadow-lg">
          <Header />
          <main className="p-4 sm:p-6 space-y-4 sm:space-y-6">
            <div className="flex justify-end">
              <Button asChild variant="outline">
                <Link to="/menu">Volver al Menú</Link>
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DashboardStats />
              {user.user_type === 'admin' && <RecesosChart />}
              {user.user_type === 'bioquimica' && <RecesosChart />}
            </div>
            {user.user_type === 'bioquimica' && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Solicitar Receso</CardTitle>
                </CardHeader>
                <CardContent>
                  <RequestForm />
                </CardContent>
              </Card>
            )}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Registros de Recesos</CardTitle>
              </CardHeader>
              <CardContent className="p-2 sm:p-4">
                <RecesosTable />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;