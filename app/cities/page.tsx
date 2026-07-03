import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cities | Drive Exotiq',
  description: 'Drive Exotiq is launching in Denver, Scottsdale, and Miami. Nationwide expansion coming 2026.',
};

export default function CitiesPage() {
  const cities = [
    {
      name: 'Denver, Colorado',
      status: 'LAUNCHING DECEMBER 2025',
      tagline: "Colorado's exotic car scene meets Drive Exotiq's vision",
      fleet: '20+ exotic vehicles at launch',
      vehicles: [
        'Lamborghini Huracán, Aventador',
        'Ferrari 488 GTB',
        'McLaren 570S, 720S',
        'Porsche 911 GT3, Turbo S',
        'Audi R8 V10',
        'And more',
      ],
      operators: "Vetted partnerships with Denver's top exotic rental operators. High standards. White-glove service.",
      experiences: [
        'Scenic mountain drives (Red Rocks, Pikes Peak, Trail Ridge Road)',
        'Denver Cars & Coffee events',
        'Track day access (High Plains Raceway)',
        'Winter driving experiences',
      ],
      launchEvent: 'December 13, 2025',
      image: '/images/cars/R8-telluride.jpg',
      available: true,
    },
    {
      name: 'Scottsdale, Arizona',
      status: 'LAUNCHING JANUARY 2026',
      tagline: "The desert Southwest's automotive capital",
      fleet: '5 vetted operators • 30+ exotic vehicles',
      vehicles: [
        'Supercars and hypercars available in select inventory',
      ],
      operators: 'Currently in outreach. Launch partnerships being finalized.',
      experiences: [
        'Arizona Car Week access',
        'Barrett-Jackson Auction VIP experiences',
        'Desert scenic routes (Apache Trail, Carefree Highway)',
        'Scottsdale Cars & Coffee',
        'Track days (Radford Racing School, Wild Horse Pass)',
      ],
      launchEvent: 'January 2026 (Arizona Car Week)',
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=90',
      available: false,
    },
    {
      name: 'Miami, Florida',
      status: 'LAUNCHING FEBRUARY 2026',
      tagline: 'South Beach glamour meets exotic performance',
      fleet: '5-10 vetted operators • 40+ exotic vehicles',
      vehicles: [
        'Supercar and hypercar availability',
        'Miami has the most exotic inventory in the U.S.',
      ],
      operators: "Partnership outreach in progress. Miami has the most exotic rental operators nationwide, and we're vetting the best.",
      experiences: [
        'South Beach to Key West scenic drives',
        'Miami Design District events',
        'Supercar Saturdays',
        'Track days (Homestead-Miami Speedway)',
        'Miami Concourse weekend experiences',
      ],
      launchEvent: 'February 2026 (Design District)',
      image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=90',
      available: false,
    },
  ];

  const targetMarkets = [
    'Los Angeles, CA',
    'Las Vegas, NV',
    'Austin, TX',
    'Atlanta, GA',
    'New York, NY',
    'Chicago, IL',
    'Seattle, WA',
    'Dallas, TX',
    'San Francisco, CA',
    'Nashville, TN',
  ];

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 bg-midnight-blue">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-h1 text-pure-white mb-6">
              Launching City by City.
              <br />
              Nationwide by 2026.
            </h1>
            <p className="text-body-lg text-metallic-silver">
              Drive Exotiq is expanding to every major market in North America. Here's where
              we're starting, and where we're headed.
            </p>
          </div>
        </section>

        {/* City Details */}
        {cities.map((city, index) => (
          <section key={index} className={index % 2 === 0 ? 'py-24 bg-jet-grey' : 'py-24 bg-deep-black'}>
            <div className="max-w-6xl mx-auto px-6">
              <Card hover className={city.available ? 'border-2 border-gulf-blue/50' : ''}>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <Badge variant={city.available ? 'default' : 'outline'} className="mb-4">
                      {city.status}
                    </Badge>
                    <h2 className="text-h2 text-pure-white mb-2">
                      {city.name}
                    </h2>
                    <p className="text-body text-metallic-silver mb-6">
                      {city.tagline}
                    </p>

                    <div className="space-y-6">
                      <div>
                        <h3 className="text-h3 text-gulf-blue mb-2">The Fleet:</h3>
                        <p className="text-body-sm text-pure-white mb-2">{city.fleet}</p>
                        <ul className="space-y-1">
                          {city.vehicles.map((vehicle, idx) => (
                            <li key={idx} className="text-body-sm text-metallic-silver">• {vehicle}</li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="text-h3 text-gulf-blue mb-2">Operators:</h3>
                        <p className="text-body-sm text-metallic-silver">{city.operators}</p>
                      </div>

                      <div>
                        <h3 className="text-h3 text-gulf-blue mb-2">Experiences:</h3>
                        <ul className="space-y-1">
                          {city.experiences.map((exp, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-body-sm text-metallic-silver">
                              <svg className="w-5 h-5 text-gulf-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                              {exp}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <p className="text-body-sm text-pure-white">
                          <strong>Launch Event:</strong> <span className="text-gulf-blue">{city.launchEvent}</span>
                        </p>
                      </div>

                      <Link href={city.available ? '/apply' : '#'}>
                        <Button variant={city.available ? 'primary' : 'outline'} size="lg" className="w-full" disabled={!city.available}>
                          {city.available ? 'Apply for Access' : 'Join Waitlist'}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        ))}

        {/* Coming Soon Cities */}
        <section className="py-24 bg-midnight-blue">
          <div className="max-w-6xl mx-auto px-6">
            <p className="text-caption text-gulf-blue mb-4 text-center">
              EXPANDING NATIONWIDE
            </p>
            <h2 className="text-h2 text-pure-white mb-12 text-center">
              Your City Next?
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
              {targetMarkets.map((market, index) => (
                <Card key={index} className="text-center py-4">
                  <p className="text-body-sm text-pure-white">{market}</p>
                </Card>
              ))}
            </div>

            <div className="text-center">
              <p className="text-body text-metallic-silver mb-6">
                Want Drive Exotiq to launch in your city? Let us know.
              </p>
              <a href="mailto:hello@exotiq.ai">
                <Button variant="primary" size="lg">
                  Request Your City
                </Button>
              </a>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
