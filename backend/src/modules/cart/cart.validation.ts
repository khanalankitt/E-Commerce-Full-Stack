import { z } from "zod";

export const updateQuantitySchema = z.object({
  quantity: z.number().int().min(1, "Quantity must be at least 1"),
});

export type UpdateQuantityInput = z.infer<typeof updateQuantitySchema>;