/**
 * Explicit build-time switch for the isolated preview. Set this for both the
 * Next build and server/function runtime; production leaves it unset.
 * Keep the direct env reference so Next also inlines it in client components.
 */
export const isPreview = process.env.NEXT_PUBLIC_SITE_MODE === 'preview';

/**
 * Form submissions stay write-free on preview builds unless operators
 * explicitly enable the server and client with NEXT_PUBLIC_FORM_MODE=live.
 * Indexing, middleware, and admin isolation continue to use isPreview.
 */
export const isFormPreview =
  isPreview && process.env.NEXT_PUBLIC_FORM_MODE !== 'live';

export const formSubmissionStatus = isFormPreview ? 'preview' : 'stored';
