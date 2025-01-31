import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Book, ChartBar, Activity, Users, Package, MessageSquare, Database, Megaphone, User, GraduationCap, CalendarDays } from 'lucide-react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';

const Menu = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const links = [
    {
      label: "Reporte Jornada",
      href: "/reporte-jornada",
      icon: <Book className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Costos Analitos",
      href: "/costos-analitos",
      icon: <ChartBar className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Actividades Periódicas",
      href: "/actividades",
      icon: <Activity className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Pacientes",
      href: "/pacientes",
      icon: <Users className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Control Stock",
      href: "/control-stock",
      icon: <Package className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Respuestas Formularios",
      href: "/respuestas",
      icon: <MessageSquare className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "NBU",
      href: "/nbu",
      icon: <Database className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Marketing",
      href: "/marketing",
      icon: <Megaphone className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Obras Sociales",
      href: "/obras-sociales",
      icon: <User className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Capacitaciones",
      href: "/capacitaciones",
      icon: <GraduationCap className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    },
    {
      label: "Recesos",
      href: "/recesos",
      icon: <CalendarDays className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
    }
  ];

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-[#FFCCCB]">
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <img 
              src="/lovable-uploads/10bff8d8-807c-4618-a09c-4db8ab362ee6.png" 
              alt="Logo IEA Salvay" 
              className="h-36 w-auto mx-auto mb-8"
            />
            <div className="flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <main className="flex-1 p-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <p className="text-[1.1rem] text-muted-foreground">
              Sistema para la Administración del
            </p>
            <h1 className="text-2xl font-bold tracking-tighter">
              Laboratorio IEA Salvay
            </h1>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Menu;