# Ysis V2 Motion Guidelines

Status: current landing and tool flow use local Framer Motion patterns directly in their components.

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
- Elegant microinteractions with Framer Motion.

## Current Foundation

- Landing and `/ferramenta` components currently implement motion locally with Framer Motion and CSS animation.
- No shared GSAP, Lenis or Three.js runtime helper is active after the Phase 3 cleanup.

## Accessibility

Always respect `prefers-reduced-motion`. Provide static or reduced movement states for all important content.

## Performance Rules

- Prefer transform and opacity.
- Avoid animating layout-heavy properties.
- Keep 3D elements light.
- Test desktop and mobile before final approval.
