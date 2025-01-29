import { Header } from '@/components/layout/Header';
import { DashboardStats } from '@/components/dashboard/DashboardStats';
import { RecesosTable } from '@/components/dashboard/RecesosTable';
import { RecesosChart } from '@/components/dashboard/RecesosChart';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

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
            <h1 className="text-2xl font-bold">Gestión de Recesos</h1>
            <div className="grid gap-4 md:grid-cols-2">
              <DashboardStats />
              <RecesosChart />
            </div>
            <RecesosTable />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;