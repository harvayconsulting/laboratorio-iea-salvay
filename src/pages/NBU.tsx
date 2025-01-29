import { Header } from '@/components/layout/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth';
import { useNavigate, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { NBUForm } from '@/components/nbu/NBUForm';
import { Button } from '@/components/ui/button';

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
            <div className="flex justify-end">
              <Button asChild variant="outline">
                <Link to="/menu">Volver al Menú</Link>
              </Button>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg sm:text-xl">Gestión de NBU</CardTitle>
              </CardHeader>
              <CardContent>
                <NBUForm />
              </CardContent>
            </Card>
          </main>
        </div>
      </div>
    </div>
  );
};

export default NBU;