'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null)
  const eyebrowRef = useRef<HTMLParagraphElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const subtextRef = useRef<HTMLParagraphElement>(null)
  const ctaRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (
      !containerRef.current ||
      !eyebrowRef.current ||
      !headlineRef.current ||
      !subtextRef.current ||
      !ctaRef.current
    ) return

    gsap.delayedCall(0.1, () => {
      const split = new SplitText(headlineRef.current, { type: 'chars,words' })
      gsap.set(headlineRef.current, { visibility: 'visible' })

      const tl = gsap.timeline()

      tl.from(lineRef.current, {
        scaleX: 0,
        transformOrigin: 'left center',
        duration: 0.9,
        ease: 'power3.inOut',
      }, 0)
        .from(eyebrowRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: 'power3.out',
        }, 0.2)
        .from(split.chars, {
          opacity: 0,
          y: 60,
          rotateX: 40,
          transformOrigin: '0% 50% -50',
          duration: 0.9,
          ease: 'power3.out',
          stagger: 0.016,
        }, 0.45)
        .from(subtextRef.current, {
          opacity: 0,
          y: 20,
          duration: 0.8,
          ease: 'power3.out',
        }, 1.3)
        .from(ctaRef.current, {
          opacity: 0,
          y: 16,
          duration: 0.7,
          ease: 'power3.out',
        }, 1.55)
        .from(scrollRef.current, {
          opacity: 0,
          duration: 0.6,
          ease: 'power2.out',
        }, 1.8)

      return () => {
        tl.kill()
        split.revert()
      }
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="site-hero">
      {/* Grain texture */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-1"
        style={{ opacity: 0.025 }}
        aria-hidden="true"
      >
        <filter id="hero-grain">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="3"
            stitchTiles="stitch"
          />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#hero-grain)" />
      </svg>

      {/* Content — sits above grain */}
      <div className="relative z-2 flex flex-col gap-8">
        {/* Accent line */}
        <div
          ref={lineRef}
          className="w-12 h-px bg-brand-accent"
          style={{ transformOrigin: 'left center' }}
        />

        {/* Eyebrow */}
        <p
          ref={eyebrowRef}
          className="hero-eyebrow font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-accent"
        >
          hashdotstudios
        </p>

        {/* Headline */}
        <h1
          ref={headlineRef}
          className="hero-headline"
          style={{ visibility: 'hidden' }}
        >
          Websites that<br />
          work harder.
        </h1>

        {/* Subtext */}
        <p
          ref={subtextRef}
          className="hero-subtext font-body font-light text-brand-secondary"
        >
          High-performance, beautifully crafted web experiences for small and
          medium businesses — without the agency price tag or the agency timeline.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="hero-cta-row mt-2">
          <Link
            href="#contact"
            className="font-mono text-[0.75rem] uppercase tracking-[0.15em]
              bg-brand-accent text-brand-base border border-brand-accent
              px-8 py-4 h-13
              inline-flex items-center justify-center
              hover:bg-brand-accent-hover hover:border-brand-accent-hover
              transition-colors duration-300
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            Book a Consultation →
          </Link>
          <Link
            href="#work"
            className="font-mono text-[0.75rem] uppercase tracking-[0.15em]
              bg-transparent text-brand-primary border border-brand-border-strong
              px-8 py-4 h-13
              inline-flex items-center justify-center
              hover:border-brand-primary transition-colors duration-300
              focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
          >
            View Our Work
          </Link>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        ref={scrollRef}
        className="scroll-indicator"
        aria-hidden="true"
      >
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.25em] text-brand-tertiary">
          Scroll
        </span>
        <div className="w-px h-12 bg-brand-border-strong mt-2 mx-auto" />
      </div>
    </section>
  )
}
