import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { capacitacionFormSchema, type CapacitacionFormValues } from "./schema";
import { useCapacitacionForm } from "./useCapacitacionForm";
import { BasicInfoSection, DatesSection, DetailsSection, ImpactSection } from "./FormSections";

export function CapacitacionForm() {
  const form = useForm<CapacitacionFormValues>({
    resolver: zodResolver(capacitacionFormSchema),
    defaultValues: {
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

  const { createCapacitacion, isPending } = useCapacitacionForm(form.reset);

  function onSubmit(values: CapacitacionFormValues) {
    createCapacitacion(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <BasicInfoSection form={form} />
          <DatesSection form={form} />
          <DetailsSection form={form} />
        </div>

        <ImpactSection form={form} />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Guardando..." : "Guardar Capacitación"}
        </Button>
      </form>
    </Form>
  );
}