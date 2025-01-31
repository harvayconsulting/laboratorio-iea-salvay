import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { CapacitacionFormValues } from "../types";

interface BasicInfoFieldsProps {
  form: UseFormReturn<CapacitacionFormValues>;
}

export function BasicInfoFields({ form }: BasicInfoFieldsProps) {
  return (
    <>
      <FormField
        control={form.control}
        name="nombre_curso"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Curso</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="programa"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Programa</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="entidad"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Entidad</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="nombre_profesional"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Nombre del Profesional</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
}