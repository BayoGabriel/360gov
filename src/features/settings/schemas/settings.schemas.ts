import { z } from 'zod';

export const BIO_MAX_LENGTH = 400;

export const profileFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required'),
  lastName: z.string().trim().min(1, 'Last name is required'),
  email: z
    .string()
    .trim()
    .min(1, 'Email address is required')
    .email('Enter a valid email address'),
  title: z.string().trim().min(1, 'Title is required'),
  department: z.string().min(1, 'Select a department'),
  timeZone: z.string().min(1, 'Select a time zone'),
  bio: z
    .string()
    .trim()
    .max(
      BIO_MAX_LENGTH,
      `Bio must be ${BIO_MAX_LENGTH} characters or fewer`,
    ),
  notificationsMuted: z.boolean(),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;
