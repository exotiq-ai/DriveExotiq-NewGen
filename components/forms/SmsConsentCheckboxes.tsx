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
    <fieldset className="astra-sms-consent min-w-0 space-y-4 border-0 p-0">
      <legend className={`mb-4 text-sm font-medium ${textColor}`}>Optional text updates</legend>
      {/* Transactional SMS Consent */}
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          {...register('smsTransactionalConsent')}
          type="checkbox"
          className={`mt-0.5 h-5 w-5 ${checkboxBg} rounded-sm flex-shrink-0 cursor-pointer accent-gulf`}
        />
        <span className={`text-sm leading-relaxed ${textColor}`}>
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
          className={`mt-0.5 h-5 w-5 ${checkboxBg} rounded-sm flex-shrink-0 cursor-pointer accent-gulf`}
        />
        <span className={`text-sm leading-relaxed ${textColor}`}>
          I consent to receive marketing and promotional text messages from{' '}
          <strong>Drive Exotiq</strong> at the phone number provided. Message
          frequency may vary. Message &amp; data rates may apply. Reply HELP for
          help or STOP to opt out.
        </span>
      </label>

      {/* Policy links */}
      <p className={`text-sm ${labelColor} pt-1`}>
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
    </fieldset>
  );
}
