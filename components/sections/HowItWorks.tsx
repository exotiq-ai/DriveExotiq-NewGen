import Link from 'next/link';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';

export default function HowItWorks() {
  const steps = [
    {
      number: '1',
      title: 'Apply',
      description: 'Quick application. AI verification. VIP access in minutes.',
      icon: (
        <svg className="w-10 h-10 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
    {
      number: '2',
      title: 'Browse',
      description: 'Vetted operators. Curated exotics. Transparent pricing.',
      icon: (
        <svg className="w-10 h-10 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
    },
    {
      number: '3',
      title: 'Drive',
      description: 'Reserve. Experience. Connect with the community.',
      icon: (
        <svg className="w-10 h-10 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
    },
  ];

  return (
    <section className="py-24 lg:py-32 xl:py-40 bg-midnight-blue">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-caption text-gulf-blue mb-4 text-center">
          HOW IT WORKS
        </p>

        <h2 className="text-h2 text-pure-white mb-16 text-center">
          From Application to Adventure in 3 Steps
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <Card hover className="h-full">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-performance-orange text-pure-white text-2xl font-bold mb-4">
                  {step.number}
                </div>
                <div className="mb-4">
                  {step.icon}
                </div>
                <h3 className="text-h3 text-pure-white mb-3">
                  {step.title}
                </h3>
                <p className="text-body-sm text-metallic-silver">
                  {step.description}
                </p>
              </Card>
              {/* Connection line - only on desktop, not for last item */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-8 -right-4 w-8 h-0.5 bg-metallic-silver/30" />
              )}
            </div>
          ))}
        </div>

        <div className="text-center">
          <p className="text-body text-metallic-silver mb-6">
            Ready to get started?
          </p>
          <Link href="/apply">
            <Button variant="primary" size="lg">
              Apply for Access
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
