'use client';

import Link from 'next/link';

interface SmsConsentCheckboxesProps {
  register: (name: 'smsTransactionalConsent' | 'smsMarketingConsent') => Record<string, unknown>;
  variant?: 'dark' | 'light';
}

export default function SmsConsentCheckboxes({
  register,
  variant = 'dark',
}: SmsConsentCheckboxesProps) {
  const textColor = variant === 'dark' ? 'text-ink-2' : 'text-gray-600';
  const linkColor = 'text-gulf hover:text-gulf-2';
  const checkboxBg = variant === 'dark' ? 'bg-surface border-line' : 'bg-white border-gray-300';
  const labelColor = variant === 'dark' ? 'text-ink-3' : 'text-gray-500';

  return (
    <div className="space-y-3">
      {/* Transactional SMS Consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          {...register('smsTransactionalConsent')}
          type="checkbox"
          className={`mt-0.5 h-4 w-4 ${checkboxBg} rounded-sm flex-shrink-0 cursor-pointer accent-gulf`}
        />
        <span className={`text-xs leading-relaxed ${textColor}`}>
          I consent to receive transactional text messages from{' '}
          <strong>Drive Exotiq</strong> at the phone number provided (e.g.,
          booking confirmations, reminders, account alerts). Message frequency
          may vary. Message &amp; data rates may apply. Reply HELP for help or
          STOP to opt out.
        </span>
      </label>

      {/* Marketing SMS Consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          {...register('smsMarketingConsent')}
          type="checkbox"
          className={`mt-0.5 h-4 w-4 ${checkboxBg} rounded-sm flex-shrink-0 cursor-pointer accent-gulf`}
        />
        <span className={`text-xs leading-relaxed ${textColor}`}>
          I consent to receive marketing and promotional text messages from{' '}
          <strong>Drive Exotiq</strong> at the phone number provided. Message
          frequency may vary. Message &amp; data rates may apply. Reply HELP for
          help or STOP to opt out.
        </span>
      </label>

      {/* Policy links */}
      <p className={`text-xs ${labelColor} pt-1`}>
        <Link href="/privacy" className={`underline ${linkColor}`}>
          Privacy Policy
        </Link>
        {' · '}
        <Link href="/terms" className={`underline ${linkColor}`}>
          Terms of Service
        </Link>
        {' · '}
        <Link href="/sms" className={`underline ${linkColor}`}>
          SMS Policy
        </Link>
      </p>
    </div>
  );
}
