import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CapacitacionFormValues } from "../types";

interface DateFieldsProps {
  form: UseFormReturn<CapacitacionFormValues>;
}

export function DateFields({ form }: DateFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="fecha_inicio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de Inicio</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="fecha_conclusion"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Fecha de Conclusión</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}