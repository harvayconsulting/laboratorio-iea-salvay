import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Book, ChartBar, Activity, Users, Package, MessageSquare, Database, Megaphone, User, GraduationCap, CalendarDays, LogOut } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export const AppSidebar = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  const links = [
    {
      label: "Reporte Jornada",
      href: "/reporte-jornada",
      icon: <Book className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Costos Analitos",
      href: "/costos-analitos",
      icon: <ChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Actividades Periódicas",
      href: "/actividades",
      icon: <Activity className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Pacientes",
      href: "/pacientes",
      icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Control Stock",
      href: "/control-stock",
      icon: <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Respuestas Formularios",
      href: "/respuestas",
      icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "NBU",
      href: "/nbu",
      icon: <Database className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Marketing",
      href: "/marketing",
      icon: <Megaphone className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
    },
    {
      label: "Obras Sociales",
      href: "/obras-sociales",
      icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5" />
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

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="flex flex-col justify-between h-full">
        <div className="flex flex-col flex-1">
          <div className="flex flex-col items-center mb-12">
            <motion.div 
              className="px-4 py-3 text-sm text-neutral-700"
              animate={{
                display: open ? 'block' : 'none',
                opacity: open ? 1 : 0,
              }}
            >
              Bienvenido, {user?.user_name}
            </motion.div>
            {/* Add empty line when collapsed */}
            <motion.div 
              className="px-4 py-3 text-sm text-neutral-700"
              animate={{
                display: !open ? 'block' : 'none',
                opacity: !open ? 1 : 0,
              }}
            >
              &nbsp;
            </motion.div>
          </div>
          <div className="flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink key={idx} link={link} />
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