import * as z from "zod";

export const capacitacionFormSchema = z.object({
  nombre_curso: z.string().min(1, "El nombre del curso es requerido"),
  programa: z.string().optional(),
  entidad: z.string().min(1, "La entidad es requerida"),
  documentacion_impacto: z.string().optional(),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
  fecha_conclusion: z.string().optional(),
  cantidad_horas: z.string().optional(),
  costo: z.string().optional(),
  estado: z.enum(["Pendiente", "En curso", "Concluido", "Cancelado"]),
}).refine((data) => {
  if (!data.fecha_conclusion) return true;
  
  const fechaInicio = new Date(data.fecha_inicio);
  const fechaConclusion = new Date(data.fecha_conclusion);
  
  return fechaConclusion >= fechaInicio;
}, {
  message: "La fecha de conclusión no puede ser anterior a la fecha de inicio",
  path: ["fecha_conclusion"],
});

export type CapacitacionFormValues = z.infer<typeof capacitacionFormSchema>;