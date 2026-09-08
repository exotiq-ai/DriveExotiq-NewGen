import Link from 'next/link';

const steps = [
  ['Introduce yourself.', 'Tell us your name, city and why you’d like to join.'],
  ['Get the details.', 'When a drive fits your city, your invite brings the confirmed date, route and meet point.'],
  ['Join the drive.', 'Meet the group for a drive and coffee.'],
];

export default function HomeInvitation() {
  return (
    <section id="the-invitation" className="home-invitation astra-invite" aria-labelledby="invitation-heading">
      <div className="astra-wrap">
        <div className="astra-story-label"><p className="astra-eyebrow">05 / Your invitation</p><span>The next good story starts outside.</span></div>
        <h2 id="invitation-heading">See you<br /><em>out there.</em><span className="home-invitation-arrow" aria-hidden="true">↗</span></h2>
        <div className="astra-invite-lead">
          <p>A good road. A small group.<br />And a reason to set the alarm.</p>
          <div><Link className="astra-button" href="/apply?interest=drives">Get on the list <span aria-hidden="true">↗</span></Link><span className="astra-invite-status">Next date and route being planned.</span></div>
        </div>
        <ol className="astra-invite-steps" aria-label="What happens when you join">
          {steps.map(([title, description], index) => <li key={title}><span className="astra-eyebrow">0{index + 1}</span><h3>{title}</h3><p>{description}</p></li>)}
        </ol>
        <div className="astra-invite-questions">
          <p className="astra-eyebrow">Before you join</p>
          <div>
            <details><summary>What kind of car do I need?<span aria-hidden="true">+</span></summary><p>We care about the driver more than the badge. Tell us what you drive when you request your invite.</p></details>
            <details><summary>When is the next drive?<span aria-hidden="true">+</span></summary><p>The next date and route are being planned. Our proposed rhythm is the last Sunday of the month, at sunrise. Confirmed details come with your invitation.</p></details>
          </div>
        </div>
      </div>
    </section>
  );
}
