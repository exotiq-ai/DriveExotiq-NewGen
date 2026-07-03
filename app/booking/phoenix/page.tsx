'use client';

import { useState } from 'react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Card from '@/components/ui/Card';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// Dynamically import iframe-resizer to avoid SSR issues
const WheelbaseIframe = dynamic(() => import('@/components/booking/WheelbaseIframe'), {
  ssr: false,
});

const faqs = [
  {
    question: 'What are the age and license requirements?',
    answer: 'Drivers must be at least 25 years old with a valid driver\'s license. A clean driving record is required. International drivers must have a valid license from their home country.',
  },
  {
    question: 'What is included in the rental price?',
    answer: 'All rentals include comprehensive insurance coverage, roadside assistance, and 24/7 customer support. Basic mileage is included. Additional options like delivery, extended hours, and extra mileage packages are available.',
  },
  {
    question: 'How do I book a vehicle?',
    answer: 'Browse our fleet, select your desired vehicle, choose your pickup and drop-off dates, and complete the booking through our secure checkout system. You\'ll receive a confirmation email with all the details.',
  },
  {
    question: 'Can I cancel or modify my reservation?',
    answer: 'Yes, you can modify or cancel your reservation. Cancellations made at least 48 hours before your pickup time receive a full refund. Modifications are subject to availability. Please contact us for assistance.',
  },
  {
    question: 'What forms of payment do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express) and debit cards. A security deposit is required at the time of pickup, which will be authorized on your card.',
  },
  {
    question: 'Do you offer delivery and pickup services?',
    answer: 'Yes, we offer delivery and pickup services for an additional fee. Delivery is available within the Phoenix metro area. Contact us to arrange delivery or pickup at your location.',
  },
  {
    question: 'What happens if the vehicle is damaged?',
    answer: 'All rentals include comprehensive insurance coverage. In the event of damage, please contact us immediately. The security deposit may be used to cover any damages not covered by insurance.',
  },
  {
    question: 'Can I add additional drivers?',
    answer: 'Yes, additional drivers can be added for a daily fee. All additional drivers must meet the same age and license requirements and be present at the time of pickup.',
  },
  {
    question: 'What is your fuel policy?',
    answer: 'Vehicles are provided with a full tank of fuel and should be returned with a full tank. If the vehicle is returned with less fuel, a refueling fee will apply.',
  },
  {
    question: 'Do you offer long-term rentals?',
    answer: 'Yes, we offer weekly and monthly rental packages with discounted rates. Contact us for pricing and availability for extended rental periods.',
  },
];

export default function PhoenixBookingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Header />
      <main className="pt-20">
        {/* Compact Dark Header */}
        <section className="py-6 lg:py-8 bg-gradient-to-b from-deep-black to-midnight-blue">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="text-body-sm text-metallic-silver mb-3">
              <Link href="/booking" className="hover:text-gulf-blue transition-colors">Booking</Link>
              <span className="mx-2">/</span>
              <span className="text-pure-white">Phoenix</span>
            </nav>
            <h1 className="text-h2 text-pure-white">PHOENIX FLEET</h1>
          </div>
        </section>

        {/* ===== WHITE ZONE START ===== */}
        {/* Wheelbase Iframe Section - White Background */}
        <section className="bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 lg:py-10">
            <WheelbaseIframe />
          </div>
        </section>

        {/* Trust Badges - White Background with subtle top border */}
        <section className="py-8 lg:py-10 bg-white border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12">
              {/* Roamly Logo - displays cleanly on white */}
              <div className="flex items-center">
                <img 
                  src="/images/logos/Roamly_Logo.jpg" 
                  alt="Roamly Insurance" 
                  className="h-10 lg:h-12 w-auto object-contain"
                  style={{ maxWidth: '180px' }}
                />
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                <svg className="w-5 h-5 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <span>Insurance Coverage</span>
              </div>
              <div className="flex items-center gap-2 text-gray-600 text-sm font-medium">
                <svg className="w-5 h-5 text-gulf-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
                <span>24/7 Support</span>
              </div>
            </div>
          </div>
        </section>
        {/* ===== WHITE ZONE END ===== */}

        {/* Elegant Gradient Divider - White to Dark transition */}
        <div className="h-20 lg:h-24 bg-gradient-to-b from-white via-gray-200 to-deep-black" />

        {/* FAQ Section - Dark Background */}
        <section className="py-12 lg:py-16 bg-deep-black">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="text-h3 lg:text-h2 text-pure-white mb-8 lg:mb-12 text-center">FREQUENTLY ASKED QUESTIONS</h2>
            <div className="space-y-3">
              {faqs.map((faq, index) => (
                <Card key={index} className="cursor-pointer" onClick={() => setOpenFaq(openFaq === index ? null : index)}>
                  <div className="flex items-center justify-between">
                    <h3 className="text-body lg:text-h4 text-pure-white pr-6 font-semibold">{faq.question}</h3>
                    <svg
                      className={`w-5 h-5 text-gulf-blue transition-transform duration-300 flex-shrink-0 ${
                        openFaq === index ? 'rotate-180' : ''
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  {openFaq === index && (
                    <p className="text-body-sm text-metallic-silver mt-4 leading-relaxed">{faq.answer}</p>
                  )}
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
