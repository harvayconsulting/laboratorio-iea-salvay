import * as z from "zod";

export const capacitacionFormSchema = z.object({
  nombre_curso: z.string().min(1, "El nombre del curso es requerido"),
  programa: z.string().optional(),
  entidad: z.string().min(1, "La entidad es requerida"),
  documentacion_impacto: z.string().optional(),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
  fecha_conclusion: z.string().optional().superRefine((fecha_conclusion, ctx) => {
    if (!fecha_conclusion) return;

    const formData = ctx.parent;
    const fecha_inicio = formData.fecha_inicio;
    
    if (!fecha_inicio) return;

    if (new Date(fecha_conclusion) < new Date(fecha_inicio)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "La fecha de conclusión no puede ser anterior a la fecha de inicio",
      });
    }
  }),
  cantidad_horas: z.string().optional(),
  costo: z.string().optional(),
  estado: z.enum(["Pendiente", "En curso", "Concluido", "Cancelado"]),
});

export type CapacitacionFormValues = z.infer<typeof capacitacionFormSchema>;