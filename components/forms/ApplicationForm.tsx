'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import SmsConsentCheckboxes from '@/components/forms/SmsConsentCheckboxes';
import { applicationSchema, ApplicationFormData } from '@/lib/validations';
import { APPLY_INTEREST_OPTIONS, Interest } from '@/lib/interest';

const labelClass = 'block text-[13px] tracking-[0.04em] text-ink-2 mb-2';

export default function ApplicationForm({
  defaultInterest = 'access',
}: {
  defaultInterest?: Interest;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Belt-and-suspenders (deck §5.3): the controlled select must never hold a
  // value with no matching <option> (e.g. a sponsor tier that slipped past the
  // ApplyPage redirect guard). Fall back to 'access'.
  const safeInterest: Interest = APPLY_INTEREST_OPTIONS.some(
    (o) => o.value === defaultInterest
  )
    ? defaultInterest
    : 'access';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: { interest: safeInterest },
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);
    setSubmitError(false);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: honeypotRef.current?.value || '' }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Application API error:', err);
        setSubmitError(true);
        return;
      }

      router.push(`/thank-you?interest=${encodeURIComponent(data.interest)}`);
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      {/* What brings you here — the one-contact intent tag */}
      <div>
        <label htmlFor="interest" className={labelClass}>
          What brings you here?
        </label>
        <Select
          {...register('interest')}
          id="interest"
          defaultValue={safeInterest}
          error={errors.interest?.message}
        >
          {APPLY_INTEREST_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
        {/* Sponsor off-ramp (deck §7.3) — the select no longer carries a
            sponsor lane, so intent gets a visible door to the real form. */}
        <p className="mt-3 text-[13px] leading-relaxed text-ink-3">
          Sponsoring the wrap?{' '}
          <Link
            href="/sponsor"
            className="text-ink underline underline-offset-2 transition-colors duration-250 hover:text-gulf"
          >
            Start here
          </Link>
          .
        </p>
      </div>

      {/* Full name */}
      <div>
        <label htmlFor="fullName" className={labelClass}>
          Full name
        </label>
        <Input
          {...register('fullName')}
          type="text"
          id="fullName"
          placeholder="First and last"
          autoComplete="name"
          error={errors.fullName?.message}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className={labelClass}>
          Email address
        </label>
        <Input
          {...register('email')}
          type="email"
          id="email"
          inputMode="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
        />
      </div>

      {/* Phone */}
      <div>
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>
        <Input
          {...register('phone')}
          type="tel"
          id="phone"
          inputMode="tel"
          placeholder="(555) 123-4567"
          autoComplete="tel"
          error={errors.phone?.message}
        />
      </div>

      {/* Current city + city of interest */}
      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="currentCity" className={labelClass}>
            Current city
          </label>
          <Input
            {...register('currentCity')}
            type="text"
            id="currentCity"
            placeholder="Where you're based"
            autoComplete="address-level2"
            error={errors.currentCity?.message}
          />
        </div>
        <div>
          <label htmlFor="cityOfInterest" className={labelClass}>
            City you&rsquo;d drive in
          </label>
          <Input
            {...register('cityOfInterest')}
            type="text"
            id="cityOfInterest"
            placeholder="Denver, Austin, Miami…"
            autoComplete="address-level2"
            error={errors.cityOfInterest?.message}
          />
        </div>
      </div>

      {/* What you drive */}
      <div>
        <label htmlFor="briefIntro" className={labelClass}>
          Tell us what you drive
        </label>
        <Textarea
          {...register('briefIntro')}
          id="briefIntro"
          rows={4}
          maxLength={200}
          placeholder="A 2017 Audi S8, daily. Or whatever you actually drive."
          error={errors.briefIntro?.message}
        />
        <p className="mt-2 text-[13px] text-ink-3">
          A sentence is plenty. We care more about the driver than the car.
        </p>
      </div>

      {/* Invite code */}
      <div>
        <label htmlFor="inviteCode" className={labelClass}>
          Invite code <span className="text-ink-3">(optional)</span>
        </label>
        <Input
          {...register('inviteCode')}
          type="text"
          id="inviteCode"
          placeholder="If someone sent you"
          autoComplete="off"
        />
      </div>

      {/* Terms */}
      <div className="flex items-start gap-3">
        <input
          {...register('agreedToTerms')}
          type="checkbox"
          id="agreedToTerms"
          aria-invalid={errors.agreedToTerms ? true : undefined}
          aria-describedby={errors.agreedToTerms ? 'agreedToTerms-error' : undefined}
          className="mt-1 h-5 w-5 sm:h-4 sm:w-4 bg-surface border-line rounded-sm accent-gulf touch-manipulation flex-shrink-0"
        />
        <label htmlFor="agreedToTerms" className="text-sm text-ink-2">
          I agree to the Drive Exotiq{' '}
          <Link href="/terms" className="text-gulf underline hover:text-gulf-2">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-gulf underline hover:text-gulf-2">
            Privacy Policy
          </Link>
          .
        </label>
      </div>
      {errors.agreedToTerms && (
        <p id="agreedToTerms-error" role="alert" className="text-sm text-papaya -mt-2">
          {errors.agreedToTerms.message}
        </p>
      )}

      {/* SMS consent (compliance) */}
      <SmsConsentCheckboxes register={register} variant="dark" />

      {/* Submit */}
      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Get on the list'}
        </Button>
        {submitError && (
          <p className="mt-3 text-sm text-papaya" role="alert">
            Something didn&rsquo;t go through. Try again?
          </p>
        )}
        <p className="mt-4 text-[13px] text-ink-3">
          We never sell your info. One list, no noise.
        </p>
      </div>
    </form>
  );
}
