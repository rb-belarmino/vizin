import { z } from "zod";

export const RegisterSchema = z.object({
  fullName: z.string().min(2, { message: "Name must be at least 2 characters long." }),
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters long." }),
  apartmentId: z.coerce.number().int().positive({ message: "Invalid apartment number." }),
});

export const LoginSchema = z.object({
  email: z.string().email({ message: "Invalid email format." }),
  password: z.string().min(1, { message: "Password is required." }),
});

export type RegisterSchemaType = z.infer<typeof RegisterSchema>;
export type LoginSchemaType = z.infer<typeof LoginSchema>;
