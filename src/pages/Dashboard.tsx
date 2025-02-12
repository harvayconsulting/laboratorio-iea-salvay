import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Book, ChartBar, Activity, Users, Package, MessageSquare, Database, Megaphone, User, GraduationCap, CalendarDays, LogOut, Settings2 } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { RecesosChart } from '@/components/recesos/RecesosChart';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MenuLink {
  label: string;
  href?: string;
  icon: React.ReactNode;
}

export const AppSidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const availableLinks: MenuLink[] = [
    {
      label: "Capacitaciones",
      href: "/capacitaciones",
      icon: <GraduationCap className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Recesos",
      href: "/recesos",
      icon: <CalendarDays className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    }
  ];

  const adminOnlyLinks: MenuLink[] = [
    {
      label: "NBU",
      href: "/nbu",
      icon: <Database className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Administrador",
      href: "/administracion",
      icon: <Settings2 className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    }
  ];

  const disabledLinks: MenuLink[] = [
    {
      label: "Reporte Jornada",
      icon: <Book className="text-gray-300 h-5 w-5" />
    },
    {
      label: "Costos Analitos",
      icon: <ChartBar className="text-gray-300 h-5 w-5" />
    },
    {
      label: "Actividades Periódicas",
      icon: <Activity className="text-gray-300 h-5 w-5" />
    },
    {
      label: "Pacientes",
      icon: <Users className="text-gray-300 h-5 w-5" />
    },
    {
      label: "Control Stock",
      icon: <Package className="text-gray-300 h-5 w-5" />
    },
    {
      label: "Respuestas Formularios",
      icon: <MessageSquare className="text-gray-300 h-5 w-5" />
    },
    {
      label: "Marketing",
      icon: <Megaphone className="text-gray-300 h-5 w-5" />
    },
    {
      label: "Obras Sociales",
      icon: <User className="text-gray-300 h-5 w-5" />
    }
  ];

  const links = [
    ...availableLinks,
    ...(user?.user_type === 'admin' ? adminOnlyLinks : []),
    ...disabledLinks
  ];

  const preventDefaultClick = () => {
    // Empty function that takes no parameters
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="flex flex-col justify-between h-full">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col items-center mb-12">
            <motion.div 
              className="px-4 py-3 text-sm text-neutral-700 h-[42px] flex items-center"
              animate={{
                opacity: open ? 1 : 0,
              }}
            >
              {open ? `Bienvenido, ${user?.user_name}` : '\u00A0'}
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={{
                  label: link.label,
                  href: link.href || '#',
                  icon: link.icon
                }}
                className={cn(
                  !link.href && "text-gray-300 cursor-not-allowed hover:bg-transparent"
                )}
                onClick={link.href ? undefined : preventDefaultClick}
              />
            ))}
          </div>
        </div>
        <div className="mt-auto">
          <SidebarLink 
            link={{
              label: "Cerrar Sesión",
              href: "#",
              icon: <LogOut className="text-red-600 h-5 w-5" />
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
            onClick={handleLogout}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Query para obtener las capacitaciones
  const { data: capacitaciones } = useQuery({
    queryKey: ['capacitaciones-dashboard'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ieasalvay_capacitaciones')
        .select(`
          *,
          user:user_id (
            user_name
          )
        `);
      
      if (error) throw error;
      return data;
    },
  });

  // Procesar datos para el gráfico de capacitaciones
  const capacitacionesData = capacitaciones?.reduce((acc: any[], cap: any) => {
    const month = new Date(cap.fecha_inicio).toLocaleDateString('es-AR', { month: 'short' });
    const userName = cap.user?.user_name.toLowerCase();

    const existingMonth = acc.find(item => item.month === month);
    if (existingMonth) {
      existingMonth[userName] = (existingMonth[userName] || 0) + 1;
    } else {
      acc.push({
        month,
        [userName]: 1,
      });
    }
    return acc;
  }, []) || [];

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-white">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Frame 1: Gráfico de Recesos */}
            <Card>
              <CardHeader>
                <CardTitle>Recesos por Usuario</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <RecesosChart />
              </CardContent>
            </Card>

            {/* Frame 2: Gráfico de Capacitaciones */}
            <Card>
              <CardHeader>
                <CardTitle>Capacitaciones por Usuario</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={capacitacionesData}>
                    <XAxis 
                      dataKey="month"
                      tick={{ fontSize: 12 }}
                      interval={0}
                    />
                    <YAxis
                      tick={{ fontSize: 12 }}
                      label={{ 
                        value: 'Cantidad', 
                        angle: -90, 
                        position: 'insideLeft',
                        style: { fontSize: 12 }
                      }}
                    />
                    <Tooltip />
                    <Legend />
                    <Bar
                      dataKey="mickaela"
                      name="Mickaela"
                      fill="hsl(var(--chart-1))"
                      radius={[4, 4, 0, 0]}
                    />
                    <Bar
                      dataKey="sasha"
                      name="Sasha"
                      fill="hsl(var(--chart-2))"
                      radius={[4, 4, 0, 0]}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Frame 3: Placeholder para futuros gráficos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximamente</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Contenido en desarrollo
              </CardContent>
            </Card>

            {/* Frame 4: Placeholder para futuros gráficos */}
            <Card>
              <CardHeader>
                <CardTitle>Próximamente</CardTitle>
              </CardHeader>
              <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
                Contenido en desarrollo
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
