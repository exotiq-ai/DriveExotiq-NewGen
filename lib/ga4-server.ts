import 'server-only';
import { isPreview } from '@/lib/preview';
import { deliverGa4Lead, type LeadForm } from '@/lib/ga4-protocol';

export async function recordGa4Lead(context: unknown, form: LeadForm) {
  const result = await deliverGa4Lead({
    production: process.env.NODE_ENV === 'production' && !isPreview && process.env.CONTEXT === 'production',
    measurementId: process.env.NEXT_PUBLIC_GA4_MEASUREMENT_ID,
    secret: process.env.GA4_API_SECRET,
  }, context, form);
  if (result === 'failed') console.warn('GA4 lead delivery failed', { form });
}
