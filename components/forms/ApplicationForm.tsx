'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Textarea from '@/components/ui/Textarea';
import SmsConsentCheckboxes from '@/components/forms/SmsConsentCheckboxes';
import { applicationSchema, ApplicationFormData } from '@/lib/validations';

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  });

  const onSubmit = async (data: ApplicationFormData) => {
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Application API error:', err);
        alert('There was an error submitting your application. Please try again.');
        return;
      }

      router.push('/thank-you');
    } catch (error) {
      console.error('Error submitting application:', error);
      alert('There was an error submitting your application. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm sm:text-base font-medium text-pure-white mb-2">
          Full Name *
        </label>
        <Input
          {...register('fullName')}
          type="text"
          id="fullName"
          placeholder="First and last name"
          autoComplete="name"
          error={errors.fullName?.message}
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm sm:text-base font-medium text-pure-white mb-2">
          Email Address *
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
        <label htmlFor="phone" className="block text-sm sm:text-base font-medium text-pure-white mb-2">
          Phone Number *
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

      {/* Current City */}
      <div>
        <label htmlFor="currentCity" className="block text-sm sm:text-base font-medium text-pure-white mb-2">
          Current City *
        </label>
        <Input
          {...register('currentCity')}
          type="text"
          id="currentCity"
          placeholder="Where are you located?"
          autoComplete="address-level2"
          error={errors.currentCity?.message}
        />
      </div>

      {/* City of Interest */}
      <div>
        <label htmlFor="cityOfInterest" className="block text-sm sm:text-base font-medium text-pure-white mb-2">
          City of Interest *
        </label>
        <select
          {...register('cityOfInterest')}
          id="cityOfInterest"
          className="w-full px-4 py-4 sm:py-3 bg-graphite text-pure-white border border-metallic-silver/30 rounded-md focus:outline-none focus:border-gulf-blue transition-colors text-base min-h-[48px] touch-manipulation"
        >
          <option value="">Select a city</option>
          <option value="Denver">Denver</option>
          <option value="Scottsdale">Scottsdale</option>
          <option value="Miami">Miami</option>
          <option value="Other">Other</option>
        </select>
        {errors.cityOfInterest && (
          <p className="mt-2 text-sm text-performance-orange">{errors.cityOfInterest.message}</p>
        )}
      </div>

      {/* Brief Intro */}
      <div>
        <label htmlFor="briefIntro" className="block text-sm sm:text-base font-medium text-pure-white mb-2">
          Why Drive Exotiq? *
        </label>
        <Textarea
          {...register('briefIntro')}
          id="briefIntro"
          rows={5}
          maxLength={200}
          placeholder="Tell us briefly why you want to join the community (max 200 characters)"
          error={errors.briefIntro?.message}
        />
      </div>

      {/* Invite Code (Optional) */}
      <div>
        <label htmlFor="inviteCode" className="block text-sm sm:text-base font-medium text-pure-white mb-2">
          Invite Code (Optional)
        </label>
        <Input
          {...register('inviteCode')}
          type="text"
          id="inviteCode"
          placeholder="Have a referral code?"
          autoComplete="off"
        />
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start gap-3">
        <input
          {...register('agreedToTerms')}
          type="checkbox"
          id="agreedToTerms"
          className="mt-1 h-5 w-5 sm:h-4 sm:w-4 bg-graphite border-metallic-silver/30 rounded focus:ring-gulf-blue touch-manipulation flex-shrink-0"
        />
        <label htmlFor="agreedToTerms" className="text-sm sm:text-base text-metallic-silver">
          I agree to the Drive Exotiq{' '}
          <Link href="/terms" className="text-gulf-blue underline hover:text-gulf-blue/80">
            Terms of Service
          </Link>{' '}
          and{' '}
          <Link href="/privacy" className="text-gulf-blue underline hover:text-gulf-blue/80">
            Privacy Policy
          </Link>{' '}
          *
        </label>
      </div>
      {errors.agreedToTerms && (
        <p className="text-sm text-performance-orange mt-1">{errors.agreedToTerms.message}</p>
      )}

      {/* SMS Consent Checkboxes */}
      <SmsConsentCheckboxes
        register={register}
        variant="dark"
      />

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Submitting...' : 'Submit Application'}
      </Button>
    </form>
  );
}
