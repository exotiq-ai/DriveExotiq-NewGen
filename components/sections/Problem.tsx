import Card from '@/components/ui/Card';

export default function Problem() {
  const features = [
    {
      title: 'No Hidden Fees',
      description: 'Transparent pricing you can trust. A simple, flat daily fee. No surprises, no games. What you see is what you pay.',
      icon: (
        <svg className="w-12 h-12 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      title: 'Vetted Excellence',
      description: 'Every operator meets our standards. Every vehicle is maintained to perfection. Every renter is verified. No exceptions.',
      icon: (
        <svg className="w-12 h-12 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      title: 'True Community',
      description: "This isn't a transaction—it's access to an exclusive network of enthusiasts, events, and experiences you won't find anywhere else.",
      icon: (
        <svg className="w-12 h-12 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 lg:py-32 xl:py-40 bg-jet-grey">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-caption text-gulf-blue mb-4 text-center">
          WHY DRIVE EXOTIQ EXISTS
        </p>

        <h2 className="text-h2 text-pure-white mb-8 text-center max-w-4xl mx-auto">
          Turo Abandoned Exotic Cars.{' '}
          <span className="whitespace-nowrap">We're Here to Fix It.</span>
        </h2>

        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-body text-metallic-silver mb-4">
            Hidden fees. Predatory 20-60% host commissions. Zero support when things go wrong.
            The best exotic cars disappeared from Turo because the platform stopped caring about
            this segment.
          </p>
          <p className="text-body text-metallic-silver mb-4">
            Traditional rental companies? They offer base-model Porsches and Range Rovers for
            travelers who need convenience—not the thrilling, meticulously maintained exotic
            fleet that true enthusiasts crave.
          </p>
          <p className="text-body text-metallic-silver">
            We built Drive Exotiq because the exotic car experience deserves better.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card key={index} hover className="text-center">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-h3 text-pure-white mb-3">
                {feature.title}
              </h3>
              <p className="text-body-sm text-metallic-silver">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
