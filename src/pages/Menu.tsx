import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { CalendarDays, Activity, Users } from 'lucide-react';

const Menu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFCCCB]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <img 
            src="/lovable-uploads/10bff8d8-807c-4618-a09c-4db8ab362ee6.png" 
            alt="Logo IEA Salvay" 
            className="h-24" 
          />
          <div className="space-y-2 text-center">
            <h1 className="text-2xl font-bold tracking-tighter">
              Laboratorio IEA Salvay
            </h1>
            <p className="text-sm text-muted-foreground">
              Menú Principal
            </p>
          </div>
          <div className="flex flex-col items-center w-full space-y-4">
            <Button asChild className="w-48">
              <Link to="/recesos" className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                Recesos
              </Link>
            </Button>
            <Button asChild className="w-48">
              <Link to="/nbu" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                NBU
              </Link>
            </Button>
            <Button asChild className="w-48">
              <Link to="/pacientes" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Pacientes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;