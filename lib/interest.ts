/**
 * One-contact funnel intent (copy brief §4).
 *
 * Single source of truth for the `interest` tag that flows:
 *   /apply select (or ?interest= deep-link)  →  zod enum  →  de_applications.interest
 *   →  admin triage email subject  →  /thank-you branched copy.
 */

export const INTEREST_VALUES = [
  'access',
  'drives',
  'title-wrap',
  'tour',
  'drive',
  'partnership',
  'other',
] as const;

export type Interest = (typeof INTEREST_VALUES)[number];

/**
 * The five options shown in the /apply select. Labels are law (copy brief §4.2).
 * The three sponsor tiers collapse to one lightweight "sponsor" lane here — the
 * real tier choice lives on /sponsor (CMP-FORM-SPONSOR).
 */
export const APPLY_INTEREST_OPTIONS: { value: Interest; label: string }[] = [
  { value: 'access', label: 'Rent — first keys to the fleet' },
  { value: 'drives', label: 'The drives and Cars & Coffee' },
  { value: 'title-wrap', label: 'Sponsor the wrap (Title/Wrap · Tour · Drive)' },
  { value: 'partnership', label: 'Event partnership' },
  { value: 'other', label: 'Something else' },
];

/** Short label per raw enum value — used in the admin triage email subject. */
export const INTEREST_LABEL: Record<Interest, string> = {
  access: 'Rent / fleet access',
  drives: 'The drives',
  'title-wrap': 'Sponsor — Title / Wrap',
  tour: 'Sponsor — Tour',
  drive: 'Sponsor — Drive',
  partnership: 'Event partnership',
  other: 'Something else',
};

/**
 * Collapse any inbound ?interest= value onto one of the five /apply options so
 * the native select can display it. Sponsor tiers (tour/drive/title-wrap) all
 * map to the single sponsor option; unknown values fall back to access.
 */
export function normalizeApplyInterest(raw: string | undefined | null): Interest {
  const v = (raw || '').trim().toLowerCase();
  switch (v) {
    case 'drives':
      return 'drives';
    case 'title-wrap':
    case 'tour':
    case 'drive':
    case 'sponsor':
    case 'wrap':
      return 'title-wrap';
    case 'partnership':
    case 'partner':
      return 'partnership';
    case 'other':
      return 'other';
    case 'access':
    case 'rent':
    case 'waitlist':
    default:
      return 'access';
  }
}
