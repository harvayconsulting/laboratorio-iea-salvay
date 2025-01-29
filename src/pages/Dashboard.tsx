import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecesosTable } from '@/components/dashboard/RecesosTable';
import { RequestForm } from '@/components/dashboard/RequestForm';
import { useAuth } from '@/lib/auth';

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
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto p-4 space-y-6">
        <DashboardStats />
        {user.user_type === 'bioquimica' && (
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">Solicitar Receso</h2>
            <RequestForm />
          </div>
        )}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Registros de Recesos</h2>
          <RecesosTable />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;