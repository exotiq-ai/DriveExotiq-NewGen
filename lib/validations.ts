import * as z from 'zod';
import { INTEREST_VALUES } from '@/lib/interest';

export const applicationSchema = z.object({
  interest: z.enum(INTEREST_VALUES).default('access'),
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  currentCity: z.string().min(2, 'Current city is required'),
  cityOfInterest: z.string().min(2, 'Tell us where you would drive'),
  briefIntro: z
    .string()
    .min(10, 'A sentence is plenty. Tell us what you drive (minimum 10 characters)')
    .max(200, 'Maximum 200 characters'),
  inviteCode: z.string().optional(),
  agreedToTerms: z.boolean().refine(val => val === true, {
    message: 'You must agree to the terms',
  }),
  smsTransactionalConsent: z.boolean().optional().default(false),
  smsMarketingConsent: z.boolean().optional().default(false),
});

export type ApplicationFormData = z.infer<typeof applicationSchema>;

// Booking lead schema — Welcome Gate form
export const bookingLeadSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number').max(20),
  smsTransactionalConsent: z.boolean().optional().default(false),
  smsMarketingConsent: z.boolean().optional().default(false),
});

export type BookingLeadFormData = z.infer<typeof bookingLeadSchema>;

// Marketplace waitlist — exotiq.rent (copy brief §10.3 / CMP-FORM-WAITLIST)
export const waitlistSchema = z.object({
  email: z.string().email('Valid email is required'),
  city: z.string().max(120).optional().or(z.literal('')),
  desiredCar: z.string().max(200).optional().or(z.literal('')),
});

export type WaitlistFormData = z.infer<typeof waitlistSchema>;
