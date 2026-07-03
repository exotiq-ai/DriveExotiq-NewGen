import Link from 'next/link';
import Button from '@/components/ui/Button';

export default function InvestorTeaser() {
  const metrics = [
    {
      number: '$13B+',
      label: 'Market Opportunity',
      description: 'U.S. luxury rental market ripe for AI disruption',
    },
    {
      number: '$180M+',
      label: 'Fleet Network',
      description: 'Multi-city operators across Denver, Scottsdale, Miami',
    },
    {
      number: '15.8%',
      label: 'Market Growth',
      description: 'CAGR in boutique P2P and luxury rental segment',
    },
  ];

  return (
    <section className="py-24 md:py-32 bg-gradient-to-b from-deep-black via-midnight-blue to-deep-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        {/* Section Label */}
        <p className="text-caption text-gulf-blue mb-4 text-center">
          BUILDING THE FUTURE
        </p>

        {/* Headline */}
        <h2 className="text-h2 text-pure-white mb-6 text-center max-w-6xl mx-auto">
          We're Not Just Connecting Drivers to Cars.<br />
          <span className="text-gulf-blue whitespace-nowrap">We're Building Infrastructure for Premium Mobility.</span>
        </h2>

        {/* Body Copy */}
        <p className="text-body text-metallic-silver mb-16 text-center max-w-3xl mx-auto">
          Drive Exotiq is solving the trust problem that killed Turo's exotic segment while 
          building a demand engine for vetted operators nationwide. Backed by proven SaaS builders 
          and an AI development team with unicorn track records, we're positioned to become the 
          category-defining platform for premium fleet operations.
        </p>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <div key={index} className="bg-graphite/50 backdrop-blur-sm border border-gulf-blue/20 rounded-lg p-8 text-center">
              <p className="text-5xl font-display font-bold text-gulf-blue mb-2">
                {metric.number}
              </p>
              <h3 className="text-lg font-semibold text-pure-white mb-2">
                {metric.label}
              </h3>
              <p className="text-sm text-metallic-silver">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Backed By */}
        <div className="text-center mb-12">
          <p className="text-sm text-metallic-silver mb-4">Backed By</p>
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="text-pure-white font-semibold">1080 Ventures</span>
            <span className="text-metallic-silver">•</span>
            <span className="text-pure-white font-semibold">Lex Growth Studio</span>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <Link href="/investors">
            <Button variant="primary" size="lg">
              Investment Opportunity
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

