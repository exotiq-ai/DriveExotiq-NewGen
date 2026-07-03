'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState, useEffect } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import SmsConsentCheckboxes from '@/components/forms/SmsConsentCheckboxes';
import { bookingLeadSchema, BookingLeadFormData } from '@/lib/validations';

interface WelcomeGateProps {
  location?: string;
  /** Fleet slug for attribution tracking (e.g., 'evaccess') */
  fleetSlug?: string;
  onComplete: (data: BookingLeadFormData) => void;
}

export default function WelcomeGate({ location = 'phoenix', fleetSlug, onComplete }: WelcomeGateProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BookingLeadFormData>({
    resolver: zodResolver(bookingLeadSchema),
  });

  const onSubmit = async (data: BookingLeadFormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const sessionId = `bk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const urlParams = new URLSearchParams(window.location.search);

      const response = await fetch('/api/booking-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...data,
          location,
          fleet_slug: fleetSlug || null,
          source_page: window.location.pathname,
          session_id: sessionId,
          utm_source: urlParams.get('utm_source'),
          utm_medium: urlParams.get('utm_medium'),
          utm_campaign: urlParams.get('utm_campaign'),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit');
      }

      sessionStorage.setItem('driveexotiq_lead', JSON.stringify({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        sessionId,
        timestamp: Date.now(),
      }));

      onComplete(data);
    } catch (err) {
      console.error('Welcome gate submission error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-deep-black/90 backdrop-blur-md transition-opacity duration-700 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Content */}
      <div
        className={`relative z-10 w-full max-w-lg mx-4 transition-all duration-700 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}
      >
        {/* Card */}
        <div className="bg-gradient-to-b from-jet-grey to-deep-black border border-metallic-silver/10 rounded-xl p-8 sm:p-10 shadow-2xl shadow-gulf-blue/5">
          {/* Logo mark / accent line */}
          <div className="flex justify-center mb-6">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent via-gulf-blue to-transparent" />
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-h3 text-pure-white mb-3 tracking-tight-exotiq">
              WELCOME TO DRIVE EXOTIQ
            </h2>
            <p className="text-body-sm text-metallic-silver leading-relaxed">
              Let us know who we&apos;re preparing the keys for.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {/* Name Row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label htmlFor="firstName" className="block text-xs font-medium text-metallic-silver/70 mb-1.5 uppercase tracking-wide-exotiq">
                  First Name
                </label>
                <Input
                  {...register('firstName')}
                  type="text"
                  id="firstName"
                  placeholder="John"
                  autoComplete="given-name"
                  autoFocus
                  error={errors.firstName?.message}
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-xs font-medium text-metallic-silver/70 mb-1.5 uppercase tracking-wide-exotiq">
                  Last Name
                </label>
                <Input
                  {...register('lastName')}
                  type="text"
                  id="lastName"
                  placeholder="Smith"
                  autoComplete="family-name"
                  error={errors.lastName?.message}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="gateEmail" className="block text-xs font-medium text-metallic-silver/70 mb-1.5 uppercase tracking-wide-exotiq">
                Email Address
              </label>
              <Input
                {...register('email')}
                type="email"
                id="gateEmail"
                inputMode="email"
                placeholder="you@example.com"
                autoComplete="email"
                error={errors.email?.message}
              />
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="gatePhone" className="block text-xs font-medium text-metallic-silver/70 mb-1.5 uppercase tracking-wide-exotiq">
                Phone Number
              </label>
              <Input
                {...register('phone')}
                type="tel"
                id="gatePhone"
                inputMode="tel"
                placeholder="(555) 123-4567"
                autoComplete="tel"
                error={errors.phone?.message}
              />
            </div>

            {/* SMS Consent Checkboxes */}
            <div className="pt-2">
              <SmsConsentCheckboxes
                register={register}
                variant="dark"
              />
            </div>

            {/* Error message */}
            {error && (
              <p className="text-sm text-performance-orange text-center">{error}</p>
            )}

            {/* Submit */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-pure-white/30 border-t-pure-white rounded-full animate-spin" />
                    Preparing your experience...
                  </span>
                ) : (
                  'View Fleet'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
