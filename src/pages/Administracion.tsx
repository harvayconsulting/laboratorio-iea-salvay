
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { AppSidebar } from './Menu';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserList } from '@/components/admin/UserList';
import { NewUserForm } from '@/components/admin/NewUserForm';
import { NotificationsCard } from '@/components/admin/NotificationsCard';

const Administracion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || user.user_type !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || user.user_type !== 'admin') return null;

  return (
    <div className="min-h-screen flex bg-white">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="container mx-auto space-y-6">
          <h1 className="text-2xl font-bold mb-6">Administración</h1>
          
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestión Usuarios</CardTitle>
              </CardHeader>
              <CardContent>
                <UserList />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Nuevo Usuario</CardTitle>
              </CardHeader>
              <CardContent>
                <NewUserForm />
              </CardContent>
            </Card>

            <NotificationsCard />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Administracion;
