import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'The Drives · The last Sunday. The first light.',
  description: 'Small, invite-only sunrise drives and good company over coffee. Request your Drive Exotiq invite. The next date and route are being planned.',
  alternates: { canonical: '/drives' },
};
const FAQ = [
  { q: 'Who are the drives for?', a: 'People who love driving. Owners, enthusiasts, and the people building what comes next. Request an invite and tell us a little about yourself and your city.' },
  { q: 'When is the next drive?', a: 'Our proposed rhythm is the last Sunday of the month, at sunrise. The next date and route are being planned. Confirmed details come with your invitation.' },
  { q: 'What kind of car do I need?', a: 'We care about the driver more than the badge. Tell us what you drive when you request your invite.' },
  { q: 'Is there a membership fee?', a: 'There is no membership fee. The drives are how we build the Drive Exotiq community.' },
  { q: 'Where do we meet?', a: 'The meet point and route are shared directly with invited drivers once a drive is confirmed.' },
];
export default function DrivesPage() {
  return <><Header /><main id="main-content" className="ed-page ed-drives-page">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQ.map(item => ({ '@type': 'Question', name: item.q, acceptedAnswer: { '@type': 'Answer', text: item.a } })) }) }} />
    <section className="ed-drives-hero">
      <div className="ed-wrap ed-drives-type"><p className="ed-kicker">The drives / By invitation</p><h1 className="ed-title">The last Sunday.<br /><em>The first light.</em></h1></div>
      <div className="ed-wrap ed-invitation"><p className="ed-kicker">Your Sunday, reclaimed</p><div className="ed-invitation-main"><div><h2>A good road. A small group.</h2><p className="ed-caption">Sunrise drives. Coffee after. An invitation to be there.</p></div><div className="ed-invitation-action"><Link className="ed-button" href="/apply?interest=drives">Request your invite <span aria-hidden="true">↗</span></Link><p className="ed-invitation-status">Next date and route being planned.</p></div></div></div>
      <div className="ed-photo ed-drives-image"><Image src="/astra/s8-alpine-drive.webp" alt="An Audi S8 driving an open alpine road" fill priority fetchPriority="high" sizes="100vw" /><span className="ed-image-label">From the road / Colorado</span></div>
    </section>
    <section className="ed-section"><div className="ed-wrap"><div className="ed-section-top"><p className="ed-kicker">The next gathering</p><span className="ed-section-number">01 / The invitation</span></div><div className="ed-split"><h2 className="ed-heading">Some things are<br />worth <em>getting up for.</em></h2><div className="ed-stack"><p className="ed-lead">An empty road before the city wakes. The car you love. People who understand why.</p><p className="ed-body">We keep the drives small so the conversation has room. A thoughtful route, a sunrise rollout, and somewhere worth stopping for coffee.</p><div><p className="ed-sunday">Next Sunday?</p><p className="ed-body">The next date is being planned. Our proposed rhythm is the last Sunday of the month. Join the invitation list for confirmed details.</p></div></div></div></div></section>
    <section className="ed-paper ed-section"><div className="ed-wrap"><div className="ed-section-top"><p className="ed-kicker">How it begins</p><span className="ed-section-number">02 / Three simple steps</span></div><h2 className="ed-heading">A little less scrolling.<br /><em>A little more driving.</em></h2><ol className="ed-three">{[
      ['Make an introduction.', 'Your name, your city, and what you drive. A real person reads every request.'],
      ['Look out for your invite.', 'When a drive fits your city, we share the confirmed date, meet point, and route directly.'],
      ['Bring your curiosity.', 'Come for the road. Stay for the conversations over coffee. That is the whole idea.'],
    ].map(([title, body], i) => <li className="ed-step" key={title}><span>0{i + 1}</span><h3>{title}</h3><p className="ed-body">{body}</p></li>)}</ol></div></section>
    <section className="ed-section"><div className="ed-wrap ed-split"><figure><div className="ed-photo ed-tall-photo"><Image src="/astra/ferrari-r8-lakeside.webp" alt="Ferrari 458 and Audi R8 beside a mountain lake in Telluride" fill sizes="(max-width: 680px) 100vw, 50vw" /></div><figcaption className="ed-caption">Good company, in any weather. / Telluride, Colorado</figcaption></figure><div className="ed-stack"><p className="ed-kicker">The people make the drive</p><h2 className="ed-heading">Coffee gets cold.<br /><em>Conversation doesn’t.</em></h2><p className="ed-body">The cars bring us together. The people keep us coming back. Founders, owners, and enthusiasts sharing the road and the stories that follow it.</p><Link href="/blog" className="ed-link">Read the stories <span aria-hidden="true">↗</span></Link></div></div></section>
    <section className="ed-paper ed-section"><div className="ed-wrap ed-split"><div><p className="ed-kicker">Before you set the alarm</p><h2 className="ed-heading" style={{ marginTop: 28 }}>A few<br /><em>good questions.</em></h2></div><div className="ed-faq">{FAQ.map(item => <details key={item.q}><summary>{item.q}</summary><p className="ed-body">{item.a}</p></details>)}</div></div></section>
    <section className="ed-close"><div className="ed-wrap"><h2 className="ed-heading">Leave room<br />for <em>the road.</em></h2><Link className="ed-button" href="/apply?interest=drives">Request your invite <span aria-hidden="true">↗</span></Link></div></section>
  </main><Footer /></>;
}
