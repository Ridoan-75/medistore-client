import { z } from 'zod'

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name is too long'),
  phone: z
    .string()
    .regex(/^(\+880)?[0-9]{10,11}$/, 'Invalid phone number'),
  address: z
    .string()
    .min(10, 'Address must be at least 10 characters')
    .max(200, 'Address is too long'),
  city: z
    .string()
    .min(2, 'City is required'),
  postalCode: z
    .string()
    .regex(/^[0-9]{4}$/, 'Postal code must be 4 digits'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>