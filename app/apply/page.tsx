import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ApplicationForm from '@/components/forms/ApplicationForm';
import Card from '@/components/ui/Card';
import { Metadata } from 'next';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Apply | Drive Exotiq',
  description: 'Join the Drive Exotiq community. Submit your application and gain VIP access to curated exotic rental experiences.',
};

export default function ApplyPage() {
  const steps = [
    {
      title: 'Instant Verification',
      description: 'Our AI-powered system begins verifying your information as soon as you submit.',
    },
    {
      title: 'Review (24-48 hours)',
      description: 'Our team reviews your application and driving record. Most approvals happen within two business days.',
    },
    {
      title: 'Welcome Email',
      description: 'Once approved, you\'ll receive your member confirmation and access to the Drive Exotiq marketplace.',
    },
    {
      title: 'Start Browsing',
      description: 'Search vetted operators, browse exotic fleets, and book your first experience.',
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
              Join the Drive Exotiq Community
            </h1>
            <p className="text-body-lg text-metallic-silver">
              Access to the best exotic rental experiences starts here. Submit your application
              and join an exclusive community of curated operators, private events, and the world's most
              thrilling vehicles. VIP treatment awaits.
            </p>
          </div>
        </section>

        {/* Application Form Section */}
        <section className="py-24 bg-jet-grey">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Form */}
              <div className="lg:col-span-2">
                <Card>
                  <p className="text-caption text-gulf-blue mb-6">
                    YOUR APPLICATION
                  </p>
                  <h2 className="text-h2 text-pure-white mb-4">
                    Get Started
                  </h2>
                  <p className="text-body text-metallic-silver mb-8">
                    This is a quick process. Most applications reviewed within 24-48 hours. We use
                    AI-powered verification to check your information instantly while maintaining
                    high standards.
                  </p>
                  <ApplicationForm />
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                <Card>
                  <h3 className="text-h3 text-pure-white mb-6">
                    What Happens Next?
                  </h3>
                  <div className="space-y-6">
                    {steps.map((step, index) => (
                      <div key={index}>
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex items-center justify-center w-6 h-6 rounded-full bg-gulf-blue/20 text-gulf-blue text-sm font-bold flex-shrink-0 mt-0.5">
                            {index + 1}
                          </div>
                          <div>
                            <h4 className="text-body font-semibold text-pure-white mb-1">
                              {step.title}
                            </h4>
                            <p className="text-body-sm text-metallic-silver">
                              {step.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="bg-midnight-blue">
                  <h3 className="text-h3 text-pure-white mb-4">
                    Trust Signals
                  </h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gulf-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      <div>
                        <h4 className="text-body font-semibold text-pure-white mb-1">
                          Secure Application
                        </h4>
                        <p className="text-body-sm text-metallic-silver">
                          Your data is encrypted and never shared with third parties.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gulf-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                      </svg>
                      <div>
                        <h4 className="text-body font-semibold text-pure-white mb-1">
                          No Credit Card Required
                        </h4>
                        <p className="text-body-sm text-metallic-silver">
                          Membership is free during our launch phase. You only pay when you book.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <svg className="w-6 h-6 text-gulf-blue flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <div>
                        <h4 className="text-body font-semibold text-pure-white mb-1">
                          Vetted Operators Only
                        </h4>
                        <p className="text-body-sm text-metallic-silver">
                          Every rental operator meets Drive Exotiq's high standards for service and fleet quality.
                        </p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
