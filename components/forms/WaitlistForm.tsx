'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRef, useState } from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { waitlistSchema, WaitlistFormData } from '@/lib/validations';

const labelClass = 'block text-[13px] tracking-[0.04em] text-ink-2 mb-2';

export default function WaitlistForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const honeypotRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<WaitlistFormData>({ resolver: zodResolver(waitlistSchema) });

  const onSubmit = async (data: WaitlistFormData) => {
    setIsSubmitting(true);
    setSubmitError(false);
    try {
      const res = await fetch('/api/waitlist', {
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
      console.error('Error joining waitlist:', err);
      setSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="border border-line rounded-sm bg-surface px-6 py-8">
        <div className="flex items-center gap-3">
          <span className="h-px w-8 bg-gulf" />
          <span className="text-[13px] tracking-[0.04em] text-ink-2">On the list</span>
        </div>
        <p className="mt-4 max-w-[40ch] text-[15px] leading-relaxed text-ink-2">
          You&rsquo;re on the list. We&rsquo;ll reach out before anyone else gets the keys.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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

      <div>
        <label htmlFor="wl-email" className={labelClass}>
          Email address
        </label>
        <Input
          {...register('email')}
          id="wl-email"
          type="email"
          inputMode="email"
          placeholder="you@example.com"
          autoComplete="email"
          error={errors.email?.message}
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="wl-city" className={labelClass}>
            City <span className="text-ink-3">(optional)</span>
          </label>
          <Input
            {...register('city')}
            id="wl-city"
            type="text"
            placeholder="Denver, Miami…"
            autoComplete="address-level2"
            error={errors.city?.message}
          />
        </div>
        <div>
          <label htmlFor="wl-car" className={labelClass}>
            What would you drive? <span className="text-ink-3">(optional)</span>
          </label>
          <Input
            {...register('desiredCar')}
            id="wl-car"
            type="text"
            placeholder="A weekend in an S8"
            error={errors.desiredCar?.message}
          />
        </div>
      </div>

      <div className="pt-1">
        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full sm:w-auto"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Sending…' : 'Join the waitlist'}
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
