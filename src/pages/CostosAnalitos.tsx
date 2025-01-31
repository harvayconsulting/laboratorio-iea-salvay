import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';

const CostosAnalitos = () => {
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
            <h1 className="text-2xl font-bold">Costos Analitos</h1>
            <div className="flex justify-end">
              <Button asChild variant="outline">
                <Link to="/menu">Volver al Menú</Link>
              </Button>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default CostosAnalitos;