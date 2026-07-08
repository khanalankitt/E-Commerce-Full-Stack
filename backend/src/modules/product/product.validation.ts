import { z } from "zod";
import { Types } from "mongoose";

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: "Invalid ObjectId",
});

export const createProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(200, "Product name is too long"),

  description: z
    .string()
    .trim()
    .min(1, "Product description is required")
    .max(2000, "Product description is too long"),

  price: z.number().min(0, "Product price is required"),

  stock: z
    .number()
    .int("Stock must be a whole number")
    .min(0, "Stock cannot be negative")
    .default(0),

  category: objectIdSchema,

  image: z.string().trim().url("Product image is required"),

  isFeatured: z.boolean().default(false),

  rating: z
    .number()
    .min(0, "Rating cannot be below 0")
    .max(5, "Rating cannot exceed 5")
    .default(0),
});

export const updateProductSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().min(1).max(2000).optional(),
    price: z.number().min(0, "Price cannot be negative").optional(),
    stock: z.number().int().min(0, "Stock cannot be negative").optional(),
    category: objectIdSchema.optional(),
    image: z.string().trim().url("Image must be a valid URL").optional(),
    isFeatured: z.boolean().optional(),
    rating: z.number().min(0).max(5).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided to update",
  });

export const getAllProductsSchema = z.object({
  category: objectIdSchema.optional(),
  search: z.string().trim().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  isFeatured: z.enum(["true", "false"]).optional(),
  sort: z
    .enum(["newest", "price-asc", "price-desc", "best-selling"])
    .optional(),
  page: z.coerce.number().int().min(1).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
});

export const objectIdParamSchema = objectIdSchema;

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type GetAllProductsQuery = z.infer<typeof getAllProductsSchema>;
