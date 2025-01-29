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
    <header className="flex justify-between items-center p-4 border-b">
      <div className="flex items-center space-x-4">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <span className="text-muted-foreground">
          Bienvenido, {user?.user_name}
        </span>
      </div>
      <Button variant="outline" onClick={handleLogout}>
        Cerrar Sesión
      </Button>
    </header>
  );
};