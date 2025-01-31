import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from './Menu';
import { DashboardStats as RecesosStats } from '@/components/recesos/RecesosStats';
import { RecesosTable } from '@/components/recesos/RecesosTable';
import { RecesosChart } from '@/components/recesos/RecesosChart';

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
          <div className="grid gap-4 md:grid-cols-2">
            <RecesosStats />
            <RecesosChart />
          </div>
          <RecesosTable />
        </div>
      </main>
    </div>
  );
};

export default Recesos;