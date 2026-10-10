import { z } from 'zod';

const category = z.enum(['goods', 'works', 'services', 'consultancy']);

const method = z.enum([
  'open-tender',
  'selective-tender',
  'direct-procurement',
  'request-for-quotation',
]);

const contractItem = z.object({
  description: z.string().trim().min(1, 'Describe the deliverable'),
  quantity: z.coerce
    .number()
    .int('Quantity must be a whole number')
    .positive('Quantity must be greater than zero'),
  unit: z.string().trim().min(1, 'Unit is required'),
});

export const contractFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  description: z
    .string()
    .trim()
    .min(20, 'Describe what you need done or supplied (min. 20 characters)'),
  category,
  method,
  department: z.string().min(1, 'Select a department'),
  budget: z.coerce
    .number()
    .positive('Estimated value must be greater than zero'),
  submissionDeadline: z
    .string()
    .min(1, 'Set a submission deadline')
    .refine(
      (value) => !Number.isNaN(Date.parse(value)) && value > today(),
      'Deadline must be a future date',
    ),
  items: z.array(contractItem).min(1, 'Add at least one deliverable'),
  publish: z.boolean(),
});

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

export type ContractFormValues = z.infer<typeof contractFormSchema>;

export const adjustmentSchema = z.object({
  note: z
    .string()
    .trim()
    .min(10, 'Explain the adjustment you are requesting (min. 10 characters)'),
});

export type AdjustmentFormValues = z.infer<typeof adjustmentSchema>;

export const uploadDocumentSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  fileName: z.string().trim().min(1, 'Attach a file'),
  kind: z.enum([
    'tender-notice',
    'bill-of-quantities',
    'agreement',
    'addendum',
    'other',
  ]),
});

export type UploadDocumentFormValues = z.infer<typeof uploadDocumentSchema>;
