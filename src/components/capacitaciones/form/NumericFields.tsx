import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CapacitacionFormValues } from "../types";

interface NumericFieldsProps {
  form: UseFormReturn<CapacitacionFormValues>;
}

export function NumericFields({ form }: NumericFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="cantidad_horas"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Cantidad de Horas</FormLabel>
            <FormControl>
              <Input type="number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="costo"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Costo</FormLabel>
            <FormControl>
              <Input type="number" step="0.01" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}