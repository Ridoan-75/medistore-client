import { z } from 'zod'

export const medicineSchema = z.object({
  name: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name is too long'),
  category: z
    .string()
    .min(1, 'Category is required'),
  manufacturer: z
    .string()
    .min(1, 'Manufacturer is required'),
  price: z
    .string()
    .min(1, 'Price is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: 'Price must be a positive number',
    }),
  stock: z
    .string()
    .min(1, 'Stock is required')
    .refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
      message: 'Stock must be a non-negative number',
    }),
  description: z
    .string()
    .min(10, 'Description must be at least 10 characters')
    .max(1000, 'Description is too long'),
  specifications: z.string().optional(),
})

export type MedicineFormData = z.infer<typeof medicineSchema>