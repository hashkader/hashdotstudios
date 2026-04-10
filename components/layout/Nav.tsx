'use client'

import { useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    gsap.delayedCall(0.1, () => {
      // Entrance — fade in from top
      gsap.from(navRef.current, {
        opacity: 0,
        y: -16,
        duration: 0.8,
        ease: 'power3.out',
      })

      // Background on scroll
      ScrollTrigger.create({
        start: 'top -80',
        end: 'max',
        onEnter: () =>
          gsap.to(navRef.current, {
            backgroundColor: 'rgba(255,255,255,0.92)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 1px 0 rgba(0,0,0,0.08)',
            duration: 0.4,
          }),
        onLeaveBack: () =>
          gsap.to(navRef.current, {
            backgroundColor: 'transparent',
            backdropFilter: 'blur(0px)',
            boxShadow: '0 1px 0 rgba(0,0,0,0)',
            duration: 0.4,
          }),
      })
    })
  }, { scope: navRef })

  return (
    <nav
      ref={navRef}
      className="site-nav flex items-center justify-between px-[max(4rem,8vw)] py-6 text-brand-primary "
    >
      {/* Logo */}
      <Link
        href="/"
        className="flex items-center focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-brand-accent"
        aria-label="hashdotstudios — home"
      >
        <Image
          src="/images/logo.png"
          alt="hashdotstudios logo"
          width={32}
          height={32}
          style={{ objectFit: 'contain', objectPosition: 'left center' }}
          priority
        />
      </Link>

      {/* Nav links */}
      <div className="nav-links flex items-center gap-8">
        <Link
          href="#about"
          className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand-secondary hover:text-brand-primary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          About
        </Link>
        <Link
          href="#work"
          className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand-secondary hover:text-brand-primary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          Work
        </Link>
        <Link
          href="#process"
          className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand-secondary hover:text-brand-primary transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          Process
        </Link>
        <Link
          href="#contact"
          className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand-accent border border-brand-accent px-5 py-2.5 hover:bg-brand-accent hover:text-brand-base transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          Book a Consultation
        </Link>
      </div>
    </nav>
  )
}
