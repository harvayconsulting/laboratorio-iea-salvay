import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from './Menu';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { NBUForm } from '@/components/nbu/NBUForm';
import { NBUHistory } from '@/components/nbu/NBUHistory';
import { CurrentNBUTable } from '@/components/nbu/CurrentNBUTable';

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
    <div className="min-h-screen flex bg-white">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <NBUForm />
          <CurrentNBUTable />
          <NBUHistory />
        </div>
      </main>
    </div>
  );
};

export default NBU;