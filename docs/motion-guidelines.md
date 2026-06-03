# Ysis V2 Motion Guidelines

Status: foundation only. Motion primitives are prepared for the next landing implementation.

## Motion Purpose

Use motion for storytelling, hierarchy, feedback and state transitions. Do not add decorative motion without a role.

## Required Future Capabilities

- Scroll storytelling.
- Cinematic hero.
- Words or phrases appearing and disappearing on scroll.
- Organic 3D or pseudo-3D floating elements.
- Floating product mockups.
- Horizontal scrolling section.
- Translucent layers, blur, soft light and depth.
- Elegant microinteractions with Framer Motion and GSAP.

## Current Foundation

- `AnimatedPhrase` uses Framer Motion for scroll entrance.
- `FloatingMockup` uses Framer Motion for controlled floating.
- `HorizontalRail` provides a base for future horizontal sections.
- `loadScrollTrigger` centralizes GSAP ScrollTrigger registration.
- `createSmoothScroll` centralizes Lenis setup.

## Accessibility

Always respect `prefers-reduced-motion`. Provide static or reduced movement states for all important content.

## Performance Rules

- Prefer transform and opacity.
- Avoid animating layout-heavy properties.
- Keep 3D elements light.
- Test desktop and mobile before final approval.
