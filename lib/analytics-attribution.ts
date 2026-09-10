/** Fixed campaign labels only: never persist arbitrary query values or visitor IDs. */
const labels: Record<string, ReadonlySet<string>> = {
  utm_source: new Set(['linktree', 'instagram', 'facebook', 'google', 'newsletter', 'business_card']),
  utm_medium: new Set(['referral', 'social', 'organic_social', 'paid_social', 'cpc', 'email', 'qr']),
  utm_campaign: new Set(['profile_hub', 'business_card', 'launch', 'community', 'marketplace']),
  utm_content: new Set(['drivers', 'operators', 'investors']),
};
type Tags = Record<string, string>;
type Storage = Pick<globalThis.Storage, 'getItem' | 'setItem' | 'removeItem'>;
const key = 'driveexotiq_campaign_v1';
const lifetime = 30 * 60 * 1000;

function clean(raw: unknown): Tags {
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return {};
  return Object.fromEntries(Object.entries(raw).filter(([name, value]) => typeof value === 'string' && labels[name]?.has(value)));
}

/** Call capture only with analytics consent; clear on refusal or revocation. */
export function createCampaignAttribution(
  getStorage: () => Storage | undefined = () => typeof window === 'undefined' ? undefined : window.sessionStorage,
  now = Date.now,
) {
  let current: { tags: Tags; expires: number } | undefined;
  const storage = () => { try { return getStorage(); } catch { return undefined; } };
  const clear = () => { current = undefined; try { storage()?.removeItem(key); } catch { /* Storage may be blocked. */ } };
  const properties = (): Tags => {
    if (current && current.expires <= now()) clear();
    return { ...current?.tags };
  };
  return {
    capture(search = '') {
      const params = new URLSearchParams(search);
      const tags = clean(Object.fromEntries(Object.keys(labels).flatMap(name => {
        const values = params.getAll(name);
        return values.length === 1 ? [[name, values[0].toLowerCase()]] : [];
      })));
      if (Object.keys(tags).length) {
        // Last explicitly tagged visit wins; untagged internal navigation preserves it.
        current = { tags, expires: now() + lifetime };
        try { storage()?.setItem(key, JSON.stringify(current)); } catch { /* Keep memory fallback. */ }
      } else if (!current) {
        try {
          const saved = JSON.parse(storage()?.getItem(key) || 'null');
          if (saved && typeof saved.expires === 'number' && saved.expires > now() && saved.expires <= now() + lifetime) {
            current = { tags: clean(saved.tags), expires: saved.expires };
          } else clear();
        } catch { clear(); }
      }
      return properties();
    },
    properties,
    clear,
  };
}
