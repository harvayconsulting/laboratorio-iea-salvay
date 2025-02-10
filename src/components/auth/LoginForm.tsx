
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { getUser } from '@/lib/supabase';
import { useAuth } from '@/lib/auth';
import { Toaster } from '@/components/ui/toaster';

export const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { setUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user = await getUser(username, password);
      if (user) {
        setUser(user);
        toast({
          title: 'Bienvenido',
          description: 'Inicio de sesión exitoso',
          style: { background: '#F2FCE2', border: '1px solid #c1e1b9' },
          duration: 3000,
        });
        navigate('/dashboard');
      } else {
        toast({
          title: 'Error',
          description: 'Usuario o contraseña incorrectos',
          style: { background: '#ea384c', color: 'white' },
          duration: 3000,
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Credenciales inválidas',
        style: { background: '#ea384c', color: 'white' },
        duration: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <div className="space-y-2">
          <Input
            type="text"
            placeholder="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <Input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </form>
      <Toaster />
    </>
  );
};
