import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Recesos from "./pages/Recesos";
import NotFound from "./pages/NotFound";
import NBU from "./pages/NBU";
import Menu from "./pages/Menu";
import Pacientes from "./pages/Pacientes";
import Capacitaciones from "./pages/Capacitaciones";
import ReporteJornada from "./pages/ReporteJornada";
import CostosAnalitos from "./pages/CostosAnalitos";
import Actividades from "./pages/Actividades";
import ControlStock from "./pages/ControlStock";
import Respuestas from "./pages/Respuestas";
import Marketing from "./pages/Marketing";
import ObrasSociales from "./pages/ObrasSociales";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/recesos" element={<Recesos />} />
          <Route path="/nbu" element={<NBU />} />
          <Route path="/pacientes" element={<Pacientes />} />
          <Route path="/capacitaciones" element={<Capacitaciones />} />
          <Route path="/reporte-jornada" element={<ReporteJornada />} />
          <Route path="/costos-analitos" element={<CostosAnalitos />} />
          <Route path="/actividades" element={<Actividades />} />
          <Route path="/control-stock" element={<ControlStock />} />
          <Route path="/respuestas" element={<Respuestas />} />
          <Route path="/marketing" element={<Marketing />} />
          <Route path="/obras-sociales" element={<ObrasSociales />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;