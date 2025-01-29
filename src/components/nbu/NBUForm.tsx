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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type InsuranceProvider = Database['public']['Enums']['insurance_provider'];

const formSchema = z.object({
  provider: z.custom<InsuranceProvider>(),
  value: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "El valor debe ser un número positivo",
  }),
  effective_date: z.string(),
});

const INSURANCE_PROVIDERS = [
  'AVALIAN',
  'APROSS',
  'CAJA_ABOGADOS',
  'CAJA_NOTARIAL',
  'CPCE',
  'DASPU',
  'FEDERADA_1',
  'FEDERADA_2_3_4000',
  'JERARQUICOS_PMO',
  'JERARQUICOS_ALTA_FRECUENCIA',
  'GALENO',
  'MEDIFE',
  'MUTUAL_TAXI',
  'NOBIS',
  'OMINT',
  'OSDE',
  'PAMI_1EROS_6_',
  'PAMI (7MO_ADELANTE)',
  'PARTICULARES_BAJA',
  'PARTICULARES_ALTA',
  'PREVENCIÓN_A1_A2',
  'PREVENCIÓN_A3_A6',
  'SANCOR_500',
  'SANCOR_1000',
  'SIPSSA',
  'SWISS_MEDICAL'
] as const;

export function NBUForm() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: "" as InsuranceProvider,
      value: "",
      effective_date: new Date().toISOString().split('T')[0],
    },
  });

  const { mutate: createNBU, isPending } = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data, error } = await supabase
        .from('ieasalvay_nbu')
        .insert({
          provider: values.provider,
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
      queryClient.invalidateQueries({ queryKey: ['nbu'] });
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="provider"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prestador</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione un prestador" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {INSURANCE_PROVIDERS.map((provider) => (
                    <SelectItem key={provider} value={provider}>
                      {provider.replace(/_/g, ' ')}
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
  );
}