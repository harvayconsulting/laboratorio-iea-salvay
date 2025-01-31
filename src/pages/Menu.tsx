import { useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { 
  FileText, 
  DollarSign, 
  Calendar, 
  Box, 
  GraduationCap, 
  MessageSquare,
  Activity,
  Users,
  Megaphone,
  Building
} from 'lucide-react';

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
        <div className="flex flex-col items-center space-y-3">
          <img 
            src="/lovable-uploads/10bff8d8-807c-4618-a09c-4db8ab362ee6.png" 
            alt="Logo IEA Salvay" 
            className="h-36" 
          />
          <div className="space-y-2 text-center">
            <p className="text-base text-muted-foreground">
              Sistema para la Administración del
            </p>
            <h1 className="text-2xl font-bold tracking-tighter">
              Laboratorio IEA Salvay
            </h1>
          </div>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 mt-6">
            {/* Columna 1 */}
            <div className="space-y-4">
              <Button asChild variant="default" className="w-48">
                <Link to="/reporte-jornada" className="flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Reporte Jornada
                </Link>
              </Button>
              
              <Button asChild variant="default" className="w-48">
                <Link to="/costos" className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4" />
                  Costos Determinaciones
                </Link>
              </Button>
              
              <Button asChild variant="default" className="w-48">
                <Link to="/actividades" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Actividades Periódicas
                </Link>
              </Button>
              
              <Button asChild variant="default" className="w-48">
                <Link to="/stock" className="flex items-center gap-2">
                  <Box className="h-4 w-4" />
                  Control Stock
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
                  <Calendar className="h-4 w-4" />
                  Recesos
                </Link>
              </Button>
              
              <Button asChild variant="default" className="w-48">
                <Link to="/formularios" className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Respuestas Formularios
                </Link>
              </Button>
            </div>
            
            {/* Columna 2 */}
            <div className="space-y-4">
              <Button asChild variant="default" className="w-48">
                <Link to="/nbu" className="flex items-center gap-2">
                  <Activity className="h-4 w-4" />
                  NBU
                </Link>
              </Button>
              
              <Button asChild variant="default" className="w-48">
                <Link to="/pacientes" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Pacientes
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
                  <Building className="h-4 w-4" />
                  Obras Sociales
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