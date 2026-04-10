'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'

const pillars = [
  {
    number: '01',
    title: 'Engineering first',
    body: 'We build on Next.js with performance budgets baked in from day one. Core Web Vitals aren\'t an afterthought — they\'re our baseline.',
  },
  {
    number: '02',
    title: 'Design with intent',
    body: 'No templates, no themes. Every layout, typeface, and interaction is considered for your specific brand and audience.',
  },
  {
    number: '03',
    title: 'Priced for real businesses',
    body: 'Transparent, fixed pricing with no hidden agency fees. You get studio-quality work without the studio-size invoice.',
  },
]

export default function About() {
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const pillarsRef = useRef<HTMLDivElement>(null)
  const stat1Ref = useRef<HTMLSpanElement>(null)
  const stat2Ref = useRef<HTMLSpanElement>(null)
  const stat3Ref = useRef<HTMLSpanElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current || !pillarsRef.current) return

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
          start: 'top 75%',
          markers: false,
        },
      })

      // Stat 1: count 0→48, display as "48h"
      const obj1 = { val: 0 }
      gsap.to(obj1, {
        val: 48,
        duration: 2,
        ease: 'power2.out',
        onUpdate: () => {
          if (stat1Ref.current) {
            stat1Ref.current.textContent = `${Math.round(obj1.val)}h`
          }
        },
        scrollTrigger: {
          trigger: stat1Ref.current,
          start: 'top 85%',
          markers: false,
        },
      })

      // Stat 2: count 0→100, display as "100%"
      const obj2 = { val: 0 }
      gsap.to(obj2, {
        val: 100,
        duration: 1.8,
        ease: 'power2.out',
        delay: 0.2,
        onUpdate: () => {
          if (stat2Ref.current) {
            stat2Ref.current.textContent = `${Math.round(obj2.val)}%`
          }
        },
        scrollTrigger: {
          trigger: stat2Ref.current,
          start: 'top 85%',
          markers: false,
        },
      })

      // Stat 3: count 0→3, display as "3×"
      const obj3 = { val: 0 }
      gsap.to(obj3, {
        val: 3,
        duration: 1.5,
        ease: 'power2.out',
        delay: 0.4,
        onUpdate: () => {
          if (stat3Ref.current) {
            stat3Ref.current.textContent = `${Math.round(obj3.val)}×`
          }
        },
        scrollTrigger: {
          trigger: stat3Ref.current,
          start: 'top 85%',
          markers: false,
        },
      })

      // Pillars stagger
      const cards = pillarsRef.current!.querySelectorAll<HTMLElement>('.pillar-card')
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: {
          trigger: pillarsRef.current,
          start: 'top 75%',
          markers: false,
        },
      })

      return () => split.revert()
    })
  }, { scope: containerRef })

  return (
    <section id="about" ref={containerRef} className="site-about">
      <div className="about-grid">
        {/* Left — headline + intro */}
        <div className="flex flex-col gap-8">
          <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-accent">
            02 — What we do
          </p>

          <h2
            ref={headlineRef}
            className="about-headline"
            style={{ visibility: 'hidden' }}
          >
            We build websites that earn their keep.
          </h2>

          <p className="font-body font-light text-brand-secondary leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.15rem)' }}>
            hashdotstudios is a lean development studio based in Johannesburg. We partner with small and medium businesses who want a premium web presence — the kind that converts visitors into customers — without locking into an expensive agency retainer or waiting months for delivery.
          </p>

          {/* Stats row */}
          <div className="stats-row flex flex-row gap-10 mt-4 pt-8 border-t border-brand-border">
            <div className="flex flex-col gap-1">
              <span ref={stat1Ref} className="stat-value">0h</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brand-tertiary leading-snug" style={{ maxWidth: '12ch' }}>
                Average time to first draft
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span ref={stat2Ref} className="stat-value">0%</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brand-tertiary leading-snug" style={{ maxWidth: '12ch' }}>
                Projects delivered on time
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span ref={stat3Ref} className="stat-value">0×</span>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brand-tertiary leading-snug" style={{ maxWidth: '12ch' }}>
                Faster than a typical agency
              </span>
            </div>
          </div>
        </div>

        {/* Right — pillars */}
        <div ref={pillarsRef} className="flex flex-col gap-0 border-t border-brand-border">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="pillar-card flex flex-col gap-3 py-8 border-b border-brand-border"
            >
              <div className="flex items-baseline gap-4">
                <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brand-accent">
                  {pillar.number}
                </span>
                <h3 className="font-display font-semibold text-brand-primary" style={{ fontSize: 'clamp(1.1rem, 1.5vw, 1.25rem)' }}>
                  {pillar.title}
                </h3>
              </div>
              <p className="font-body font-light text-brand-secondary text-sm leading-relaxed pl-10">
                {pillar.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
