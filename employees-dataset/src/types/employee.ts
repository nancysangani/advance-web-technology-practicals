import { z } from "zod";

export const employeeSchema = z.object({
  id: z.number().int().positive(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  email: z.string().email(),
  department: z.string().min(1),
  role: z.string().min(1),
  salary: z.number().nonnegative(),
  startDate: z.string().date(),
  isActive: z.boolean(),
});

export const createEmployeeSchema = employeeSchema.omit({ id: true });
export const updateEmployeeSchema = createEmployeeSchema.partial();

export type Employee = z.infer<typeof employeeSchema>;
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
