# Performance & Animation System Notes

## Animation System Architecture

The site uses a three-tier motion hierarchy implemented in `/lib/animations.ts`:

### Primary Motion
- **Hero entrance**: Cinematic load-in with fade, slide-up, and subtle scale
- **Major section scene changes**: Transform-based parallax using Framer Motion's `useScroll` and `useTransform`

### Secondary Motion
- **Staggered section/content reveals**: Using `staggerContainer` and `staggerItem` variants
- **Scroll-triggered animations**: Smooth, reversible animations synced with scroll

### Tertiary Motion
- **Micro-interactions**: Button hover, card hover, magnetic effects
- **Cursor states**: Default, hover, pressed with scale/rotate/glow

## Performance Optimizations

### GPU-Accelerated Transforms
- All animations use `transform` and `opacity` only (no layout properties)
- `translate3d()` for hardware acceleration
- `will-change` used sparingly and removed after animations

### Image Optimization
- Next.js Image component with `loading="lazy"`
- `quality={85}` for optimal balance
- Proper `sizes` attribute for responsive images
- WebP format where possible

### Reduced Motion Support
- All animations respect `prefers-reduced-motion`
- `shouldReduceMotion()` utility checks both user preference and system setting
- `getMotionVariants()` provides motion-safe variants

### Scroll Performance
- Debounced scroll handlers where needed
- `passive: true` event listeners
- RequestAnimationFrame for cursor updates
- Framer Motion's `useScroll` for efficient scroll tracking

## Accessibility

### Keyboard Navigation
- All interactive elements are keyboard accessible
- Focus states visible with `focus-visible:ring-2`
- Proper `tabIndex` and `aria-label` attributes

### Semantic HTML
- Proper heading hierarchy (h1, h2, h3)
- `role` attributes where needed
- `aria-hidden` for decorative elements

### Reduced Motion
- System preference detection
- UI toggle for reduced motion (if implemented)
- Instant animations for reduced motion users

## Component Structure

- **Hero.tsx**: Cinematic entrance with transform-based parallax
- **Manifesto.tsx**: Line-by-line reveal with justified typography
- **OfferingsGrid.tsx**: Staggered card entrances with hover lifts
- **SchoolToggle.tsx**: Masked slide transitions
- **SocialsFooter.tsx**: Fanned cards with smooth transforms
- **AlcovianCursor.tsx**: rAF-driven cursor with distinct states

## Best Practices

1. **Always use transform/opacity** - Never animate layout properties
2. **Respect reduced motion** - Check `shouldReduceMotion()` before animating
3. **Lazy load images** - Use `loading="lazy"` for below-fold content
4. **Optimize assets** - Compress images, use WebP/AVIF
5. **Test on mobile** - Ensure animations perform well on low-end devices

