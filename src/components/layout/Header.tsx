import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { useNavigate, Link } from 'react-router-dom';

export const Header = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b">
      <div className="flex items-center space-x-4">
        <img 
          src="/lovable-uploads/10bff8d8-807c-4618-a09c-4db8ab362ee6.png" 
          alt="Logo IEA Salvay" 
          className="h-14"
        />
        <h2 className="text-xl font-semibold">Laboratorio IEA Salvay</h2>
      </div>
      <div className="flex items-center space-x-4">
        <span className="text-gray-600">
          Bienvenido, {user?.user_name}
        </span>
        <Button asChild variant="outline">
          <Link to="/menu">Volver al Menú</Link>
        </Button>
        <Button variant="outline" onClick={handleLogout}>
          Cerrar Sesión
        </Button>
      </div>
    </header>
  );
};