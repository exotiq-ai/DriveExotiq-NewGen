import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function Cities() {
  const cities = [
    {
      name: 'Denver, Colorado',
      status: 'LAUNCHING DECEMBER 2025',
      vehicles: '20+ exotic vehicles',
      features: [
        'Vetted local operators',
        'Lamborghini, Ferrari, McLaren, Porsche',
        'Access to exclusive Rocky Mountain drives',
        'Community events starting Dec 13',
      ],
      image: '/images/cars/R8-telluride.jpg',
      available: true,
    },
    {
      name: 'Scottsdale, Arizona',
      status: 'LAUNCHING JANUARY 2026',
      vehicles: '30+ exotic vehicles (Target)',
      features: [
        'Arizona Car Week access',
        'Premium desert driving experiences',
        'Partnership with Barrett-Jackson events',
        'Year-round driving weather',
      ],
      image: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=90',
      available: false,
    },
    {
      name: 'Miami, Florida',
      status: 'LAUNCHING FEBRUARY 2026',
      vehicles: '40+ exotic vehicles (Target)',
      features: [
        'South Beach to Keys scenic routes',
        'Design District events',
        'Supercar and hypercar availability',
        'Year-round exotic car season',
      ],
      image: 'https://images.unsplash.com/photo-1614200187524-dc4b892acf16?w=1200&q=90',
      available: false,
    },
  ];

  return (
    <section className="py-24 lg:py-32 xl:py-40 bg-deep-black">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-caption text-gulf-blue mb-4 text-center">
          WHERE WE OPERATE
        </p>

        <h2 className="text-h2 text-pure-white mb-16 text-center">
          Launching City by City. Nationwide by 2026.
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {cities.map((city, index) => (
            <Card key={index} hover>
              <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                <Image
                  src={city.image}
                  alt={city.name}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>

              <Badge variant={city.available ? 'default' : 'outline'} className="mb-4">
                {city.status}
              </Badge>

              <h3 className="text-h3 text-pure-white mb-2">
                {city.name}
              </h3>

              <p className="text-body-sm text-gulf-blue mb-4">
                {city.vehicles}
              </p>

              <ul className="space-y-2 mb-6">
                {city.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-body-sm text-metallic-silver">
                    <svg className="w-5 h-5 text-gulf-blue flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              <Link href={city.available ? '/apply' : '/cities'}>
                <Button variant={city.available ? 'primary' : 'outline'} size="sm" className="w-full">
                  {city.available ? 'Apply for Access' : 'Join Waitlist'}
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="text-center">
          <p className="text-body text-metallic-silver mb-4">
            Your city next? Let us know where you want Drive Exotiq to launch.
          </p>
          <Link href="/cities">
            <Button variant="outline" size="md">
              Request Your City
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
