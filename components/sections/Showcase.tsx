'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'

const projects = [
  {
    number: '01',
    name: 'Verdant',
    category: 'Restaurant & Hospitality',
    year: '2025',
    description: 'Online presence and table booking for a Joburg farm-to-table concept.',
    accent: '#2d5a27',
    bg: 'linear-gradient(135deg, #1a2e18 0%, #0d1a0c 50%, #1f3a1c 100%)',
  },
  {
    number: '02',
    name: 'Meridian Properties',
    category: 'Real Estate',
    year: '2025',
    description: 'Listing platform and lead capture for a boutique property firm.',
    accent: '#b8976a',
    bg: 'linear-gradient(135deg, #1e1810 0%, #120f0a 50%, #201a11 100%)',
  },
  {
    number: '03',
    name: 'Soma Studio',
    category: 'Wellness & Fitness',
    year: '2024',
    description: 'Booking-first website for a private Pilates and movement studio.',
    accent: '#c4a882',
    bg: 'linear-gradient(135deg, #1e1a18 0%, #130f0d 50%, #201c1a 100%)',
  },
  {
    number: '04',
    name: 'Flint Legal',
    category: 'Professional Services',
    year: '2024',
    description: 'Authority-building site and contact funnel for a two-partner law firm.',
    accent: '#4a6fa5',
    bg: 'linear-gradient(135deg, #0f1520 0%, #090d14 50%, #111828 100%)',
  },
]

export default function Showcase() {
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const galleryRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current || !galleryRef.current) return

    gsap.delayedCall(0.1, () => {
      // Headline word reveal
      const split = new SplitText(headlineRef.current, { type: 'words' })
      gsap.set(headlineRef.current, { visibility: 'visible' })

      gsap.from(split.words, {
        opacity: 0,
        y: 30,
        duration: 0.8,
        ease: 'power3.out',
        stagger: 0.08,
        scrollTrigger: {
          trigger: headlineRef.current,
          start: 'top 78%',
          markers: false,
        },
      })

      // Cards stagger in
      const cards = galleryRef.current!.querySelectorAll<HTMLElement>('.gallery-card')
      gsap.from(cards, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: galleryRef.current,
          start: 'top 80%',
          markers: false,
        },
      })

      return () => split.revert()
    })

    // Click-drag to scroll
    const gallery = galleryRef.current
    let startX = 0
    let scrollLeft = 0

    const onDragMove = (e: PointerEvent) => {
      gallery.scrollLeft = scrollLeft - (e.clientX - startX) * 1.5
    }
    const onDragEnd = () => {
      gallery.style.cursor = 'grab'
      document.removeEventListener('pointermove', onDragMove)
      document.removeEventListener('pointerup', onDragEnd)
    }
    const onPointerDown = (e: PointerEvent) => {
      startX = e.clientX
      scrollLeft = gallery.scrollLeft
      gallery.style.cursor = 'grabbing'
      document.addEventListener('pointermove', onDragMove)
      document.addEventListener('pointerup', onDragEnd)
    }

    gallery.addEventListener('pointerdown', onPointerDown)

    return () => {
      gallery.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('pointermove', onDragMove)
      document.removeEventListener('pointerup', onDragEnd)
    }
  }, { scope: containerRef })

  return (
    <section id="work" ref={containerRef} className="site-showcase">
      {/* Header */}
      <div className="showcase-header flex items-end justify-between gap-8">
        <div className="flex flex-col gap-4">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-accent">
            03 — Selected work
          </p>
          <h2
            ref={headlineRef}
            className="showcase-headline"
            style={{ visibility: 'hidden' }}
          >
            Built for results,<br />remembered for craft.
          </h2>
        </div>
        <p className="font-body font-light text-brand-secondary text-sm max-w-[32ch] text-right pb-2">
          A selection of recent projects — each one scoped, designed, and delivered from scratch.
        </p>
      </div>

      {/* Horizontal scroll gallery */}
      <div ref={galleryRef} className="gallery-scroll">
        {projects.map((project) => (
          <article key={project.number} className="gallery-card group">
            {/* Placeholder image treatment */}
            <div
              className="absolute inset-0"
              style={{ background: project.bg }}
            />

            {/* Bottom gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)',
              }}
            />

            {/* Ghost number */}
            <span
              className="absolute top-6 right-6 font-display font-bold leading-none pointer-events-none select-none"
              style={{
                fontSize: '6rem',
                color: 'rgba(255,255,255,0.06)',
                letterSpacing: '-0.04em',
              }}
              aria-hidden="true"
            >
              {project.number}
            </span>

            {/* Accent dot */}
            <div
              className="absolute top-6 left-6 w-2 h-2 rounded-full"
              style={{ backgroundColor: project.accent }}
            />

            {/* Card label */}
            <div className="card-label">
              <p className="font-mono text-[0.6rem] uppercase tracking-[0.25em] mb-2" style={{ color: project.accent }}>
                {project.category} — {project.year}
              </p>
              <h3 className="font-display font-bold text-white mb-2" style={{ fontSize: 'clamp(1.4rem, 2.5vw, 1.75rem)', letterSpacing: '-0.02em' }}>
                {project.name}
              </h3>
              <p className="font-body font-light text-white/70 text-sm leading-snug">
                {project.description}
              </p>
            </div>
          </article>
        ))}
      </div>

      {/* Scroll hint */}
      <div className="showcase-hint flex items-center gap-3 px-[max(4rem,8vw)]">
        <div className="w-8 h-px bg-brand-border-strong" />
        <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-tertiary">
          Scroll to explore
        </span>
      </div>
    </section>
  )
}
