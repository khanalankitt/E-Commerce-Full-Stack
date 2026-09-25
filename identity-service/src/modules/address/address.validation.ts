import { z } from "zod";

export const createAddressSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is too short").max(100),
  phoneNumber: z
    .string()
    .trim()
    .regex(/^(98|97)\d{8}$/, "Enter a valid Nepali phone number"),
  email: z.string().trim().toLowerCase().email("Enter a valid email"),
  city: z.string().trim().min(2, "City is required").max(50),
  area: z.string().trim().min(2, "Area/locality is required").max(100),
  fullAddress: z.string().trim().min(5, "Full address is too short").max(300),
  isDefaultShippingAddress: z.boolean().optional().default(false),
});

export const updateAddressSchema = createAddressSchema.partial();

export type CreateAddressInput = z.infer<typeof createAddressSchema>;
export type UpdateAddressInput = z.infer<typeof updateAddressSchema>;
