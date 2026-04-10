# GSAP Animation Skill
# Read this before writing any GSAP code in any component.

## The non-negotiable rules

### 1. useGSAP always — useEffect never
```ts
// WRONG — memory leaks, SSR issues, no automatic cleanup
useEffect(() => {
  gsap.to('.box', { opacity: 1 })
  return () => gsap.killTweensOf('.box')
}, [])

// CORRECT — automatic cleanup, SSR-safe, scoped
import { useGSAP } from '@gsap/react'
useGSAP(() => {
  gsap.to(boxRef.current, { opacity: 1 })
}, { scope: containerRef })
```

### 2. Always import from @/lib/gsap
```ts
// WRONG — plugins not registered, duplicated imports
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

// CORRECT — registered once in lib/gsap.ts, imported everywhere
import { gsap, ScrollTrigger, SplitText } from '@/lib/gsap'
```

### 3. Always use the visibility trick with SplitText
```tsx
// JSX — hide the element before mount
<h1 ref={headlineRef} style={{ visibility: 'hidden' }}>Headline text</h1>

// useGSAP — reveal after splitting, before animating
const split = new SplitText(headlineRef.current, { type: 'chars,words' })
gsap.set(headlineRef.current, { visibility: 'visible' }) // ← reveal here
gsap.from(split.chars, { opacity: 0, y: 60, stagger: 0.018, duration: 0.9 })

// cleanup — always
return () => split.revert()
```

### 4. Always wrap in delayedCall for hydration safety
```ts
useGSAP(() => {
  gsap.delayedCall(0.1, () => {
    // ALL animations go inside here
    // Prevents GSAP running before React hydration completes
  })
}, { scope: containerRef })
```

### 5. Only animate transform and opacity
```ts
// WRONG — triggers layout recalculation, causes jank
gsap.to(el, { width: 200, height: 100, padding: 20, top: 50 })

// CORRECT — compositor-only, silky smooth
gsap.to(el, { x: 200, y: 100, scale: 1.05, opacity: 1 })
```

### 6. will-change for scroll-animated elements
Add `will-change: transform` to elements that will be animated by ScrollTrigger
(parallax, pinned elements, scrubbed animations). This promotes them to their
own compositor layer before animation starts.

```tsx
// In JSX — on the element that will be parallaxed
<div ref={parallaxRef} style={{ willChange: 'transform' }}>

// Remove it when animation is done to free GPU memory
gsap.to(parallaxRef.current, {
  y: -40,
  scrollTrigger: { ... },
  onComplete: () => {
    if (parallaxRef.current) {
      parallaxRef.current.style.willChange = 'auto'
    }
  }
})
```

Do NOT add will-change to every animated element — only elements with
scroll-driven or looping animations. Overusing will-change wastes GPU memory.

---

## Standard patterns

### Entrance — single element
```ts
gsap.from(ref.current, {
  opacity: 0,
  y: 40,
  duration: 1,
  ease: 'power3.out',
  delay: 0.2,
})
```

### Entrance — staggered group
```ts
gsap.from(itemRefs.current, {
  opacity: 0,
  y: 50,
  duration: 1,
  ease: 'power3.out',
  stagger: 0.12,
  scrollTrigger: {
    trigger: containerRef.current,
    start: 'top 75%',
    markers: false,
  },
})
```

### SplitText — word reveal (section headlines)
```ts
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
return () => split.revert()
```

### SplitText — char cascade (hero only)
```ts
const split = new SplitText(headlineRef.current, { type: 'chars,words' })
gsap.set(headlineRef.current, { visibility: 'visible' })
gsap.from(split.chars, {
  opacity: 0,
  y: 60,
  rotateX: 40,
  transformOrigin: '0% 50% -50',
  duration: 0.9,
  ease: 'power3.out',
  stagger: 0.018,
  delay: 0.4,
})
return () => split.revert()
```

### ScrollTrigger — standard entrance
```ts
scrollTrigger: {
  trigger: ref.current,
  start: 'top 75%',
  toggleActions: 'play none none none', // play once, no reverse
  markers: false,                        // NEVER true in production
}
```

### Parallax scrub
```ts
// Add will-change to the element in JSX first
gsap.to(innerRef.current, {
  y: -40,
  ease: 'none',
  scrollTrigger: {
    trigger: outerRef.current,
    start: 'top bottom',
    end: 'bottom top',
    scrub: 1.5,
    markers: false,
  },
})
```

### Nav background on scroll
```ts
ScrollTrigger.create({
  start: 'top -80',
  end: 'max',
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
```

### Counter animation
```ts
const obj = { val: 0 }
gsap.to(obj, {
  val: 340,
  duration: 2,
  ease: 'power2.out',
  onUpdate: () => {
    if (statRef.current) statRef.current.textContent = Math.round(obj.val) + '+'
  },
  scrollTrigger: {
    trigger: statRef.current,
    start: 'top 80%',
    markers: false,
  },
})
```

### Full hero timeline
```ts
useGSAP(() => {
  gsap.delayedCall(0.1, () => {
    const split = new SplitText(headlineRef.current, { type: 'chars,words' })
    gsap.set(headlineRef.current, { visibility: 'visible' })

    const tl = gsap.timeline()
    tl.from(eyebrowRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 0.2)
      .from(split.chars, {
        opacity: 0, y: 60, rotateX: 40,
        transformOrigin: '0% 50% -50',
        stagger: 0.018, duration: 0.9, ease: 'power3.out',
      }, 0.4)
      .from(subtextRef.current, { opacity: 0, y: 20, duration: 0.8, ease: 'power3.out' }, 1.4)
      .from(ctaRef.current, { opacity: 0, duration: 0.6, ease: 'power2.out' }, 1.8)

    return () => {
      tl.kill()
      split.revert()
    }
  })
}, { scope: containerRef })
```

### Using gsap.context() for sections with many elements
For sections with 5+ animated elements, prefer context over individual refs:
```ts
useGSAP(() => {
  const ctx = gsap.context(() => {
    gsap.delayedCall(0.1, () => {
      gsap.from('.card', { opacity: 0, y: 50, stagger: 0.12, duration: 1 })
      gsap.from('.stat', { opacity: 0, y: 30, stagger: 0.1, duration: 0.8 })
      // gsap.context scopes all selectors to containerRef
    })
  }, containerRef)
  return () => ctx.revert() // cleans up everything at once
}, { scope: containerRef })
```

---

## Common mistakes quick reference

| Mistake | Fix |
|---------|-----|
| `useEffect` for GSAP | `useGSAP` always |
| `import { gsap } from 'gsap'` in components | `import from '@/lib/gsap'` |
| SplitText — text flashes before animating | visibility hidden/visible trick |
| No `split.revert()` in cleanup | Always in useGSAP return |
| `markers: true` shipped to production | Always `markers: false` |
| Animating `width`, `height`, `top`, `left` | Animate `x`, `y`, `scale`, `opacity` |
| No `gsap.delayedCall` wrapper | Wrap everything — hydration safety |
| Missing `'use client'` on animated component | Required for all GSAP components |
| `will-change: transform` on every element | Only on scroll-parallax elements |
| Not removing `will-change` after animation | Remove in `onComplete` callback |
| Many ScrollTriggers never cleaned up | Use `gsap.context()` for bulk cleanup |
