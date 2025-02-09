
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface NotificationSettings {
  id: string;
  is_active: boolean;
  notification_email: string | null;
}

export const NotificationsCard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('');
  const [isActive, setIsActive] = useState(false);

  const { data: settings, isLoading } = useQuery({
    queryKey: ['notification-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_notifications')
        .select('*')
        .single();

      if (error) throw error;
      return data as NotificationSettings;
    },
  });

  useEffect(() => {
    if (settings) {
      setIsActive(settings.is_active || false);
      setEmail(settings.notification_email || '');
    }
  }, [settings]);

  const mutation = useMutation({
    mutationFn: async ({ isActive, email }: { isActive: boolean; email: string }) => {
      const { data, error } = await supabase
        .from('email_notifications')
        .upsert([
          {
            id: settings?.id || undefined,
            is_active: isActive,
            notification_email: email,
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

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

  const handleSwitchChange = async (checked: boolean) => {
    setIsActive(checked);
    mutation.mutate({ isActive: checked, email });
  };

  const handleEmailChange = async (newEmail: string) => {
    setEmail(newEmail);
    mutation.mutate({ isActive, email: newEmail });
  };

  if (isLoading) {
    return <div>Cargando...</div>;
  }

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
