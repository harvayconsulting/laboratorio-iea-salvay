import { LoginForm } from '@/components/auth/LoginForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-[#FFCCCB]">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8">
        <div className="flex flex-col items-center space-y-6">
          <img src="/logo.png" alt="Logo IEA Salvay" className="h-16" />
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