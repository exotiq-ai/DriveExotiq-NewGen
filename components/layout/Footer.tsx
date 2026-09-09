import Link from "next/link";
import Arrow from "@/components/ui/Arrow";
import Emblem from "@/components/ui/Emblem";
import CookieSettingsButton from "@/components/CookieSettingsButton";
export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="site-wrap">
        <div className="site-footer-top">
          <div>
            <span className="site-eyebrow site-footer-kicker">
              <span className="site-live-dot" /> THE NEXT GREAT DRIVE STARTS
              HERE
            </span>
            <p>
              See you
              <br />
              <em>out there.</em>
            </p>
          </div>
          <Link
            href="/apply?interest=drives"
            className="site-footer-circle"
            aria-label="Get on the list"
          >
            <Arrow />
          </Link>
        </div>
        <div className="site-footer-grid">
          <div className="site-footer-note">
            <Emblem className="site-footer-emblem" />
            <p>
              A community for the people
              <br />
              who actually drive the car.
            </p>
            <span className="site-footer-tagline">
              Born in Colorado. Driven everywhere.
            </span>
          </div>
          <nav aria-label="Explore">
            <span className="site-eyebrow site-footer-nav-label">
              TAKE A LOOK AROUND
            </span>
            <Link href="/drives">The drives</Link>
            <Link href="/tour">The roadbook</Link>
            <Link href="/marketplace">The garage</Link>
            <Link href="/blog">The journal</Link>
          </nav>
          <nav aria-label="Connect">
            <span className="site-eyebrow site-footer-nav-label">
              KEEP GOOD COMPANY
            </span>
            <Link href="/sponsor">
              Brand partnerships <Arrow />
            </Link>
            <a
              href="https://www.instagram.com/driveexotiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram <Arrow />
            </a>
            <a
              href="https://www.youtube.com/@driveexotiq"
              target="_blank"
              rel="noopener noreferrer"
            >
              YouTube <Arrow />
            </a>
            <a
              href="https://exotiq.ai"
              target="_blank"
              rel="noopener noreferrer"
            >
              For fleet operators <Arrow />
            </a>
          </nav>
        </div>
        <div className="site-footer-wordmark" aria-hidden="true">
          drive<span>exotiq</span>
        </div>
        <div className="site-footer-legal">
          <p>© {new Date().getFullYear()} Exotiq Inc.</p>
          <span>AN EXOTIQ INC. BRAND</span>
          <nav aria-label="Legal">
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
            <Link href="/cookies">Cookies</Link>
            <Link href="/sms">SMS</Link>
            <Link href="/dmca">DMCA</Link>
            <CookieSettingsButton />
          </nav>
        </div>
      </div>
    </footer>
  );
}
