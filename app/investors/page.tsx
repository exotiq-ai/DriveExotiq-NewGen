import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Investors - Drive Exotiq | $2.5M Pre-Seed Round',
  description: 'Join our Pre-Seed round. Building the operating system for premium mobility. $13B market opportunity. AI-native solution backed by proven operators and technologists.',
};

export default function InvestorsPage() {
  const impactMetrics = [
    {
      stat: '$2.45B',
      label: 'Serviceable Market',
      description: 'Boutique and P2P operators need integrated tools',
    },
    {
      stat: '15+',
      label: 'Hours Saved Weekly',
      description: 'Automated pricing, messaging, scheduling',
    },
    {
      stat: '>90%',
      label: 'Operator Stickiness',
      description: 'Would rely on Exotiq as primary daily OS',
    },
    {
      stat: '30+',
      label: 'Workflows Automated',
      description: 'Guest replies to compliance checks',
    },
  ];

  const teamMembers = [
    {
      name: 'Gregory Ringler',
      title: 'Founder & CEO',
      description: '15+ years leadership experience in 5-star hospitality, premium brands, and automotive innovation',
      image: '/images/team/gregory-ringler.jpg',
    },
    {
      name: 'Nikola Javić',
      title: 'Fractional CTO, Ars Futura',
      description: 'Proven AI/ML engineering leader behind multiple SaaS unicorns',
      image: '/images/team/nikola-javic.jpg',
    },
    {
      name: 'Arthur Woods',
      title: 'Strategic Advisor',
      description: 'Serial entrepreneur with two exits. Founder of 1080 Ventures',
      image: '/images/team/arthur-woods.jpg',
    },
    {
      name: 'Mike Looney',
      title: 'Strategic Advisor',
      description: 'Exited founder at 1080 Ventures and SaaS growth strategist',
      image: '/images/team/mike-looney.jpg',
    },
  ];

  return (
    <>
      <Header />
      <main className="bg-deep-black">
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 overflow-hidden">
          {/* Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-b from-midnight-blue via-deep-black to-deep-black" />
          
          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <div className="inline-block mb-6 px-4 py-2 bg-performance-orange/10 border border-performance-orange/30 rounded-full">
              <span className="text-performance-orange font-semibold text-sm">
                $2.5M PRE-SEED ROUND • CLOSING SOON
              </span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-pure-white mb-6 leading-tight">
              We're Building the Operating System for Premium Mobility
            </h1>

            <p className="text-xl text-metallic-silver mb-10 max-w-3xl mx-auto">
              $13B market. AI-native solution. Proven team with unicorn track records. 
              Opening our Pre-Seed to limited early investors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a 
                href="https://summary.exotiq.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="primary" size="lg" className="min-w-[200px]">
                  View Full Deck
                </Button>
              </a>
              <a 
                href="https://calendly.com/hello-exotiq" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <Button variant="outline" size="lg" className="min-w-[200px]">
                  Schedule a Call
                </Button>
              </a>
            </div>

            <p className="text-sm text-metallic-silver">
              Contact:{' '}
              <a href="mailto:hello@exotiq.ai" className="text-gulf-blue hover:text-gulf-blue/80">
                hello@exotiq.ai
              </a>
            </p>
          </div>
        </section>

        {/* Why Now - Streamlined Impact */}
        <section className="py-20 bg-jet-grey/30">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-caption text-gulf-blue mb-4">WHY NOW</p>
              <h2 className="text-h2 text-pure-white mb-6">
                The Market is Ready. The Product is Proven.
              </h2>
              <p className="text-body-lg text-metallic-silver max-w-2xl mx-auto">
                Early operators are seeing real results. Beta launching Q1 2026 across three cities.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {impactMetrics.map((metric, index) => (
                <Card key={index} className="text-center bg-graphite/50 border-gulf-blue/20">
                  <div className="text-4xl md:text-5xl font-bold text-gulf-blue mb-3">
                    {metric.stat}
                  </div>
                  <h3 className="text-lg font-semibold text-pure-white mb-2">
                    {metric.label}
                  </h3>
                  <p className="text-sm text-metallic-silver">
                    {metric.description}
                  </p>
                </Card>
              ))}
            </div>

            <div className="text-center mb-10">
              <a 
                href="https://summary.exotiq.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="primary" size="md">
                  See the Full Story →
                </Button>
              </a>
            </div>

            <div className="bg-midnight-blue/50 border border-gulf-blue/20 rounded-lg p-6 text-center max-w-3xl mx-auto">
              <p className="text-lg text-pure-white italic">
                "We need an integrated system that actually understands how we work. Exotiq gets it."
              </p>
              <p className="text-metallic-silver mt-2 text-sm">
                – Jay, Denver Exotic Rental Cars
              </p>
            </div>
          </div>
        </section>

        {/* Competitive Advantage - Streamlined */}
        <section className="py-20 bg-midnight-blue/30">
          <div className="max-w-5xl mx-auto px-6">
            <div className="text-center mb-12">
              <p className="text-caption text-gulf-blue mb-4">COMPETITIVE ADVANTAGE</p>
              <h2 className="text-h2 text-pure-white mb-8">
                Turo Failed Exotic Operators.<br />We're Purpose-Built for Them.
              </h2>
            </div>

            <div className="bg-graphite/50 border border-gulf-blue/20 rounded-lg p-8 md:p-10">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-gulf-blue rounded-full mt-2"></div>
                  <p className="text-body-lg text-pure-white">
                    <span className="font-semibold text-gulf-blue">FleetCopilot™ AI</span> handles pricing, messaging, and maintenance 24/7
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-gulf-blue rounded-full mt-2"></div>
                  <p className="text-body-lg text-pure-white">
                    <span className="font-semibold text-performance-orange">No predatory commissions.</span> Operator-first SaaS model ($49-$199/month)
                  </p>
                </div>
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-2 h-2 bg-gulf-blue rounded-full mt-2"></div>
                  <p className="text-body-lg text-pure-white">
                    <span className="font-semibold text-gulf-blue">Strategic ecosystem:</span> Axle, Persona, insurance integrations
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The Team */}
        <section className="py-20 bg-deep-black">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-caption text-performance-orange mb-4">THE TEAM</p>
              <h2 className="text-h2 text-pure-white mb-6">
                Built by Operators Who Lived the Problem.<br />
                Backed by Technologists Who Scale Unicorns.
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {teamMembers.map((member, index) => (
                <Card key={index} className="text-center bg-jet-grey border-metallic-silver/30">
                  <div className="mb-4">
                    {member.image ? (
                      <div className="w-28 h-28 sm:w-24 sm:h-24 mx-auto rounded-full overflow-hidden bg-graphite">
                        <Image 
                          src={member.image} 
                          alt={member.name}
                          width={112}
                          height={112}
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-28 h-28 sm:w-24 sm:h-24 mx-auto rounded-full bg-gulf-blue/20 flex items-center justify-center">
                        <span className="text-4xl sm:text-3xl font-bold text-gulf-blue">
                          {member.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                    )}
                  </div>
                  <h3 className="text-h4 text-pure-white mb-2">{member.name}</h3>
                  <p className="text-sm text-gulf-blue mb-3">{member.title}</p>
                  <p className="text-body-sm text-metallic-silver">{member.description}</p>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-body text-metallic-silver mb-4">Backed By</p>
              <div className="flex flex-wrap justify-center items-center gap-6 mb-6">
                <span className="text-pure-white font-bold text-xl">1080 Ventures</span>
                <span className="text-metallic-silver">•</span>
                <span className="text-pure-white font-bold text-xl">Lex Growth Studio</span>
              </div>
              <p className="text-body-sm text-metallic-silver">
                Multiple investors already committed. Round listed on AngelList.
              </p>
            </div>
          </div>
        </section>

        {/* The Ask - Clear CTA */}
        <section className="py-20 bg-gradient-to-b from-midnight-blue to-deep-black">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <p className="text-caption text-performance-orange mb-4">THE INVESTMENT</p>
            <h2 className="text-h2 text-pure-white mb-6">
              $2.5M Pre-Seed Round
            </h2>
            <p className="text-body-lg text-metallic-silver mb-8">
              Funding MVP launch and market expansion across Denver, Scottsdale, and Miami.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <div className="bg-jet-grey/50 border border-gulf-blue/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-gulf-blue mb-2">60%</div>
                <p className="text-pure-white font-semibold mb-1">Product & AI</p>
                <p className="text-sm text-metallic-silver">MVP Launch</p>
              </div>
              <div className="bg-jet-grey/50 border border-gulf-blue/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-gulf-blue mb-2">25%</div>
                <p className="text-pure-white font-semibold mb-1">GTM & Partnerships</p>
                <p className="text-sm text-metallic-silver">Market Entry</p>
              </div>
              <div className="bg-jet-grey/50 border border-gulf-blue/30 rounded-lg p-6">
                <div className="text-3xl font-bold text-gulf-blue mb-2">15%</div>
                <p className="text-pure-white font-semibold mb-1">Operations</p>
                <p className="text-sm text-metallic-silver">Infrastructure</p>
              </div>
            </div>

            <div className="bg-performance-orange/10 border border-performance-orange/50 rounded-lg p-8 mb-10">
              <p className="text-xl text-pure-white font-semibold mb-2">
                Opening to Limited Early Investors
              </p>
              <p className="text-body text-metallic-silver">
                Round closing soon. Contact us for AngelList link and detailed financials.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a 
                href="https://summary.exotiq.ai/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="primary" size="lg" className="min-w-[220px]">
                  View Full Investor Deck
                </Button>
              </a>
              <a 
                href="https://calendly.com/hello-exotiq" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block"
              >
                <Button variant="outline" size="lg" className="min-w-[220px]">
                  Book Time with Gregory
                </Button>
              </a>
            </div>

            <div className="border-t border-metallic-silver/20 pt-8">
              <p className="text-body text-metallic-silver mb-4">
                Questions about the round?
              </p>
              <a 
                href="mailto:hello@exotiq.ai" 
                className="text-gulf-blue hover:text-gulf-blue/80 text-lg font-semibold transition-colors"
              >
                hello@exotiq.ai
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}

