import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecesosTable } from '@/components/dashboard/RecesosTable';
import { RequestForm } from '@/components/dashboard/RequestForm';
import { useAuth } from '@/lib/auth';
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
    <div className="min-h-screen bg-[#ffebee]">
      <div className="max-w-[1600px] mx-auto px-[100px] py-4">
        <div className="bg-white rounded-lg shadow-lg">
          <Header />
          <main className="p-6 space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-6">
                <DashboardStats />
                {user.user_type === 'bioquimica' && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Solicitar Receso</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <RequestForm />
                    </CardContent>
                  </Card>
                )}
              </div>
              {user.user_type === 'bioquimica' && (
                <div>
                  <RecesosChart />
                </div>
              )}
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Registros de Recesos</CardTitle>
              </CardHeader>
              <CardContent>
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