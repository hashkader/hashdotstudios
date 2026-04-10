'use client'

import { useRef, useState } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, SplitText } from '@/lib/gsap'

const services = [
  { id: 'handover', label: 'Build & Handover', description: 'One-time build, full handover to you' },
  { id: 'maintain', label: 'Develop & Maintain', description: 'We build it, host it, and keep it running' },
  { id: 'hybrid', label: 'Handover + Maintain', description: 'Handover with optional ongoing retainer' },
]

const contactDetails = [
  { label: 'Email', value: 'hashkader07@gmail.com', href: 'mailto:hashkader07@gmail.com' },
  { label: 'Phone', value: '084 786 4747', href: 'tel:+27847864747' },
  { label: 'Location', value: 'Johannesburg, South Africa', href: null },
]

export default function Contact() {
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)
  const formRef = useRef<HTMLDivElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)
  const [selectedService, setSelectedService] = useState<string>('')

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current) return

    gsap.delayedCall(0.1, () => {
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

      gsap.from(infoRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: infoRef.current,
          start: 'top 78%',
          markers: false,
        },
      })

      gsap.from(formRef.current, {
        opacity: 0,
        y: 30,
        duration: 0.9,
        ease: 'power3.out',
        delay: 0.15,
        scrollTrigger: {
          trigger: formRef.current,
          start: 'top 78%',
          markers: false,
        },
      })

      return () => split.revert()
    })
  }, { scope: containerRef })

  return (
    <section id="contact" ref={containerRef} className="site-contact">
      {/* Header */}
      <div className="flex flex-col gap-4 mb-16">
        <p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-accent">
          05 — Get in touch
        </p>
        <h2
          ref={headlineRef}
          className="contact-headline"
          style={{ visibility: 'hidden' }}
        >
          Let&rsquo;s build something<br />worth visiting.
        </h2>
      </div>

      {/* Two-column grid */}
      <div className="contact-grid">
        {/* Left — info */}
        <div ref={infoRef} className="flex flex-col gap-12">
          <p className="font-body font-light text-brand-secondary leading-relaxed" style={{ fontSize: 'clamp(1rem, 1.3vw, 1.1rem)' }}>
            Tell us about your business and what you&rsquo;re looking to build. We&rsquo;ll come back to you within one business day with a clear scope and a fixed quote.
          </p>

          {/* Contact details */}
          <div className="flex flex-col gap-6">
            {contactDetails.map((detail) => (
              <div key={detail.label} className="flex flex-col gap-1 pb-6 border-b border-brand-border last:border-0 last:pb-0">
                <span className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-tertiary">
                  {detail.label}
                </span>
                {detail.href ? (
                  <a
                    href={detail.href}
                    className="font-body font-light text-brand-primary hover:text-brand-accent transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent"
                  >
                    {detail.value}
                  </a>
                ) : (
                  <span className="font-body font-light text-brand-primary">
                    {detail.value}
                  </span>
                )}
              </div>
            ))}
          </div>

          {/* Testimonial */}
          <div className="flex flex-col gap-4 p-6 bg-brand-surface">
            <p className="font-body font-light text-brand-secondary text-sm leading-relaxed">
              &ldquo;hashdotstudios delivered our site in under three weeks. Clean, fast, and exactly what we asked for — without a single surprise invoice.&rdquo;
            </p>
            <div className="flex flex-col gap-0.5">
              <span className="font-display font-semibold text-brand-primary text-sm">Thabo M.</span>
              <span className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brand-tertiary">Founder, Meridian Properties</span>
            </div>
          </div>
        </div>

        {/* Right — form */}
        <div ref={formRef}>
          <form
            onSubmit={(e) => e.preventDefault()}
            className="flex flex-col gap-8"
            noValidate
          >
            {/* Name + Email row */}
            <div className="form-row">
              <div className="form-field">
                <label htmlFor="contact-name" className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-tertiary">
                  Name
                </label>
                <input
                  id="contact-name"
                  type="text"
                  name="name"
                  placeholder="Your name"
                  required
                  autoComplete="name"
                  className="form-input"
                />
              </div>
              <div className="form-field">
                <label htmlFor="contact-email" className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-tertiary">
                  Email
                </label>
                <input
                  id="contact-email"
                  type="email"
                  name="email"
                  placeholder="you@company.com"
                  required
                  autoComplete="email"
                  className="form-input"
                />
              </div>
            </div>

            {/* Company */}
            <div className="form-field">
              <label htmlFor="contact-company" className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-tertiary">
                Company <span className="normal-case tracking-normal opacity-50">(optional)</span>
              </label>
              <input
                id="contact-company"
                type="text"
                name="company"
                placeholder="Your business name"
                autoComplete="organization"
                className="form-input"
              />
            </div>

            {/* Service selector */}
            <fieldset className="flex flex-col gap-3 border-0">
              <legend className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-tertiary mb-1">
                What are you looking for?
              </legend>
              {services.map((service) => (
                <label
                  key={service.id}
                  className={`flex flex-col gap-0.5 p-4 border cursor-pointer transition-colors duration-200
                    ${selectedService === service.id
                      ? 'border-brand-accent bg-brand-accent/5'
                      : 'border-brand-border hover:border-brand-border-strong'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="service"
                      value={service.id}
                      checked={selectedService === service.id}
                      onChange={() => setSelectedService(service.id)}
                      className="accent-brand-accent w-4 h-4 shrink-0"
                    />
                    <span className="font-body font-medium text-brand-primary text-sm">
                      {service.label}
                    </span>
                  </div>
                  <p className="font-body font-light text-brand-tertiary text-xs pl-7">
                    {service.description}
                  </p>
                </label>
              ))}
            </fieldset>

            {/* Message */}
            <div className="form-field">
              <label htmlFor="contact-message" className="font-mono text-[0.6rem] uppercase tracking-[0.2em] text-brand-tertiary">
                Tell us about your project
              </label>
              <textarea
                id="contact-message"
                name="message"
                placeholder="What does your business do, and what do you need from your website?"
                required
                className="form-input form-textarea"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="font-mono text-[0.75rem] uppercase tracking-[0.15em]
                bg-brand-accent text-brand-base border border-brand-accent
                px-8 h-13 w-full
                inline-flex items-center justify-center
                hover:bg-brand-accent-hover hover:border-brand-accent-hover
                transition-colors duration-300
                focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-accent
                cursor-pointer"
            >
              Book a Consultation →
            </button>

            <p className="font-mono text-[0.6rem] uppercase tracking-[0.15em] text-brand-tertiary text-center">
              We respond within one business day
            </p>
          </form>
        </div>
      </div>
    </section>
  )
}
