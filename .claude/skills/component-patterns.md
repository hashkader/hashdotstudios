# Component Patterns Skill
# Read this before building any section, UI component, or scaffolding.

## Tailwind utilities vs inline styles — the rule
Use Tailwind utility classes (generated from @theme tokens) for colors and layout.
Use inline styles only for values Tailwind can't express: clamp(), complex gradients,
dynamic runtime values.

RIGHT:
```tsx
<section className="site-hero bg-brand-base text-brand-primary">
<p className="text-brand-secondary font-body font-light">
<button className="bg-brand-accent text-brand-base hover:bg-brand-accent/80">
<div className="border border-brand-border">
```

WRONG:
```tsx
<section style={{ backgroundColor: 'var(--color-brand-base)' }}>
<p style={{ color: 'var(--color-brand-secondary)' }}>
<button style={{ backgroundColor: 'var(--color-brand-accent)' }}>
```

Inline styles are still correct for:
```tsx
// clamp() — Tailwind can't do this
<h1 style={{ fontSize: 'clamp(3.5rem, 8vw, 8rem)' }}>

// complex gradients
<div style={{ background: 'linear-gradient(135deg, #1a1410 0%, #0d0d0d 100%)' }}>

// dynamic values set by GSAP at runtime — GSAP handles these, not you
```

---

## Section component template

```tsx
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'

export default function SectionName() {
  const containerRef = useRef<HTMLElement>(null)
  const headlineRef = useRef<HTMLHeadingElement>(null)

  useGSAP(() => {
    if (!containerRef.current || !headlineRef.current) return
    gsap.delayedCall(0.1, () => {
      // animations — see .claude/skills/gsap.md for patterns
    })
  }, { scope: containerRef })

  return (
    <section ref={containerRef} className="site-[name] bg-brand-base">
      {/* content */}
    </section>
  )
}
```

## Static section (no animations — server component)
```tsx
// No 'use client' — renders on server, no JS bundle cost
export default function Footer() {
  return (
    <footer className="site-footer bg-brand-base border-t border-brand-border">
      {/* content */}
    </footer>
  )
}
```

## Nav template
### Logo image in Nav — critical alignment rule
Always use objectPosition: 'left center' on logo images to prevent 
intrinsic whitespace from breaking the visual grid alignment.
Set width to match the visible mark only — not the full image canvas.
The left edge of the logo mark must align with the left edge of all 
section content below it.

<Image
  src="/images/logo.png"
  alt="[Business name] logo"
  width={32}        // match visible mark width, not full image canvas
  height={32}
  style={{ objectFit: 'contain', objectPosition: 'left center' }}
  priority
/>

```tsx
'use client'

import { useRef } from 'react'
import { useGSAP } from '@gsap/react'
import { gsap, ScrollTrigger } from '@/lib/gsap'
import Link from 'next/link'

export default function Nav() {
  const navRef = useRef<HTMLElement>(null)

  useGSAP(() => {
    ScrollTrigger.create({
      start: 'top -80',
      onEnter: () => gsap.to(navRef.current, {
        backgroundColor: 'rgba(8,8,8,0.92)',
        backdropFilter: 'blur(12px)',
        duration: 0.4,
      }),
      onLeaveBack: () => gsap.to(navRef.current, {
        backgroundColor: 'transparent',
        backdropFilter: 'blur(0px)',
        duration: 0.4,
      }),
    })
  }, { scope: navRef })

  return (
    <nav ref={navRef} className="site-nav fixed top-0 left-0 right-0 z-50
      flex items-center justify-between px-[max(4rem,8vw)] py-7
      text-brand-primary">
      <span className="font-mono text-xs uppercase tracking-[0.2em] text-brand-accent">
        BUSINESS NAME
      </span>
      <div className="nav-links flex items-center gap-8">
        <Link href="#services"
          className="font-mono text-[0.7rem] uppercase tracking-widest
            text-brand-secondary hover:text-brand-primary transition-colors duration-300">
          Services
        </Link>
        <Link href="#contact"
          className="font-mono text-[0.7rem] uppercase tracking-widest
            text-brand-accent border border-brand-accent px-5 py-2.5
            hover:bg-brand-accent/10 transition-colors duration-300">
          Request a Tour
        </Link>
      </div>
    </nav>
  )
}
```

## Eyebrow label (used above every section headline)
```tsx
<p className="font-mono text-[0.7rem] uppercase tracking-[0.25em] text-brand-accent mb-4">
  01 — SECTION NAME
</p>
```

## Button — primary (filled)
```tsx
<button className="font-mono text-[0.75rem] uppercase tracking-[0.15em]
  bg-brand-accent text-brand-base border-0
  px-8 py-4 h-[52px]
  inline-flex items-center justify-center
  hover:bg-brand-accent/80 transition-colors duration-300
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent
  cursor-pointer">
  Request a Tour →
</button>
```

## Button — secondary (outlined)
```tsx
<button className="font-mono text-[0.75rem] uppercase tracking-[0.15em]
  bg-transparent text-brand-accent border border-brand-accent
  px-8 py-[14px]
  inline-flex items-center justify-center
  hover:bg-brand-accent/10 transition-colors duration-300
  focus-visible:outline focus-visible:outline-2 focus-visible:outline-brand-accent
  cursor-pointer">
  View Our Work →
</button>
```

## Card container with 1px gap dividers
The gap between cards IS the divider — the container background shows through:
```tsx
<div className="flex flex-row gap-px bg-brand-border">
  {cards.map(card => (
    <div key={card.id} className="flex-1 bg-brand-surface min-w-0 p-14">
      {/* card content */}
    </div>
  ))}
</div>
```

## Image — above fold (hero)
```tsx
import Image from 'next/image'

<div className="relative w-full h-full">
  <Image
    src="/images/hero.jpg"
    alt="[specific descriptive text]"
    fill
    priority           // ← critical for hero — preloads image
    style={{ objectFit: 'cover' }}
    sizes="100vw"
  />
</div>
```

## Image — below fold (property cards, gallery)
```tsx
<div className="relative w-full h-full">
  <Image
    src="/images/property.jpg"
    alt="[specific descriptive text — never empty]"
    width={420}
    height={560}
    style={{ objectFit: 'cover' }}
    sizes="(max-width: 768px) 100vw, 420px"
    // no priority — lazy loads by default
  />
</div>
```

## Image placeholder treatment (no real image yet)
Looks intentional, not broken. Use until real photography arrives.
```tsx
<div className="relative w-full h-full overflow-hidden" style={{
  background: 'linear-gradient(135deg, #1a1410 0%, #0d0d0d 40%, #1c1510 100%)',
}}>
  {/* Bottom fade — makes it feel like a real photo with depth */}
  <div className="absolute inset-0" style={{
    background: 'linear-gradient(to top, rgba(8,8,8,0.9) 0%, transparent 50%)',
  }} />
  {/* Ghost number — visual interest without content */}
  <span className="absolute bottom-[-1rem] right-6 font-display font-light
    text-white/[0.06] leading-none pointer-events-none select-none"
    style={{ fontSize: '8rem' }}>
    01
  </span>
</div>
```

## Grain/noise texture overlay (hero sections)
```tsx
<svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]"
  style={{ opacity: 0.035 }}>
  <filter id="grain">
    <feTurbulence type="fractalNoise" baseFrequency="0.65"
      numOctaves="3" stitchTiles="stitch" />
    <feColorMatrix type="saturate" values="0" />
  </filter>
  <rect width="100%" height="100%" filter="url(#grain)" />
</svg>
```

## Focus states — never remove, always style
```tsx
// All interactive elements need focus-visible styles
// Use Tailwind utilities:
className="focus-visible:outline focus-visible:outline-2
           focus-visible:outline-offset-2 focus-visible:outline-brand-accent"

// For inputs:
className="focus:border-brand-accent focus:outline-none"
```
