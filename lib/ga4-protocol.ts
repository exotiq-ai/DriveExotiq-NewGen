import { cleanCampaignTags } from '@/lib/analytics-attribution';
export type Ga4Context = { consent: true; clientId: string; sessionId: string; campaign: Record<string, string> };
export type LeadForm = 'apply' | 'waitlist' | 'sponsor';
export function ga4LeadPayload(raw: unknown, form: LeadForm) {
  if (!raw || typeof raw !== 'object') return null;
  const value = raw as Partial<Ga4Context>;
  if (value.consent !== true || typeof value.clientId !== 'string' || !/^\d{1,20}\.\d{1,20}$/.test(value.clientId)
    || typeof value.sessionId !== 'string' || !/^\d{1,16}$/.test(value.sessionId) || Number(value.sessionId) <= 0) return null;
  return {
    client_id: value.clientId,
    consent: { ad_user_data: 'DENIED', ad_personalization: 'DENIED' },
    events: [{ name: 'generate_lead', params: {
      form_name: form, lead_status: 'stored', session_id: value.sessionId,
      ...cleanCampaignTags(value.campaign),
    } }],
  };
}

/** One best-effort send per fresh insert. No retries that could duplicate a lead event. */
export async function deliverGa4Lead(
  config: { production: boolean; measurementId?: string; secret?: string },
  context: unknown, form: LeadForm, fetcher: typeof fetch = fetch,
): Promise<'disabled' | 'skipped' | 'sent' | 'failed'> {
  if (!config.production || !/^G-[A-Z0-9]+$/.test(config.measurementId || '') || !config.secret) return 'disabled';
  const payload = ga4LeadPayload(context, form);
  if (!payload) return 'skipped';
  try {
    const query = new URLSearchParams({ measurement_id: config.measurementId!, api_secret: config.secret });
    const response = await fetcher(`https://www.google-analytics.com/mp/collect?${query}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(1500), redirect: 'error',
    });
    return response.ok ? 'sent' : 'failed';
  } catch { return 'failed'; } // Never log a URL, payload, credential, or visitor identifiers.
}
