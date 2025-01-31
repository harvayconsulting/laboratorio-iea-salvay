import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Book, ChartBar, Activity, Users, Package, MessageSquare, Database, Megaphone, User, GraduationCap, CalendarDays } from 'lucide-react';

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
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-2">
          <img 
            src="/lovable-uploads/10bff8d8-807c-4618-a09c-4db8ab362ee6.png" 
            alt="Logo IEA Salvay" 
            className="h-36" // Increased by 50% from h-24
          />
          <div className="space-y-1 text-center">
            <p className="text-[1.1rem] text-muted-foreground"> {/* Increased by 1 point */}
              Sistema para la Administración del
            </p>
            <h1 className="text-2xl font-bold tracking-tighter">
              Laboratorio IEA Salvay
            </h1>
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-2 mt-6">
            {/* Column 1 */}
            <div className="flex flex-col space-y-2">
              <Button asChild variant="default" className="w-48">
                <Link to="/reporte-jornada" className="flex items-center gap-2">
                  <Book className="h-4 w-4" />
                  Reporte Jornada
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/costos-analitos" className="flex items-center gap-2">
                  <ChartBar className="h-4 w-4" />
                  Costos Analitos
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/actividades" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  Actividades Periódicas
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/pacientes" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pacientes
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/control-stock" className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  Control Stock
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/respuestas" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Respuestas Formularios
                </Link>
              </Button>
            </div>
            
            {/* Column 2 */}
            <div className="flex flex-col space-y-2">
              <Button asChild variant="default" className="w-48">
                <Link to="/nbu" className="flex items-center gap-2">
                  <Database className="h-4 w-4" />
                  NBU
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/marketing" className="flex items-center gap-2">
                  <Megaphone className="h-4 w-4" />
                  Marketing
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/obras-sociales" className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Obras Sociales
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/capacitaciones" className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  Capacitaciones
                </Link>
              </Button>
              <Button asChild variant="default" className="w-48">
                <Link to="/recesos" className="flex items-center gap-2">
                  <CalendarDays className="h-4 w-4" />
                  Recesos
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Menu;