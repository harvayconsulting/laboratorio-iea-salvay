
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';

interface NotificationSettings {
  id: string;
  is_active: boolean;
  notification_email: string | null;
}

export const NotificationsCard = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(false);

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_notifications')
        .select('*')
        .maybeSingle();

      if (error) {
        console.error('Error fetching notification settings:', error);
        throw error;
      }
      return data as NotificationSettings;
    },
    enabled: !!user && user.user_type === 'admin',
  });

  useEffect(() => {
    if (settings) {
      setIsActive(settings.is_active || false);
      setEmail(settings.notification_email || '');
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async ({ isActive, email }: { isActive: boolean; email: string }) => {
      if (!settings?.id) {
        throw new Error('No notification settings found');
      }

      const { data, error } = await supabase
        .from('email_notifications')
        .update({
          is_active: isActive,
          notification_email: email,
          updated_at: new Date().toISOString(),
        })
        .eq('id', settings.id)
        .select()
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notification-settings'] });
      toast({
        title: 'Éxito',
        description: 'Configuración de notificaciones actualizada',
      });
    },
    onError: (error) => {
      console.error('Error updating notification settings:', error);
      toast({
        title: 'Error',
        description: 'No se pudo actualizar la configuración',
        variant: 'destructive',
      });
    },
  });

  if (!user || user.user_type !== 'admin') {
    return null;
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error al cargar la configuración</div>;
  }

  const handleSwitchChange = async (checked: boolean) => {
    setIsActive(checked);
    mutation.mutate({ isActive: checked, email });
  };

  const handleEmailChange = async (newEmail: string) => {
    setEmail(newEmail);
    mutation.mutate({ isActive, email: newEmail });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notificaciones</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <Label htmlFor="notifications-active">Activar/Desactivar Notificaciones</Label>
          <Switch
            id="notifications-active"
            checked={isActive}
            onCheckedChange={handleSwitchChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="notification-email">Email para notificaciones</Label>
          <Input
            id="notification-email"
            type="email"
            placeholder="ejemplo@dominio.com"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            disabled={!isActive}
          />
        </div>
      </CardContent>
    </Card>
  );
};
