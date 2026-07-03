'use client';

export default function RentFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-deep-black border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 py-8 lg:py-10">
        {/* Main footer content */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Powered by */}
          <div className="flex items-center gap-3">
            <img
              src="/images/logos/drive-exotiq-lockup-transparent.png"
              alt="Drive Exotiq"
              className="h-5 sm:h-6 w-auto object-contain opacity-60"
            />
          </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-xs text-metallic-silver/50">
            <a
              href="https://driveexotiq.com"
              className="hover:text-gulf-blue transition-colors"
            >
              driveexotiq.com
            </a>
            <a
              href="https://driveexotiq.com/privacy"
              className="hover:text-metallic-silver transition-colors"
            >
              Privacy
            </a>
            <a
              href="https://driveexotiq.com/terms"
              className="hover:text-metallic-silver transition-colors"
            >
              Terms
            </a>
            <a
              href="https://driveexotiq.com/sms"
              className="hover:text-metallic-silver transition-colors"
            >
              SMS Policy
            </a>
            <button
              onClick={() => window.dispatchEvent(new Event('open-cookie-settings'))}
              className="hover:text-metallic-silver transition-colors"
            >
              Cookie Settings
            </button>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-6 pt-4 border-t border-white/5 text-center">
          <p className="text-xs text-metallic-silver/30">
            &copy; {year} Exotiq Inc. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
