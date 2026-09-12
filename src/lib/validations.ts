import { z } from 'zod';

export const leadSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120),
  email: z.string().email('Enter a valid email'),
  phone: z.string().max(30).optional(),
  company: z.string().max(120).optional(),
  message: z.string().min(1, 'Message is required').max(4000),
  serviceInterest: z.string().max(120).optional(),
  sourcePath: z.string().max(200).optional(),
  // honeypot — must stay empty, real users never see or fill this field
  company_website: z.string().max(0).optional(),
});
export type LeadInput = z.infer<typeof leadSchema>;

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});
export type LoginInput = z.infer<typeof loginSchema>;
