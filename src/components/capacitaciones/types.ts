import { z } from "zod";

export const capacitacionFormSchema = z.object({
  nombre_curso: z.string().min(1, "El nombre del curso es requerido"),
  programa: z.string().optional(),
  entidad: z.string().min(1, "La entidad es requerida"),
  nombre_profesional: z.string().min(1, "El nombre del profesional es requerido"),
  documentacion_impacto: z.string().optional(),
  fecha_inicio: z.string().min(1, "La fecha de inicio es requerida"),
  fecha_conclusion: z.string().optional(),
  cantidad_horas: z.string()
    .refine(val => !val || (Number(val) >= 0 && Number(val) <= 9999), {
      message: "La cantidad de horas debe ser un número entre 0 y 9999"
    })
    .optional(),
  costo: z.string()
    .refine(val => !val || (Number(val) >= 0 && Number(val) <= 999999.99), {
      message: "El costo debe ser un número entre 0 y 999999.99"
    })
    .optional(),
  estado: z.enum(["Pendiente", "En curso", "Concluido", "Cancelado"]),
});

export type CapacitacionFormValues = z.infer<typeof capacitacionFormSchema>;