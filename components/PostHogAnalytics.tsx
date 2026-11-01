'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { analyticsAllowed, startPostHog, stopPostHog, capturePageview } from '@/lib/posthog';

/**
 * Mounts PostHog only while the visitor has accepted analytics cookies. Zero
 * markup. Listens for the consent bar's `cookie-consent-changed` event so
 * accept / reject / revoke take effect without a reload, and fires a
 * `$pageview` for every App Router navigation while capturing is on.
 * Every gate (host, GPC/DNT, consent) lives in lib/posthog.ts.
 */
export default function PostHogAnalytics() {
  const pathname = usePathname();
  const [capturing, setCapturing] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const sync = async () => {
      if (analyticsAllowed()) {
        const client = await startPostHog();
        if (!cancelled) setCapturing(client !== null);
      } else {
        stopPostHog();
        if (!cancelled) setCapturing(false);
      }
    };
    void sync();
    window.addEventListener('cookie-consent-changed', sync);
    return () => {
      cancelled = true;
      window.removeEventListener('cookie-consent-changed', sync);
    };
  }, []);

  useEffect(() => {
    if (capturing) capturePageview();
  }, [capturing, pathname]);

  return null;
}
