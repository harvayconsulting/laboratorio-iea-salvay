import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CapacitacionesTable } from "@/components/capacitaciones/CapacitacionesTable";
import { CapacitacionForm } from "@/components/capacitaciones/CapacitacionForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AppSidebar } from "./Menu";
import { supabase } from "@/integrations/supabase/client";

const Capacitaciones = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error || !user) {
        navigate("/");
      }
    };

    checkUser();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT' || !session) {
        navigate("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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