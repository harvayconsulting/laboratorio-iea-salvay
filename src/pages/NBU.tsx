import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const NBU = () => {
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
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Gestión de NBU</CardTitle>
              </CardHeader>
              <CardContent>
                {/* NBU form will be implemented here */}
                <p>Formulario de NBU en desarrollo</p>
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NBU;