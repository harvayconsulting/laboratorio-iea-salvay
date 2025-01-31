import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ObraSocial {
  id: number;
  nameprovider: string;
}

const formSchema = z.object({
  id_obrasocial: z.string(),
  value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El valor debe ser un número positivo",
  }),
  effective_date: z.string(),
});

export function NBUForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: obrasSociales } = useQuery({
    queryKey: ['obras-sociales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('ieasalvay_obrasocial')
        .select('id, nameprovider')
        .order('nameprovider');
      
      if (error) throw error;
      return data as ObraSocial[];
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id_obrasocial: "",
      value: "",
      effective_date: new Date().toISOString().split('T')[0],
    },
  });

  const { mutate: createNBU, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('ieasalvay_nbu')
        .insert({
          id_obrasocial: Number(values.id_obrasocial),
          value: Number(values.value),
          effective_date: values.effective_date,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "NBU creado",
        description: "El valor de NBU ha sido registrado exitosamente.",
      });
      form.reset();
      queryClient.invalidateQueries({ queryKey: ['nbu-history'] });
      queryClient.invalidateQueries({ queryKey: ['current-nbus'] });
    },
    onError: (error) => {
      console.error('Error creating NBU:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el NBU. Por favor, intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createNBU(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Crear Nuevo NBU</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="id_obrasocial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Obra Social</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccione una obra social" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {obrasSociales?.map((obraSocial) => (
                        <SelectItem key={obraSocial.id} value={obraSocial.id.toString()}>
                          {obraSocial.nameprovider}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="value"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Valor</FormLabel>
                  <FormControl>
                    <Input type="number" step="0.01" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="effective_date"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de vigencia</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Guardando..." : "Guardar NBU"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}