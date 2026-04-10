# Responsive Implementation Skill
# Loaded automatically when working on mobile/tablet layouts or breakpoints

## The single rule that overrides everything else
ALL responsive styles go in app/globals.css as @media queries.
NEVER add responsive styles as:
- Tailwind responsive prefixes (sm:, md:, lg:)
- Inline style objects with window width checks
- useEffect/useState window resize handlers for layout
- Separate CSS modules per component

One file. One place. All breakpoints.

---

## Setup — do this first in every project

### Step 1: Add root classNames to every component
Every section root element needs a unique className:

```tsx
// components/layout/Nav.tsx
<nav className="site-nav">...</nav>

// components/sections/Hero.tsx  
<section className="site-hero">...</section>

// components/sections/About.tsx
<section className="site-about">...</section>

// components/layout/Footer.tsx
<footer className="site-footer">...</footer>
```

Pattern: `site-[component-name]` — always hyphenated, always lowercase.

### Step 2: Add the responsive block to globals.css
At the very bottom of app/globals.css, after all base styles:

```css
/* ============================================
   RESPONSIVE — all breakpoints live here
   ============================================ */

@media (max-width: 1024px) {
  /* tablet styles */
}

@media (max-width: 768px) {
  /* mobile styles */
}
```

---

## Breakpoint targets

| Name | Max-width | Devices |
|------|-----------|---------|
| Tablet | 1024px | iPad landscape, small laptops |
| Mobile | 768px | iPad portrait, all phones |

Do not add more breakpoints than these two unless specifically requested.

---

## Standard responsive patterns

### Multi-column → single column
```css
@media (max-width: 768px) {
  .site-services .cards-row {
    flex-direction: column;
  }
  .site-services .card {
    width: 100%;
    min-height: 420px;
  }
}
```

### Grid → single column
```css
@media (max-width: 768px) {
  .site-process .steps-grid {
    grid-template-columns: 1fr;
  }
}
```

### Section padding reduction
```css
@media (max-width: 768px) {
  .site-about {
    padding: 5rem 1.5rem;
  }
}
@media (max-width: 1024px) {
  .site-about {
    padding: 8vw 2.5rem;
  }
}
```

### Left margin normalization
All sections use the same left margin on desktop: max(4rem, 8vw)
On mobile this becomes a fixed padding:
```css
@media (max-width: 768px) {
  .site-hero .content,
  .site-about .content,
  .site-services .header,
  .site-showcase .header,
  .site-process .header,
  .site-contact .content {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    margin-left: 0;
  }
}
```

### Typography scaling
```css
@media (max-width: 768px) {
  /* Reduce clamp() floor values — don't override clamp, set font-size directly */
  .site-hero .headline {
    font-size: clamp(2.8rem, 10vw, 5rem);
  }
  .site-about .editorial-line {
    font-size: clamp(1.8rem, 6vw, 2.5rem);
  }
}
```

### Hide decorative elements on mobile
Always hide these on mobile — they clutter small screens and often cause overflow:
```css
@media (max-width: 768px) {
  .site-hero .scroll-indicator,
  .site-about .vertical-label,
  .site-contact .ghost-text,
  .site-hero .background-word,
  [class*="vertical-label"],
  [class*="ghost-text"],
  [class*="scroll-indicator"] {
    display: none;
  }
}
```

### Form stacking
```css
@media (max-width: 768px) {
  .site-contact .form-row {
    flex-direction: column;
    gap: 1rem;
  }
  .site-contact .form-input {
    width: 100%;
    max-width: 100%;
  }
  .site-contact .form-button {
    width: 100%;
    justify-content: center;
  }
}
```

### Nav — hide links on mobile
```css
@media (max-width: 768px) {
  .site-nav .nav-links {
    display: none;
  }
  .site-nav {
    padding: 1.25rem 1.5rem;
  }
}
```

### Footer stacking
```css
@media (max-width: 768px) {
  .site-footer .footer-inner {
    flex-direction: column;
    gap: 2rem;
    align-items: flex-start;
  }
  .site-footer .footer-center {
    text-align: left;
    justify-content: flex-start;
  }
  .site-footer {
    padding: 2.5rem 1.5rem;
  }
}
```

### Horizontal scroll galleries (keep scrollable on mobile)
```css
@media (max-width: 768px) {
  .site-showcase .gallery-scroll {
    padding: 0 1.5rem 4rem 1.5rem;
  }
  .site-showcase .gallery-card {
    width: 300px;
    height: 460px;
    flex-shrink: 0;
  }
}
```

---

## Tap target minimum size
All interactive elements on mobile must be at least 44px tall:
```css
@media (max-width: 768px) {
  .site-nav a,
  .site-footer a {
    min-height: 44px;
    display: flex;
    align-items: center;
  }
}
```

---

## Overflow prevention
Add this to the mobile block — catches any accidental overflow:
```css
@media (max-width: 768px) {
  .site-hero,
  .site-about,
  .site-services,
  .site-process,
  .site-contact {
    overflow-x: hidden;
  }
}
```

---

## Reduced motion — always include this
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Checklist before calling responsive pass done
- [ ] No horizontal scroll at 375px (iPhone SE)
- [ ] No horizontal scroll at 768px (iPad portrait)
- [ ] All multi-column layouts stack on mobile
- [ ] All decorative elements hidden on mobile
- [ ] All font sizes readable (minimum 14px rendered)
- [ ] All tap targets 44px minimum
- [ ] Form inputs full width on mobile
- [ ] Nav links hidden on mobile
- [ ] Footer stacked on mobile
- [ ] No fixed-width elements wider than 100vw
