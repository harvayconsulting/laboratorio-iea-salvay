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
    <header className="flex flex-col space-y-4 p-4 border-b">
      <div className="flex items-center space-x-4">
        <img src="/logo.png" alt="Logo IEA Salvay" className="h-12" />
        <h2 className="text-xl font-semibold">Laboratorio IEA Salvay</h2>
      </div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Administración de Recesos</h1>
        <div className="flex items-center space-x-4">
          <span className="text-muted-foreground">
            Bienvenido, {user?.user_name}
          </span>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </header>
  );
};