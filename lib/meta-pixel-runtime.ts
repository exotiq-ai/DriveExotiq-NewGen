export type PixelCommand = (...args: unknown[]) => void;
type State = { production: boolean; preview: boolean; consent: boolean; privacySignal?: boolean; origin: string; pathname: string };
const forms: Record<string, string> = { apply: 'community application', waitlist: 'rental marketplace waitlist', sponsor: 'partnership inquiry' };

/** Explicit events only. Loading and every command recheck the current consent. */
export function createMetaPixelRuntime(id: string | undefined, state: () => State, load: () => Promise<PixelCommand>) {
  let pixel: PixelCommand | undefined;
  let loading: Promise<void> | undefined;
  let initialized = false;
  let active = false;
  let lastPath: string | undefined;
  const eligible = () => {
    const s = state();
    let path: string;
    try { path = decodeURIComponent(s.pathname); } catch { return false; }
    return Boolean(id && /^\d{10,20}$/.test(id) && s.production && !s.preview && s.consent && !s.privacySignal &&
      ['https://driveexotiq.com', 'https://www.driveexotiq.com'].includes(s.origin) && !/^\/(admin|api)(\/|$)/i.test(path));
  };
  const stop = () => {
    if (active) pixel?.('consent', 'revoke');
    active = false;
    lastPath = undefined;
  };
  const sync = async () => {
    if (!eligible()) { stop(); return; }
    if (!pixel) {
      if (!loading) loading = load().then(command => { pixel = command; }).catch(() => {}).finally(() => { loading = undefined; });
      await loading;
    }
    if (!eligible() || !pixel) return;
    if (!active) {
      pixel('consent', 'grant');
      if (!initialized) {
        pixel('set', 'autoConfig', false, id);
        pixel('init', id);
        initialized = true;
      }
      active = true;
    }
    if (lastPath !== state().pathname) {
      lastPath = state().pathname;
      pixel('trackSingle', id, 'PageView');
    }
  };
  return {
    sync,
    stop,
    async lead(props: Record<string, unknown>) {
      if (!eligible() || props.status !== 'stored' || typeof props.form !== 'string' || !Object.hasOwn(forms, props.form)) return;
      await sync();
      if (eligible() && active) pixel?.('trackSingle', id, 'Lead', { content_name: forms[props.form as string] });
    },
  };
}
