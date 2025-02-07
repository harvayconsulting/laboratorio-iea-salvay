
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Book, ChartBar, Activity, Users, Package, MessageSquare, Database, Megaphone, User, GraduationCap, CalendarDays, LogOut, Settings2 } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

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
                onClick={link.href ? undefined : (e: React.MouseEvent) => e.preventDefault()}
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
    <div className="min-h-screen flex bg-white">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <p className="text-[1.1rem] text-muted-foreground">
              Sistema para la Administración del
            </p>
            <h1 className="text-2xl font-bold tracking-tighter mb-8">
              Laboratorio IEA Salvay
            </h1>
            <img 
              src="/lovable-uploads/10bff8d8-807c-4618-a09c-4db8ab362ee6.png" 
              alt="Logo IEA Salvay" 
              className="h-36 w-auto mx-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
