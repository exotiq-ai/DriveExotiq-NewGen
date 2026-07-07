'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Textarea from '@/components/ui/Textarea';
import Button from '@/components/ui/Button';
import {
  sponsorInquirySchema,
  SponsorInquiryData,
  SPONSOR_TIER_OPTIONS,
  SPONSOR_BUDGET_OPTIONS,
  SponsorTier,
} from '@/lib/sponsor';

const labelClass = 'block text-[13px] tracking-[0.04em] text-ink-2 mb-2';

export default function SponsorInquiryForm({
  defaultInterest = 'not-sure',
}: {
  defaultInterest?: SponsorTier;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SponsorInquiryData>({
    resolver: zodResolver(sponsorInquirySchema),
    defaultValues: { interest: defaultInterest },
  });

  const onSubmit = async (data: SponsorInquiryData) => {
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch('/api/sponsor-inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, website: honeypotRef.current?.value || '' }),
      });
      if (!res.ok) {
        setSubmitError(true);
        return;
      }
      setSubmitted(true);
    } catch (err) {
      console.error('Error submitting sponsor inquiry:', err);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-line rounded-sm bg-surface px-6 py-10 md:px-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gulf" />
          <span className="text-[13px] tracking-[0.04em] text-ink-2">Received</span>
        </div>
        <h3 className="mt-5 font-display text-2xl font-semibold tracking-tight-exotiq text-ink">
          Got it.
        </h3>
        <p className="mt-3 max-w-[42ch] text-[15px] leading-relaxed text-ink-2">
          We&rsquo;ll be in touch within a couple of days. Keep an eye on your inbox.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Honeypot — hidden from humans; bots that fill it are silently dropped server-side. */}
      <input
        ref={honeypotRef}
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute left-[-9999px] h-0 w-0 opacity-0"
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="sp-name" className={labelClass}>
            Your name
          </label>
          <Input
            {...register('name')}
            id="sp-name"
            type="text"
            placeholder="First and last"
            autoComplete="name"
            error={errors.name?.message}
          />
        </div>
        <div>
          <label htmlFor="sp-company" className={labelClass}>
            Company
          </label>
          <Input
            {...register('company')}
            id="sp-company"
            type="text"
            placeholder="Brand or company"
            autoComplete="organization"
            error={errors.company?.message}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="sp-email" className={labelClass}>
            Email address
          </label>
          <Input
            {...register('email')}
            id="sp-email"
            type="email"
            inputMode="email"
            placeholder="you@company.com"
            autoComplete="email"
            error={errors.email?.message}
          />
        </div>
        <div>
          <label htmlFor="sp-phone" className={labelClass}>
            Phone <span className="text-ink-3">(optional)</span>
          </label>
          <Input
            {...register('phone')}
            id="sp-phone"
            type="tel"
            inputMode="tel"
            placeholder="(555) 123-4567"
            autoComplete="tel"
            error={errors.phone?.message}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="sp-interest" className={labelClass}>
            Sponsorship interest
          </label>
          <Select
            {...register('interest')}
            id="sp-interest"
            defaultValue={defaultInterest}
            error={errors.interest?.message}
          >
            {SPONSOR_TIER_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </Select>
        </div>
        <div>
          <label htmlFor="sp-budget" className={labelClass}>
            Budget range <span className="text-ink-3">(optional)</span>
          </label>
          <Select {...register('budget')} id="sp-budget" defaultValue="">
            <option value="">Select a range</option>
            {SPONSOR_BUDGET_OPTIONS.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </Select>
        </div>
      </div>

      <div>
        <label htmlFor="sp-message" className={labelClass}>
          Anything else? <span className="text-ink-3">(optional)</span>
        </label>
        <Textarea
          {...register('message')}
          id="sp-message"
          rows={4}
          maxLength={1000}
          placeholder="Tell us a little about your brand and which tier fits."
          error={errors.message?.message}
        />
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Start a sponsorship conversation'}
        </Button>
        {submitError && (
          <p className="mt-3 text-sm text-papaya" role="alert">
            Something didn&rsquo;t go through. Try again?
          </p>
        )}
        <p className="mt-4 text-[13px] text-ink-3">
          We never sell your info. A real person reads every note.
        </p>
      </div>
    </form>
  );
}
