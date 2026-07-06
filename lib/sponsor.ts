import * as z from 'zod';

/**
 * CMP-FORM-SPONSOR (copy brief §9.6). Sponsor tiers are separate from the
 * consumer /apply funnel; this is the wrap-sponsorship inquiry lane.
 */

export type SponsorTier = 'title-wrap' | 'tour' | 'drive' | 'partnership' | 'not-sure';

export const SPONSOR_TIER_OPTIONS: { value: SponsorTier; label: string }[] = [
  { value: 'title-wrap', label: 'Title / Wrap' },
  { value: 'tour', label: 'Tour' },
  { value: 'drive', label: 'Drive' },
  { value: 'partnership', label: 'Event partnership' },
  { value: 'not-sure', label: 'Not sure yet' },
];

export const SPONSOR_TIER_LABEL: Record<SponsorTier, string> = {
  'title-wrap': 'Title / Wrap',
  tour: 'Tour',
  drive: 'Drive',
  partnership: 'Event partnership',
  'not-sure': 'Not sure yet',
};

export const SPONSOR_BUDGET_OPTIONS = [
  'Not sure yet',
  'Under $25k',
  '$25k – $75k',
  '$75k – $150k',
  '$150k+',
] as const;

/** Map an inbound ?interest= value onto a sponsor tier for form preselect. */
export function normalizeSponsorTier(raw: string | undefined | null): SponsorTier {
  const v = (raw || '').trim().toLowerCase();
  switch (v) {
    case 'title-wrap':
    case 'title':
    case 'wrap':
      return 'title-wrap';
    case 'tour':
      return 'tour';
    case 'drive':
      return 'drive';
    case 'partnership':
    case 'partner':
      return 'partnership';
    default:
      return 'not-sure';
  }
}

export const sponsorInquirySchema = z.object({
  name: z.string().min(2, 'Your name is required'),
  company: z.string().max(200).optional().or(z.literal('')),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(30).optional().or(z.literal('')),
  interest: z
    .enum(['title-wrap', 'tour', 'drive', 'partnership', 'not-sure'])
    .default('not-sure'),
  budget: z.string().max(60).optional().or(z.literal('')),
  message: z.string().max(1000).optional().or(z.literal('')),
});

export type SponsorInquiryData = z.infer<typeof sponsorInquirySchema>;
