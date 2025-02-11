
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { capacitacionFormSchema, type CapacitacionFormValues } from "./schema";
import { useCapacitacionForm } from "./useCapacitacionForm";
import { BasicInfoSection, DatesSection, DetailsSection, ImpactSection } from "./FormSections";

interface CapacitacionFormProps {
  initialData?: CapacitacionFormValues;
  onSubmit?: (data: CapacitacionFormValues) => void;
  onCancel?: () => void;
}

export function CapacitacionForm({ initialData, onSubmit, onCancel }: CapacitacionFormProps) {
  const form = useForm<CapacitacionFormValues>({
    resolver: zodResolver(capacitacionFormSchema),
    defaultValues: initialData || {
      nombre_curso: "",
      programa: "",
      entidad: "",
      documentacion_impacto: "",
      fecha_inicio: "",
      fecha_conclusion: "",
      cantidad_horas: "",
      costo: "",
      estado: "Pendiente",
    },
  });

  const { createCapacitacion, isPending: isCreating } = useCapacitacionForm(form.reset);

  function handleSubmit(values: CapacitacionFormValues) {
    if (onSubmit) {
      onSubmit(values);
    } else {
      createCapacitacion(values);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <BasicInfoSection form={form} />
        <DatesSection form={form} />
        <DetailsSection form={form} />
        <ImpactSection form={form} />

        <div className="flex justify-end gap-4">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button type="submit" disabled={isCreating}>
            {initialData ? "Guardar Cambios" : isCreating ? "Guardando..." : "Guardar Capacitación"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
