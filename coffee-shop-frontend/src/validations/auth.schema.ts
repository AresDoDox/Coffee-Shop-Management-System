import { z } from 'zod';
import type { TFunction } from 'i18next';

export const createLoginSchema = (t: TFunction) => {
  return z.object({
    email: z
      .string()
      .min(1, { message: t('validation:email_required') })
      .email({ message: t('validation:email_invalid') }),
    password: z
      .string()
      .min(1, { message: t('validation:password_required') })
      .min(6, { message: t('validation:min_length', { min: 6 }) }),
  });
};

export const createRegisterSchema = (t: TFunction) => {
  return z.object({
    name: z.string().min(1, { message: t('validation:name_required') }),
    email: z
      .string()
      .min(1, { message: t('validation:email_required') })
      .email({ message: t('validation:email_invalid') }),
    password: z
      .string()
      .min(1, { message: t('validation:password_required') })
      .min(6, { message: t('validation:min_length', { min: 6 }) }),
  });
};

export type LoginSchema = z.infer<ReturnType<typeof createLoginSchema>>;
export type RegisterSchema = z.infer<ReturnType<typeof createRegisterSchema>>;
