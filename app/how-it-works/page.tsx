import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'How It Works | Drive Exotiq',
  description: 'Learn how Drive Exotiq connects vetted drivers to curated exotic car experiences. From application to adventure in 3 simple steps.',
};

export default function HowItWorksPage() {
  const steps = [
    {
      title: 'Apply',
      content: 'Quick application. AI verification. VIP access in minutes.',
      timeline: 'Approved within 24-48 hours.',
    },
    {
      title: 'Browse',
      content: 'Vetted operators. Curated exotics. Transparent pricing.',
      timeline: 'Filter by city, vehicle, dates. Real-time availability.',
    },
    {
      title: 'Drive',
      content: 'Reserve. Experience. Connect with the community.',
      timeline: 'White-glove service from pickup to return.',
    },
  ];

  const faqs = [
    {
      q: 'How long does vetting take?',
      a: '24-48 hours. AI-powered verification speeds up the process.',
    },
    {
      q: 'What are the requirements?',
      a: 'Clean driving record, valid insurance, passion for exotics.',
    },
    {
      q: 'How much does it cost?',
      a: 'Free to join. Transparent daily fee when you book.',
    },
    {
      q: 'Can I rent in multiple cities?',
      a: 'Yes. One membership, access to all Drive Exotiq cities.',
    },
    {
      q: 'What if a vehicle isn\'t available?',
      a: 'Real-time availability. We\'ll help find alternatives if needed.',
    },
    {
      q: 'Do you own the vehicles?',
      a: 'No. We\'re the trusted marketplace connecting vetted drivers to vetted operators.',
    },
  ];

  return (
    <>
      <Header />
      <main className="pt-24">
        {/* Hero */}
        <section className="py-20 bg-midnight-blue">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h1 className="text-h1 text-pure-white mb-6">
              How It Works
            </h1>
            <p className="text-body-lg text-metallic-silver">
              From application to adventure in 3 steps.
            </p>
          </div>
        </section>

        {/* The Process */}
        <section className="py-24 bg-jet-grey">
          <div className="max-w-6xl mx-auto px-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step, index) => (
                <Card key={index} hover className="text-center">
                  <div className="flex items-center justify-center w-16 h-16 rounded-full bg-performance-orange text-pure-white text-2xl font-bold mb-6 mx-auto">
                    {index + 1}
                  </div>
                  <h3 className="text-h3 text-pure-white mb-4">
                    {step.title}
                  </h3>
                  <p className="text-body text-metallic-silver mb-6">
                    {step.content}
                  </p>
                  <p className="text-body-sm text-gulf-blue">
                    {step.timeline}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* FAQs */}
        <section className="py-24 bg-deep-black">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-h2 text-pure-white mb-12 text-center">
              Frequently Asked Questions
            </h2>

            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <Card key={index}>
                  <h3 className="text-h3 text-pure-white mb-3">
                    {faq.q}
                  </h3>
                  <p className="text-body text-metallic-silver">
                    {faq.a}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 bg-midnight-blue">
          <div className="max-w-4xl mx-auto px-6 text-center">
            <h2 className="text-h2 text-pure-white mb-6">
              Ready to join?
            </h2>
            <Link href="/apply">
              <Button variant="primary" size="lg">
                Apply for Access
              </Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
