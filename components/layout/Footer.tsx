import Link from 'next/link'
import Image from 'next/image'

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Work', href: '#work' },
  { label: 'Process', href: '#process' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <div className="footer-inner">
        {/* Logo + tagline */}
        <div className="flex flex-col gap-3">
          <Image
            src="/images/logo.png"
            alt="hashdotstudios logo"
            width={100}
            height={28}
            style={{ objectFit: 'contain', maxHeight: '28px', filter: 'brightness(0) invert(1)' }}
          />
          <p className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-white/30">
            Fast. Beautiful. Yours.
          </p>
        </div>

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex flex-row gap-8 list-none">
            {navLinks.map((link) => (
              <li key={link.label}>
                <Link
                  href={link.href}
                  className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-white/40
                    hover:text-white transition-colors duration-300
                    focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-white/25">
          © {year} hashdotstudios
        </p>
      </div>
    </footer>
  )
}
