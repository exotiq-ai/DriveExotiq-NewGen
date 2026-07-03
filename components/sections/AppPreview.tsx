import Image from 'next/image';

export default function AppPreview() {
  return (
    <section className="py-20 lg:py-24 bg-jet-grey">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Label */}
        <p className="text-caption text-performance-orange mb-4 text-center">
          COMING Q1 2026
        </p>

        {/* Headline */}
        <h2 className="text-h2 text-pure-white text-center mb-6">
          The Future of Exotic Car Access<br />Lives in Your Pocket
        </h2>

        {/* Subheadline */}
        <p className="text-body text-metallic-silver text-center mb-16 max-w-3xl mx-auto">
          Book exotic experiences in seconds. Browse vetted operators. Track your trips.
          Access exclusive events. All from the Drive Exotiq mobile app.
        </p>

        {/* iPhone Mockups - 3 Screenshots Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 max-w-5xl mx-auto md:items-start">
          
          {/* Mockup 1 - Home/Search Screen */}
          <div className="relative flex flex-col">
            {/* iPhone Frame */}
            <div className="relative mx-auto" style={{ width: '280px' }}>
              {/* Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-deep-black rounded-b-3xl z-10"></div>
              
              {/* Screen Container */}
              <div className="relative rounded-[3rem] overflow-hidden border-4 border-graphite bg-deep-black shadow-2xl shadow-gulf-blue/20">
                {/* Actual App Screenshot */}
                <Image 
                  src="/images/app/app-home.png" 
                  alt="Drive Exotiq App - Search Screen"
                  width={652}
                  height={1314}
                  className="w-full h-auto"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
            {/* Feature Label */}
            <div className="text-center mt-6">
              <h3 className="text-lg font-semibold text-pure-white mb-2 min-h-[28px] flex items-center justify-center">Instant Search</h3>
              <p className="text-sm text-metallic-silver">
                Find your dream car by make, model, city, or dates. Real-time availability.
              </p>
            </div>
          </div>

          {/* Mockup 2 - Car Detail Screen */}
          <div className="relative flex flex-col">
            <div className="relative mx-auto" style={{ width: '280px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-deep-black rounded-b-3xl z-10"></div>
              <div className="relative rounded-[3rem] overflow-hidden border-4 border-graphite bg-deep-black shadow-2xl shadow-gulf-blue/20">
                <Image 
                  src="/images/app/app-detail.png" 
                  alt="Drive Exotiq App - Car Detail"
                  width={660}
                  height={1310}
                  className="w-full h-auto"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-lg font-semibold text-pure-white mb-2 min-h-[28px] flex items-center justify-center">Transparent Pricing</h3>
              <p className="text-sm text-metallic-silver">
                See the total cost upfront. No hidden fees, no surprises.
              </p>
            </div>
          </div>

          {/* Mockup 3 - Splash/Brand Screen */}
          <div className="relative flex flex-col">
            <div className="relative mx-auto" style={{ width: '280px' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-6 bg-deep-black rounded-b-3xl z-10"></div>
              <div className="relative rounded-[3rem] overflow-hidden border-4 border-graphite bg-deep-black shadow-2xl shadow-gulf-blue/20">
                <Image 
                  src="/images/app/app-splash.png" 
                  alt="Drive Exotiq App - Brand"
                  width={744}
                  height={1456}
                  className="w-full h-auto"
                  loading="lazy"
                  unoptimized
                />
              </div>
            </div>
            <div className="text-center mt-6">
              <h3 className="text-lg font-semibold text-pure-white mb-2 min-h-[28px] flex items-center justify-center">Event Access</h3>
              <p className="text-sm text-metallic-silver">
                First to know about exclusive gatherings, drives, and community experiences.
              </p>
            </div>
          </div>
        </div>

        {/* App Store Badges - Subtle Disabled Look */}
        <div className="flex flex-col items-center justify-center mt-12">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 opacity-50">
            <Image 
              src="/images/app-store-badge.svg" 
              alt="Download on App Store - Coming Soon"
              width={120}
              height={40}
              className="h-12 w-auto"
              loading="lazy"
            />
            <Image 
              src="/images/google-play-badge.svg" 
              alt="Get it on Google Play - Coming Soon"
              width={135}
              height={40}
              className="h-12 w-auto"
              loading="lazy"
            />
          </div>
          <p className="text-sm text-metallic-silver mt-4">
            Coming Q1 2026
          </p>
        </div>
      </div>
    </section>
  );
}

