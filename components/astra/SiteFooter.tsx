import Link from 'next/link';
import Arrow from './Arrow';
import Emblem from '@/components/ui/Emblem';
import CookieSettingsButton from '@/components/CookieSettingsButton';
export default function SiteFooter(){
  return <footer className="astra-footer"><div className="astra-wrap">
    <div className="astra-footer-top"><div><span className="astra-eyebrow astra-footer-kicker"><span className="astra-live-dot"/> THE NEXT GREAT DRIVE STARTS HERE</span><p>See you<br/><em>out there.</em></p></div><Link href="/apply?interest=drives" className="astra-footer-circle" aria-label="Get on the list"><Arrow/></Link></div>
    <div className="astra-footer-grid"><div className="astra-footer-note"><Emblem className="astra-footer-emblem"/><p>A community for the people<br/>who actually drive the car.</p><span className="astra-footer-tagline">Born in Colorado. Driven everywhere.</span></div>
      <nav aria-label="Explore"><span className="astra-eyebrow astra-footer-nav-label">TAKE A LOOK AROUND</span><Link href="/drives">The drives</Link><Link href="/tour">The roadbook</Link><Link href="/marketplace">The garage</Link><Link href="/blog">The journal</Link></nav>
      <nav aria-label="Connect"><span className="astra-eyebrow astra-footer-nav-label">KEEP GOOD COMPANY</span><Link href="/sponsor">Brand partnerships <Arrow/></Link><a href="https://www.instagram.com/driveexotiq" target="_blank" rel="noopener noreferrer">Instagram <Arrow/></a><a href="https://www.youtube.com/@driveexotiq" target="_blank" rel="noopener noreferrer">YouTube <Arrow/></a><a href="https://exotiq.ai" target="_blank" rel="noopener noreferrer">For fleet operators <Arrow/></a></nav>
    </div>
    <div className="astra-footer-wordmark" aria-hidden="true">drive<span>exotiq</span></div>
    <div className="astra-footer-legal"><p>© {new Date().getFullYear()} Exotiq Inc.</p><span>AN EXOTIQ INC. BRAND</span><nav aria-label="Legal"><Link href="/privacy">Privacy</Link><Link href="/terms">Terms</Link><Link href="/cookies">Cookies</Link><Link href="/sms">SMS</Link><Link href="/dmca">DMCA</Link><CookieSettingsButton/></nav></div>
  </div></footer>;
}
