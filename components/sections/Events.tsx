import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';

export default function Events() {
  const events = [
    {
      badge: 'INVITE ONLY',
      name: 'Drive Exotiq Denver Launch',
      date: 'December 13, 2025',
      location: 'Exclusive Denver Location',
      description: 'Join us for an intimate gathering of exotic car enthusiasts. Coffee. Networking. Car talk. Followed by a guided drive through Colorado\'s most scenic mountain roads.',
      image: '/images/events/denver-event.jpg',
      featured: true,
    },
    {
      badge: 'COMING SOON',
      name: 'Arizona Car Week Experience',
      date: 'January 2026',
      location: 'Scottsdale, AZ',
      description: 'An exclusive dinner during Arizona Car Week in conjunction with Barrett-Jackson. Friends of Drive Exotiq and our partners.',
      image: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=90',
      featured: false,
    },
    {
      badge: 'COMING SOON',
      name: 'Miami Design District Gathering',
      date: 'February 2026',
      location: 'Miami, FL',
      description: 'Details coming soon. Expect exotic cars, exclusive venue, and unforgettable experiences.',
      image: 'https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1200&q=90',
      featured: false,
    },
  ];

  return (
    <section className="py-24 lg:py-32 xl:py-40 bg-jet-grey">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-caption text-gulf-blue mb-4 text-center">
          UPCOMING EVENTS
        </p>

        <h2 className="text-h2 text-pure-white mb-16 text-center">
          Where Enthusiasts Meet. Drive. Connect.
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <Card key={index} hover className={event.featured ? 'lg:col-span-3' : ''}>
              <div className={`grid ${event.featured ? 'md:grid-cols-2 gap-6' : 'grid-cols-1'}`}>
                <div className="relative h-56 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover"
                    style={{ objectPosition: event.featured ? 'center center' : 'center' }}
                    unoptimized
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <Badge variant={event.badge === 'INVITE ONLY' ? 'orange' : 'outline'} className="mb-4">
                      {event.badge}
                    </Badge>
                    <h3 className="text-h3 text-pure-white mb-2">
                      {event.name}
                    </h3>
                    <p className="text-body-sm text-gulf-blue mb-4">
                      {event.date} • {event.location}
                    </p>
                    <p className="text-body-sm text-metallic-silver mb-6">
                      {event.description}
                    </p>
                  </div>
                  <div>
                    <Link href="/events">
                      <Button variant={event.featured ? 'primary' : 'outline'} size="sm">
                        {event.featured ? 'Register Your Interest' : 'Stay Tuned'}
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
