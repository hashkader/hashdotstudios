'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'

const steps = [
  {
    number: '01',
    title: 'Discovery',
    body: 'We start with a focused brief call — your goals, audience, and timeline. No lengthy discovery phases. We move fast without cutting corners.',
    duration: '1–2 days',
  },
  {
    number: '02',
    title: 'Design',
    body: 'Visual direction, layouts, and interactions crafted specifically for your brand. You review and approve before a single line of code is written.',
    duration: '3–5 days',
  },
  {
    number: '03',
    title: 'Build',
    body: 'Full engineering — performance-optimised, accessible, and built to last. You get a staging link and two rounds of revisions included.',
    duration: '1–2 weeks',
  },
  {
    number: '04',
    title: 'Launch',
    body: 'We handle deployment, domain setup, and final QA. Then you choose your path: full handover, or keep us on retainer to maintain and grow it.',
    duration: '1–2 days',
  },
]

export default function Process() {
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const stepsRef = useRef<HTMLDivElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current || !stepsRef.current) return

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

      // Steps stagger in
      const cards = stepsRef.current!.querySelectorAll<HTMLElement>('.step-item')
      gsap.from(cards, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: stepsRef.current,
          start: 'top 78%',
          markers: false,
        },
      })

      return () => split.revert()
    })
  }, { scope: containerRef })

  return (
    <section id="process" ref={containerRef} className="site-process">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-accent">
          04 — How it works
        </p>
        <div className="process-header flex items-end justify-between gap-8 flex-wrap">
          <h2
            ref={headlineRef}
            className="process-headline"
            style={{ visibility: 'hidden' }}
          >
            From brief to live<br />in weeks, not months.
          </h2>
          <p className="font-body font-light text-brand-secondary text-sm max-w-[36ch] pb-1">
            Our process is deliberately lean. No bloated project management, no disappearing for weeks, no surprise scope changes.
          </p>
        </div>
      </div>

      {/* Steps grid */}
      <div ref={stepsRef} className="steps-grid">
        {steps.map((step) => (
          <div key={step.number} className="step-item">
            <div className="step-number" aria-hidden="true">
              {step.number}
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="step-title">{step.title}</h3>
              <p className="font-body font-light text-brand-secondary text-sm leading-relaxed">
                {step.body}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <div className="w-4 h-px bg-brand-accent" />
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-accent">
                  {step.duration}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom note */}
      <div className="process-bottom flex items-center gap-6 mt-16 pt-10 border-t border-brand-border">
        <p className="font-body font-light text-brand-secondary text-sm max-w-[55ch]">
          Every project is fixed-scope and fixed-price. You know what you're getting before we start — no billing surprises, no scope creep.
        </p>
        {/* <a
          href="#contact"
          className="font-mono text-[0.7rem] uppercase tracking-[0.2em] text-brand-accent whitespace-nowrap
            hover:text-brand-primary transition-colors duration-300
            focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
        >
          Start a project →
        </a> */}
      </div>
    </section>
  )
}
