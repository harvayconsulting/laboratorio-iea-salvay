
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Book, ChartBar, Activity, Users, Package, MessageSquare, Database, Megaphone, User, GraduationCap, CalendarDays, LogOut, Settings2, LayoutDashboard } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/auth';

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
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
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
