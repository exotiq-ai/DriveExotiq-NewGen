import { analyticsAdminPath, analyticsPath } from '@/lib/analytics-privacy';
import { createCampaignAttribution } from '@/lib/analytics-attribution';
import type { Ga4Context } from '@/lib/ga4-protocol';
export type GoogleCommand = (...args: unknown[]) => void;
type State = { production: boolean; preview: boolean; consent: boolean; origin: string; pathname: string; search: string };

export function createGa4Runtime(id: string | undefined, state: () => State, load: () => Promise<GoogleCommand>, disable: (value: boolean) => void) {
  let command: GoogleCommand | undefined, loading: Promise<void> | undefined, configured = false, lastPath = '';
  const campaign = createCampaignAttribution();
  const eligible = () => !!id && /^G-[A-Z0-9]+$/.test(id) && state().production && !state().preview && state().consent
    && ['https://driveexotiq.com', 'https://www.driveexotiq.com'].includes(state().origin) && !analyticsAdminPath(state().pathname);
  const stop = () => { disable(true); lastPath = ''; };
  const sync = async () => {
    if (!eligible()) { stop(); if (!state().consent) campaign.clear(); return; }
    if (!command) {
      if (!loading) loading = load().then(value => { command = value; }).catch(() => {}).finally(() => { loading = undefined; });
      await loading;
    }
    if (!eligible() || !command) { stop(); return; }
    disable(false);
    const tags = campaign.capture(state().search);
    const path = analyticsPath(state().pathname);
    const page = { page_location: `${state().origin}${path}`, page_referrer: '', page_title: `Drive Exotiq ${path}` };
    if (!configured) {
      command('consent', 'default', { analytics_storage: 'granted', ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' });
      command('js', new Date());
      command('config', id, { ...page, send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        cookie_expires: 60 * 60 * 24 * 90, cookie_update: false,
        campaign_source: tags.utm_source || '', campaign_medium: tags.utm_medium || '',
        campaign_name: tags.utm_campaign || '', campaign_content: tags.utm_content || '',
      });
      configured = true;
    }
    if (lastPath !== path) {
      command('event', 'page_view', { ...page, ...tags, send_to: id });
      lastPath = path;
    }
  };
  const get = (field: string) => new Promise<unknown>(resolve => {
    const timer = setTimeout(() => resolve(undefined), 500);
    try { command?.('get', id, field, (value: unknown) => { clearTimeout(timer); resolve(value); }); }
    catch { clearTimeout(timer); resolve(undefined); }
  });
  return { sync, stop, formStart(form: unknown) {
    if (eligible() && configured && command && ['apply', 'waitlist', 'sponsor'].includes(String(form))) {
      command('event', 'form_start', { form_name: form, page_location: `${state().origin}${analyticsPath(state().pathname)}`, page_referrer: '', ...campaign.properties(), send_to: id });
    }
  }, async context(): Promise<Ga4Context | undefined> {
    // Forms never trigger a tracker load or fabricate identifiers to bypass blocking.
    if (!eligible() || !configured || !command) return undefined;
    const [clientId, sessionId] = await Promise.all([get('client_id'), get('session_id')]);
    if (!eligible() || typeof clientId !== 'string' || !/^\d{1,20}\.\d{1,20}$/.test(clientId) || !/^\d{1,16}$/.test(String(sessionId))) return undefined;
    return { consent: true, clientId, sessionId: String(sessionId), campaign: campaign.properties() };
  } };
}
