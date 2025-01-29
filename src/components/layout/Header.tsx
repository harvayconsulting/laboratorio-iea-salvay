import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate } from 'react-router-dom';

export const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <header className="flex flex-col space-y-2 sm:space-y-4 p-3 sm:p-4 border-b">
      <div className="flex items-center space-x-2 sm:space-x-4">
        <img 
          src="/lovable-uploads/10bff8d8-807c-4618-a09c-4db8ab362ee6.png" 
          alt="Logo IEA Salvay" 
          className="h-8 sm:h-12 w-auto" 
        />
        <h2 className="text-base sm:text-xl font-semibold">Laboratorio IEA Salvay</h2>
      </div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-2 sm:space-y-0">
        <h1 className="text-xl sm:text-2xl font-bold">Administración de Recesos</h1>
        <div className="flex items-center justify-between sm:space-x-4">
          <span className="text-sm sm:text-base text-muted-foreground">
            Bienvenido, {user?.user_name}
          </span>
          <Button variant="outline" size="sm" className="ml-2" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};