# ============================================================
# SECTION 1 — TECHNICAL RULES (never changes between clients)
# ============================================================
# These rules apply to every project. Do not modify per client.
# If something conflicts with the client brief below, the brief wins
# on design decisions, these rules win on technical decisions.

## Tech Stack
- Next.js 16+ (App Router, `app/` directory)
- React 19
- TypeScript — strict mode, zero `any` types, zero type assertions
- Tailwind CSS v4 (CSS-first — NO tailwind.config.js ever)
- GSAP 3.13+ with @gsap/react
- Framer Motion for route transitions and micro-interactions

---

## Fonts — ALWAYS next/font/google, NO EXCEPTIONS

NEVER use @import url('https://fonts.googleapis.com/...') anywhere.
NEVER use @import url() for fonts in globals.css.
NEVER load fonts from a CDN link in layout.tsx <head>.

ALWAYS load fonts in app/layout.tsx using next/font/google:

```ts
import { Cormorant_Garamond, DM_Sans, DM_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})
const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-body',
  display: 'swap',
})
const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['300', '400'],
  variable: '--font-mono',
  display: 'swap',
})

// Apply all three variables to <html>:
<html className={`${cormorant.variable} ${dmSans.variable} ${dmMono.variable}`}>
```

Why: next/font automatically self-hosts fonts, eliminates the Google Fonts
network request, prevents layout shift, and guarantees zero flash of
unstyled text. @import url() blocks rendering and introduces a round-trip
to Google's servers on every page load.

---

## Tailwind v4 — CRITICAL RULES

- NEVER create tailwind.config.js or tailwind.config.ts
- NEVER use @apply
- NEVER use @import url() for fonts — see Fonts section above
- ALL custom design tokens go in app/globals.css inside @theme {}
- Import Tailwind with @import "tailwindcss" as the FIRST line of globals.css

### @theme token naming convention
Tokens defined in @theme become Tailwind utility classes automatically.
Name them so the utilities read naturally:

```css
@import "tailwindcss";

@theme {
  /* These generate: bg-brand-base, bg-brand-surface, text-brand-primary etc. */
  --color-brand-base: #080808;
  --color-brand-surface: #0f0f0f;
  --color-brand-elevated: #161616;
  --color-brand-primary: #f5f0eb;
  --color-brand-secondary: #a09890;
  --color-brand-tertiary: #5a5450;
  --color-brand-accent: #c9a96e;
  --color-brand-border: rgba(255, 255, 255, 0.08);

  --font-display: 'Cormorant Garamond', Georgia, serif;
  --font-body: 'DM Sans', sans-serif;
  --font-mono: 'DM Mono', monospace;
}
```

### When to use Tailwind utilities vs inline styles vs CSS

USE Tailwind utility classes for:
- Layout (flex, grid, relative, absolute, overflow-hidden)
- Spacing (p-4, mt-8, gap-6)
- Colors from @theme (bg-brand-base, text-brand-primary, border-brand-border)
- Typography utilities (font-display, font-body, uppercase, tracking-widest)
- Sizing (w-full, h-screen, min-h-0)
- Transitions (transition-colors, duration-300)

USE inline styles for:
- Values that are dynamic or computed at runtime (GSAP sets these anyway)
- clamp() font sizes (Tailwind doesn't support arbitrary clamp natively)
- Complex gradients and background treatments
- Precise positioning values that aren't in the spacing scale

USE CSS in globals.css for:
- All @media responsive rules
- Pseudo-elements (::before, ::after)
- Complex selectors
- ::-webkit-scrollbar styling
- @keyframes

NEVER use raw var(--color-brand-accent) in JSX className or style props
when a Tailwind utility exists for that token. Use the utility class instead.

---

## GSAP — STRICT RULES
# Full patterns are in .claude/skills/gsap.md — read that file for examples

- ALWAYS use useGSAP hook from @gsap/react — NEVER useEffect for animations
- ALWAYS import gsap and all plugins from '@/lib/gsap' — never import directly
  from 'gsap' or 'gsap/ScrollTrigger' in component files
- lib/gsap.ts is the ONLY place plugins are registered
- ALWAYS revert() SplitText instances in the useGSAP cleanup return function
- ALWAYS use visibility:hidden on element, then gsap.set visible after SplitText
- NEVER animate layout properties (width, height, padding, margin, top, left)
- ONLY animate transform (x, y, scale, rotation) and opacity
- ALWAYS wrap entrance animations in gsap.delayedCall(0.1, () => {})
- NEVER ship ScrollTrigger with markers: true — always markers: false
- ADD will-change: transform to elements that will be GSAP-animated on scroll
  (parallax elements, pinned elements). Remove it after animation completes
  via onComplete callback to free GPU memory.
- ALWAYS call ScrollTrigger.refresh() after dynamic content loads

## Performance for animation-heavy pages
- Lazy load sections below the fold using React.lazy + Suspense, OR
  use Next.js dynamic() with ssr: false for heavy animated sections
- Hero section: eager load (above fold)
- All other sections: can be dynamically imported
- GSAP animations must never block the main thread on load:
  use gsap.delayedCall to defer until after paint
- SVG filters (grain/noise): keep feColorMatrix simple, avoid complex chains
- Limit simultaneous ScrollTrigger instances — kill triggers when component unmounts
- For sections with many animated elements: use gsap.context() and context.revert()
  instead of managing individual animation refs

---

## Responsiveness — STRICT RULES
# Full patterns are in .claude/skills/responsive.md

- ALL @media rules go in app/globals.css — never in component files
- Tailwind responsive prefixes (sm:, md:, lg:) are ALLOWED for layout utilities
  that don't conflict with the media query approach
- Custom values, spacing overrides, and complex responsive layouts
  go in globals.css @media blocks targeting site-* classNames
- ALWAYS add site-* className to every section root element
- Breakpoints: mobile ≤768px, tablet ≤1024px — no others
- ALWAYS include prefers-reduced-motion block in globals.css

---

## Image optimisation — next/image ALWAYS

```tsx
// Above-fold images (hero): priority={true}
<Image src="/images/hero.jpg" alt="..." fill priority
  style={{ objectFit: 'cover' }}
  sizes="100vw" />

// Below-fold images: no priority, add loading="lazy" (default)
<Image src="/images/property.jpg" alt="..."
  width={420} height={560}
  style={{ objectFit: 'cover' }}
  sizes="(max-width: 768px) 100vw, 420px" />
```

- ALWAYS provide sizes prop — prevents downloading oversized images
- ALWAYS provide descriptive alt text — never empty alt=""
- NEVER use <img> tags — always next/image
- Use fill + sizes="100vw" for full-bleed images
- Use explicit width + height for contained images

---

## Component Architecture

- Animated sections → "use client" at top of file
- Static sections (no interactivity, no hooks) → server components (no directive)
- Nav → "use client" (GSAP ScrollTrigger on scroll)
- Footer → server component
- Keep "use client" boundary as deep as possible — wrap only what needs it

## Dynamic imports for performance
For sections that are heavy and below the fold:
```tsx
// app/page.tsx
import dynamic from 'next/dynamic'

const Showcase = dynamic(() => import('@/components/sections/Showcase'), {
  ssr: false, // skip SSR for GSAP-heavy components if needed
})
```
Use this for any section with Three.js, complex canvas, or heavy GSAP timelines.

---

## File Structure — every project follows this exactly
```
app/
  layout.tsx          ← next/font, metadata, root layout (server)
  page.tsx            ← home: imports sections, dynamic() for below-fold
  globals.css         ← @import tailwindcss, @theme tokens, base styles,
                         ALL @media rules at bottom
  [page-name]/
    page.tsx          ← additional pages
components/
  sections/           ← Hero.tsx, About.tsx, Services.tsx etc.
  ui/                 ← Button.tsx, Tag.tsx, Card.tsx
  layout/             ← Nav.tsx, Footer.tsx
lib/
  gsap.ts             ← plugin registration + exports (only file that imports gsap directly)
public/
  images/             ← all client assets
.claude/
  skills/             ← gsap.md, responsive.md, component-patterns.md
```

## lib/gsap.ts — always this exact file, no variations
```ts
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText}
```

## globals.css structure — always in this order
```css
@import "tailwindcss";

@theme {
  /* all design tokens here */
}

/* Base styles */
*, *::before, *::after { box-sizing: border-box; }
html { ... }
body { ... }
::selection { ... }
::-webkit-scrollbar { ... }

/* Component-level styles that can't be done with utilities */

/* ── RESPONSIVE ─────────────────────────── */
@media (max-width: 1024px) { ... }
@media (max-width: 768px) { ... }
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Code Quality
- Zero TypeScript errors before moving to next section
- No unused imports
- No hardcoded hex colors in JSX — use Tailwind utilities from @theme tokens
- No placeholder lorem ipsum — write real copy from the brief below
- All interactive elements have visible hover AND focus-visible states
- focus-visible outlines must be styled (not removed) — use outline with brand colors
- No console.log statements in production code

## Build Order — always this sequence
1. lib/gsap.ts
2. app/globals.css (@theme tokens + base styles — no @media yet)
3. app/layout.tsx (next/font fonts + metadata)
4. components/layout/Nav.tsx
5. components/sections/ (one at a time — confirm zero TS errors before next)
6. components/layout/Footer.tsx
7. app/page.tsx (assemble sections, add dynamic() for below-fold sections)
8. Revision pass
9. Responsive pass (add all @media rules to globals.css)

# ============================================================
# SECTION 2 — CLIENT BRIEF (fill in per project)
# ============================================================

## Business
Name: hashdotstudios
Tagline: derive from business type and mood words
One-line description: Build high performance, beautiful but affordable websites for smaller businesses
Target customer: Small to medium businesses who want a premium web presence without agency pricing or agency timelines
Primary website goal: Show customers our engineering capabilites, and what they can expect from signing up with us
Secondary goals: Capture leads

## Pages / Sections to Build
[List in render order:]
- Hero
- About/What we do
- Projects Showcase
- Process
- Contact + Footer

## Aesthetic Direction
Mood words (must feel like): minimal, expressive, vibrant
Mood words (must NOT feel like): gloomy, neon, magazine-like
Direction: CLEAN MINIMAL


## Color Palette

OPTION B — Derive from direction:
  [dark luxury / warm editorial / clean minimal / bold creative]
  Reference palettes are in Section Reference Palettes below.

## Reference Palettes (for Option B)

CLEAN MINIMAL: bg #ffffff/#f7f7f7, text #0a0a0a/#555555, accent #0057ff
  Fonts: Cabinet Grotesk + DM Sans


## Typography
Display font: Cabinet Grotesk
Body font: DM Sans
Label font: none

## Logo
[A] File provided: public/images/logo.[ext] — max-height 32px in nav

## Content
Photography:  None — use placeholder treatments
Copy: We write from this brief
Testimonials: N provided (create dummy for now)
Contact details: email:hashkader07@gmail.com / phone:0847864747 / address:Johannesburg, South Africa 

## Services / Offerings
1. [Build and Handover]: Full development and handover to company including hosting costs etc, one time payment and we go our seperate ways
2. [Develop and Maintain]: Development and hosting done by hashdotstudios. Recurring monthly payment and 12 month contract required, but we maintin code including downtime etc
3. [Handover + Maintain]: Same as build and handover, but company can opt to retain hashdotstudios for a monthly fee for maintainance and downtime resolution, including content updates

## Copy & Voice
Brand voice: derive from mood words
CTA primary: Book a Consultation
CTA secondary: View Our Work

## Do NOT do on this project
- No generic AI defaults (purple gradients, Inter everywhere, card shadows)
- No lorem ipsum
- No features outside the scope listed above
