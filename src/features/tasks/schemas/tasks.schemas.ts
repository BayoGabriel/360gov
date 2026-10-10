import { z } from 'zod';

const priority = z.enum(['top', 'high', 'medium', 'low', 'in-progress']);

export const taskFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z.string().trim().min(1, 'Description is required'),
  department: z.string().min(1, 'Select a department'),
  assignee: z.string().min(1, 'Select an assignee'),
  attachmentName: z.string().optional(),
  priorities: z.array(priority).min(1, 'Select at least one priority'),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;
