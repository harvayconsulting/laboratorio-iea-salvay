import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from '@/components/layout/AppSidebar';

const Actividades = () => {
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
          <h1 className="text-2xl font-bold mb-6">Actividades Periódicas</h1>
        </div>
      </main>
    </div>
  );
};

export default Actividades;
