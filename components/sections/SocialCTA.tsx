'use client';

import Button from '@/components/ui/Button';

export default function SocialCTA() {
  return (
    <section className="py-20 lg:py-28 xl:py-32 bg-midnight-blue relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-gulf-blue/5 to-transparent" />
      
      <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
        {/* Section Label */}
        <p className="text-caption text-gulf-blue mb-4">JOIN THE COMMUNITY</p>
        
        {/* Headline */}
        <h2 className="text-h2 text-pure-white mb-6">
          Follow the Journey on Instagram
        </h2>
        
        {/* Body Copy */}
        <p className="text-body-lg text-metallic-silver max-w-2xl mx-auto mb-10">
          Get an insider's look at exotic experiences, member events, and the future 
          of premium mobility. Join our growing community of automotive enthusiasts.
        </p>
        
        {/* Social Link */}
        <div className="flex justify-center">
          <a
            href="https://www.instagram.com/driveexotiq"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <Button variant="primary" size="lg" className="w-full sm:w-auto">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              Follow @driveexotiq
            </Button>
          </a>
        </div>
        
        {/* Social Proof */}
        <div className="mt-12 pt-8 border-t border-metallic-silver/20">
          <p className="text-body-sm text-metallic-silver">
            Join the community redefining exotic car experiences
          </p>
        </div>
      </div>
    </section>
  );
}

