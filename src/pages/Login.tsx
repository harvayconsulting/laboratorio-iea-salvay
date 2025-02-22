import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/lib/auth';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/menu');
    }
  }, [user, navigate]);

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
              Inicia sesión para continuar
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
};

export default Login;