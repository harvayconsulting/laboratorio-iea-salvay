import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { CapacitacionFormValues } from "./schema";

interface FormSectionProps {
  form: UseFormReturn<CapacitacionFormValues>;
}

export const BasicInfoSection = ({ form }: FormSectionProps) => (
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
            <Textarea {...field} />
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
  </>
);

export const DatesSection = ({ form }: FormSectionProps) => (
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

export const DetailsSection = ({ form }: FormSectionProps) => (
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

    <FormField
      control={form.control}
      name="estado"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Estado</FormLabel>
          <Select onValueChange={field.onChange} defaultValue={field.value}>
            <FormControl>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un estado" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectItem value="Pendiente">Pendiente</SelectItem>
              <SelectItem value="En curso">En curso</SelectItem>
              <SelectItem value="Concluido">Concluido</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  </>
);

export const ImpactSection = ({ form }: FormSectionProps) => (
  <FormField
    control={form.control}
    name="documentacion_impacto"
    render={({ field }) => (
      <FormItem>
        <FormLabel>Documentación de Impacto</FormLabel>
        <FormControl>
          <Textarea {...field} />
        </FormControl>
        <FormMessage />
      </FormItem>
    )}
  />
);