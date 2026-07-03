import Card from '@/components/ui/Card';

export default function Solution() {
  const features = [
    {
      title: 'Vetted Operators',
      description: 'Only the best exotic rental operators make it into our network. High standards. White-glove service. No compromises.',
    },
    {
      title: 'AI-Powered Vetting',
      description: 'Our technology verifies every renter in minutes—background checks, driving records, insurance validation. Operators get risk profiles, not guesswork.',
    },
    {
      title: 'Transparent Pricing',
      description: 'A simple daily fee paid by renters. No hidden charges. No predatory commissions on operators. Just honest pricing.',
    },
    {
      title: 'Premium Fleet Access',
      description: 'Lamborghinis. Ferraris. McLarens. Bentleys. Even hypercars in select markets. The cars you actually want to drive.',
    },
    {
      title: 'Exclusive Events',
      description: 'Cars & Coffee. Mountain drives. Track days. Curated gatherings where enthusiasts connect over shared passion.',
    },
  ];

  return (
    <section className="py-24 lg:py-32 xl:py-40 bg-deep-black">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-caption text-gulf-blue mb-4 text-center">
          THE DRIVE EXOTIQ DIFFERENCE
        </p>

        <h2 className="text-h2 text-pure-white mb-8 text-center">
          Curated. Transparent. Exhilarating.
        </h2>

        <p className="text-body-lg text-metallic-silver mb-16 text-center max-w-4xl mx-auto">
          Drive Exotiq is the exotic car community for people who actually drive. We connect
          vetted enthusiasts to the world's best exotic rental experiences through cutting-edge
          technology and old-school passion.
        </p>

        {/* Top 3 cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          {features.slice(0, 3).map((feature, index) => (
            <Card key={index} hover>
              <h3 className="text-h3 text-pure-white mb-3">
                {feature.title}
              </h3>
              <p className="text-body-sm text-metallic-silver">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        {/* Bottom 2 cards centered */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          {features.slice(3).map((feature, index) => (
            <Card key={index + 3} hover>
              <h3 className="text-h3 text-pure-white mb-3">
                {feature.title}
              </h3>
              <p className="text-body-sm text-metallic-silver">
                {feature.description}
              </p>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-body text-gulf-blue italic">
            Seamless booking. Real-time availability. Your next exotic experience, one tap away.
          </p>
        </div>
      </div>
    </section>
  );
}
