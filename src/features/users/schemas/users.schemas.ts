import { z } from 'zod';

const role = z.enum(['admin', 'super-admin', 'member'], {
  errorMap: () => ({ message: 'Select a role' }),
});

export const addUserSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address'),
  role,
  department: z.string().min(1, 'Select a department'),
  accessLevel: z.string().min(1, 'Select an access level'),
});

export const deactivateSchema = z.object({
  reasonTitle: z.string().trim().min(1, 'Reason title is required'),
  description: z.string().trim().min(1, 'Description is required'),
});

export type AddUserFormValues = z.infer<typeof addUserSchema>;
export type DeactivateFormValues = z.infer<typeof deactivateSchema>;
