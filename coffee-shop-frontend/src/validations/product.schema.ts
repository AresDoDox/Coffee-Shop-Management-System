import { z } from 'zod';

export const createProductSchema = (t: (key: string) => string) => {
  return z.object({
    name: z.string().min(1, t('validation:product.name_required')),
    price: z.coerce.number().min(0, t('validation:product.price_min')),
    category: z.string().optional(),
    description: z.string().optional(),
    isAvailable: z.boolean().optional(),
    image: z.any().optional(), 
  });
};

export type ProductSchema = z.infer<ReturnType<typeof createProductSchema>>;
