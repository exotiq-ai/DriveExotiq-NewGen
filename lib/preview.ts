/**
 * Explicit build-time switch for the isolated preview. Set this for both the
 * Next build and server/function runtime; production leaves it unset.
 * Keep the direct env reference so Next also inlines it in client components.
 */
export const isPreview = process.env.NEXT_PUBLIC_SITE_MODE === 'preview';
