import { z } from "zod";

export const productSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),

  // Numeric values ko string se number convert karenge
  sellingPrice: z.coerce.number().min(1, "Price is required"),
  oldPrice: z.coerce.number().optional(),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),

  // Relations
  categoryId: z.string().uuid("Category is required"),
  subCategoryId: z.string().uuid().optional().nullable(),
  brandId: z.string().uuid().optional().nullable(),

  // Images (Abhi ke liye text URL input, baad mein upload logic add karenge)
  thumbnailUrl: z.string().url("Valid Thumbnail URL is required"),
  additionalImages: z.array(z.string()).optional(),

  // Arrays
  sizes: z.string().optional(), // Comma separated string lenge user se, phir array banayenge
  colors: z
    .array(
      z.object({
        name: z.string(),
        hex: z.string().regex(/^#/, "Must be a valid hex code"),
      }),
    )
    .optional(),

  isFeatured: z.boolean().default(false),
});

export type ProductSchema = z.infer<typeof productSchema>;
