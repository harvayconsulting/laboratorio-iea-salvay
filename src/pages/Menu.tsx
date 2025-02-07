
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Book, ChartBar, Activity, Users, Package, MessageSquare, Database, Megaphone, User, GraduationCap, CalendarDays, LogOut, Settings2, Menu as MenuIcon, X } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { useIsMobile } from '@/hooks/use-mobile';

export const AppSidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const isMobile = useIsMobile();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const isDisabledLink = (href: string) => {
    if (user?.user_type === 'bioquimica') {
      return !['/capacitaciones', '/recesos'].includes(href);
    }
    return false;
  };

  const links = [
    {
      label: "Reporte Jornada",
      href: "/reporte-jornada",
      icon: <Book className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Costos Analitos",
      href: "/costos-analitos",
      icon: <ChartBar className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Actividades Periódicas",
      href: "/actividades",
      icon: <Activity className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Pacientes",
      href: "/pacientes",
      icon: <Users className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Control Stock",
      href: "/control-stock",
      icon: <Package className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Respuestas Formularios",
      href: "/respuestas",
      icon: <MessageSquare className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Marketing",
      href: "/marketing",
      icon: <Megaphone className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Obras Sociales",
      href: "/obras-sociales",
      icon: <User className="h-5 w-5" />,
      disabled: true
    },
    {
      label: "Capacitaciones",
      href: "/capacitaciones",
      icon: <GraduationCap className="h-5 w-5" />
    },
    {
      label: "Recesos",
      href: "/recesos",
      icon: <CalendarDays className="h-5 w-5" />
    }
  ];

  // Filter out NBU for biochemists and add admin link for admins
  const filteredLinks = links.filter(link => {
    if (user?.user_type === 'bioquimica') {
      return link.href !== '/nbu';
    }
    return true;
  });

  if (user?.user_type === 'admin') {
    filteredLinks.push({
      label: "Administrador",
      href: "/administracion",
      icon: <Settings2 className="h-5 w-5" />
    });
  }

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
            {filteredLinks.map((link, idx) => (
              <SidebarLink 
                key={idx} 
                link={link}
                className={cn(
                  link.disabled && "pointer-events-none text-gray-300",
                  isDisabledLink(link.href) && "pointer-events-none text-gray-300"
                )}
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
      <main className="flex-1 p-4 md:p-8">
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
              className="h-24 md:h-36 w-auto mx-auto"
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;
