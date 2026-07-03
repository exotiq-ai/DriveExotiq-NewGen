'use client';

/**
 * RentHeader — Minimal branded header for rent.driveexotiq.com
 * 
 * Lighter than the main site header. Logo links back to driveexotiq.com.
 * Optionally displays fleet location badge.
 */

interface RentHeaderProps {
  /** Short location string, e.g. "Phoenix, AZ" */
  location?: string;
}

export default function RentHeader({ location }: RentHeaderProps) {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-deep-black/80 backdrop-blur-xl border-b border-white/10 supports-[backdrop-filter]:bg-deep-black/60">
      <nav className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo — links to main site */}
          <a
            href="https://driveexotiq.com"
            className="flex items-center gap-2 group transition-opacity duration-200 hover:opacity-90"
            aria-label="Drive Exotiq"
          >
            <img
              src="/images/logos/drive-exotiq-lockup-transparent.png"
              alt="Drive Exotiq"
              className="h-7 sm:h-8 md:h-9 lg:h-10 w-auto object-contain"
              loading="eager"
              decoding="async"
            />
          </a>

          {/* Right side — location badge + back link */}
          <div className="flex items-center gap-4">
            {location && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gulf-blue" />
                <span className="text-xs font-medium text-metallic-silver uppercase tracking-wide-exotiq">
                  {location}
                </span>
              </div>
            )}
            <a
              href="https://driveexotiq.com"
              className="text-xs text-metallic-silver/60 hover:text-gulf-blue transition-colors duration-200"
            >
              driveexotiq.com
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
