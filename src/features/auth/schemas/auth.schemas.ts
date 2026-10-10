import { z } from 'zod';

export const OTP_LENGTH = 6;

const identifier = z
  .string()
  .trim()
  .min(1, 'Email address or Gov I.D is required');

export const loginSchema = z.object({
  identifier,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean(),
});

export const forgotPasswordSchema = z.object({
  identifier,
});

export const verifyCodeSchema = z.object({
  code: z
    .string()
    .length(OTP_LENGTH, `Enter the ${OTP_LENGTH}-digit code`)
    .regex(/^\d+$/, 'Code must contain digits only'),
});

export const resetPasswordSchema = z
  .object({
    newPassword: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match',
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type VerifyCodeFormValues = z.infer<typeof verifyCodeSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
