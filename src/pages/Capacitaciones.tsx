import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/auth";
import { CapacitacionesTable } from "@/components/capacitaciones/CapacitacionesTable";
import { CapacitacionForm } from "@/components/capacitaciones/CapacitacionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "./Menu";

const Capacitaciones = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="min-h-screen flex bg-white">
      <AppSidebar />
      <main className="flex-1 p-8">
        <div className="container mx-auto">
          <div className="space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Nueva Capacitación</CardTitle>
              </CardHeader>
              <CardContent>
                <CapacitacionForm />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Historial de Capacitaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <CapacitacionesTable />
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Capacitaciones;