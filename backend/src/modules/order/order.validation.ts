import { z } from "zod";
import mongoose from "mongoose";

export const createOrderSchema = z.object({
  addressId: z
    .string()
    .refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: "Invalid address ID",
    }),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;