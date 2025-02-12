
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const PlaceholderCard = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Próximamente</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground">
        Contenido en desarrollo
      </CardContent>
    </Card>
  );
};
