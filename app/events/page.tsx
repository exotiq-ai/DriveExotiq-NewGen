import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import Card from '@/components/ui/Card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Events | Drive Exotiq',
  description: 'Exclusive gatherings for the Drive Exotiq community. Join invite-only events with exotic car enthusiasts.',
};

export default function EventsPage() {
  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 bg-midnight-blue">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-h1 text-pure-white mb-6">
              Where Enthusiasts Meet.
              <br />
              Drive. Connect.
            </h1>
            <p className="text-body-lg text-metallic-silver">
              Exclusive gatherings for the Drive Exotiq community. Invite-only access to
              unforgettable automotive experiences.
            </p>
          </div>
        </section>

        {/* Denver Event (Featured) */}
        <section className="py-24 bg-jet-grey">
          <div className="max-w-5xl mx-auto px-6">
            <Card hover className="border-2 border-gulf-blue/50">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="relative h-64 md:h-full rounded-lg overflow-hidden">
                  <Image
                    src="/images/events/denver-event.jpg"
                    alt="Audi R8 in Telluride - Drive Exotiq Denver event"
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'center center' }}
                    priority
                    unoptimized
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <Badge variant="orange" className="mb-4">
                      INVITE ONLY • DECEMBER 13, 2025
                    </Badge>
                    <h2 className="text-h2 text-pure-white mb-4">
                      Drive Exotiq Denver Launch
                    </h2>
                    <p className="text-body text-metallic-silver mb-6">
                      Join us for the official Drive Exotiq Denver launch. An intimate gathering of
                      exotic car enthusiasts, industry insiders, and people who refuse to settle for
                      boring rental experiences.
                    </p>

                    <h3 className="text-h3 text-pure-white mb-3">Format:</h3>
                    <ul className="space-y-2 mb-6">
                      <li className="text-body-sm text-metallic-silver">
                        <strong className="text-gulf-blue">Coffee & Networking:</strong> Meet fellow enthusiasts, discuss your favorite exotic cars
                      </li>
                      <li className="text-body-sm text-metallic-silver">
                        <strong className="text-gulf-blue">Car Talk:</strong> Hear from Drive Exotiq founders and Denver operator partners
                      </li>
                      <li className="text-body-sm text-metallic-silver">
                        <strong className="text-gulf-blue">Guided Mountain Drive:</strong> Take to Colorado's most scenic roads in convoy formation
                      </li>
                    </ul>

                    <div className="bg-graphite/50 rounded-lg p-4 mb-6">
                      <h4 className="text-body font-semibold text-pure-white mb-2">Event Details:</h4>
                      <ul className="space-y-1 text-body-sm text-metallic-silver">
                        <li><strong>Date:</strong> December 13, 2025</li>
                        <li><strong>Time:</strong> TBD (Details coming soon)</li>
                        <li><strong>Location:</strong> Exclusive Denver location (Revealed upon registration)</li>
                        <li><strong>Duration:</strong> 2-3 hours total</li>
                        <li><strong>Capacity:</strong> Limited spots available</li>
                      </ul>
                    </div>

                    <p className="text-body-sm text-metallic-silver mb-6">
                      <strong className="text-pure-white">What to Bring:</strong> Your passion for exotic cars. Comfortable driving attire. An open mind.
                    </p>
                  </div>

                  <Link href="/apply">
                    <Button variant="primary" size="lg" className="w-full">
                      Register Your Interest
                    </Button>
                  </Link>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* Upcoming Events */}
        <section className="py-24 bg-deep-black">
          <div className="max-w-5xl mx-auto px-6">
            <h2 className="text-h2 text-pure-white mb-12 text-center">
              Coming Soon
            </h2>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Scottsdale */}
              <Card hover>
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=90"
                    alt="Scottsdale cars and coffee"
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
                <Badge variant="outline" className="mb-4">
                  COMING JANUARY 2026
                </Badge>
                <h3 className="text-h3 text-pure-white mb-2">
                  Arizona Car Week Experience
                </h3>
                <p className="text-body-sm text-gulf-blue mb-4">
                  Scottsdale, Arizona
                </p>
                <p className="text-body-sm text-metallic-silver mb-6">
                  An exclusive dinner for friends of Drive Exotiq during Arizona's most celebrated
                  automotive week. In conjunction with Barrett-Jackson Collector Car Auction.
                </p>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Stay Tuned
                </Button>
              </Card>

              {/* Miami */}
              <Card hover>
                <div className="relative h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src="https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=1200&q=90"
                    alt="Miami exotic cars"
                    fill
                    className="object-cover opacity-80"
                  />
                </div>
                <Badge variant="outline" className="mb-4">
                  COMING FEBRUARY 2026
                </Badge>
                <h3 className="text-h3 text-pure-white mb-2">
                  Miami Design District Gathering
                </h3>
                <p className="text-body-sm text-gulf-blue mb-4">
                  Miami, Florida
                </p>
                <p className="text-body-sm text-metallic-silver mb-6">
                  Details coming soon. Expect exotic cars, exclusive venue access, and unforgettable
                  Miami experiences.
                </p>
                <Button variant="outline" size="sm" className="w-full" disabled>
                  Join Waitlist
                </Button>
              </Card>
            </div>
          </div>
        </section>

        {/* Host an Event CTA */}
        <section className="py-20 bg-midnight-blue">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-h2 text-pure-white mb-4">
              Want to Host a Drive Exotiq Event
              <br />
              in Your City?
            </h2>
            <p className="text-body text-metallic-silver mb-8">
              We're always looking for passionate enthusiasts and partners to help us create
              unforgettable experiences. If you have a venue, a route, or an idea, let's talk.
            </p>
            <a href="mailto:hello@exotiq.ai">
              <Button variant="primary" size="lg">
                Contact Us
              </Button>
            </a>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
