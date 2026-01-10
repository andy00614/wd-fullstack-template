---
name: frontend-design
description: Create distinctive, production-grade frontend interfaces with high design quality. Use when building web components, pages, dashboards, or applications. Generates creative, polished code that avoids generic AI aesthetics.
---

# Frontend Design

Create distinctive, production-grade frontend interfaces that prioritize avoiding generic aesthetics.

## Before Writing Code

Understand the context and commit to a bold aesthetic direction:

1. **Purpose**: What is this interface for? Who uses it?
2. **Tone**: Pick a specific direction (brutally minimal, maximalist chaos, retro-futuristic, etc.)
3. **Constraints**: Technical limitations, brand requirements
4. **Differentiator**: What ONE thing will make this memorable?

## Design Priorities

### Typography

Choose fonts that are beautiful, unique, and interesting. Never default to:
- Inter, Roboto, Arial, Helvetica (unless intentionally brutalist)

Instead consider:
- Display fonts for headers (Playfair Display, Space Grotesk, Clash Display)
- Unique body fonts (Outfit, Plus Jakarta Sans, General Sans)
- Mix weights dramatically (100 + 900)

### Color & Theme

Build cohesive palettes with intention:
- One dominant color (60%)
- One secondary color (30%)
- Sharp accent for CTAs (10%)

Avoid:
- Purple-to-pink gradients (AI cliche)
- Generic blue (#3B82F6 syndrome)
- Safe gray palettes

### Motion

Focus on high-impact moments:
- Micro-interactions on hover/focus
- Page transitions
- Scroll-triggered reveals
- Loading states as design opportunities

Use CSS animations and Framer Motion. Keep it purposeful.

### Composition

Break the grid intentionally:
- Asymmetry
- Overlapping elements
- Diagonal flow
- Negative space as design element
- Cards that break container boundaries

### Visual Details

Add depth and atmosphere:
- Subtle textures and grain
- Custom gradients (not linear defaults)
- Thoughtful shadows (layered, colored)
- Border treatments (not just `border-gray-200`)

## What to Avoid

These scream "AI generated":

| Element | Generic | Better |
|---------|---------|--------|
| Fonts | Inter, system-ui | Clash Display, Space Grotesk |
| Colors | Purple gradient, blue-500 | Custom palette with personality |
| Layout | Card grid, centered hero | Asymmetric, editorial |
| Icons | Heroicons defaults | Custom or curated set |
| Shadows | shadow-lg | Layered, colored shadows |
| Borders | border-gray-200 | Gradient borders, none, thick |

## Implementation with Tailwind + shadcn/ui

```tsx
// BAD: Generic AI output
<Card className="p-6 rounded-lg shadow-lg">
  <h2 className="text-2xl font-bold text-gray-900">Title</h2>
  <p className="text-gray-600">Description</p>
  <Button>Click me</Button>
</Card>

// GOOD: Distinctive design
<div className="group relative p-8 bg-zinc-950 border border-zinc-800
                hover:border-zinc-700 transition-all duration-500">
  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5
                  to-transparent opacity-0 group-hover:opacity-100
                  transition-opacity" />
  <h2 className="text-3xl font-light tracking-tight text-zinc-100">
    Title
  </h2>
  <p className="mt-2 text-zinc-500 font-mono text-sm">
    Description
  </p>
  <Button variant="ghost" className="mt-6 text-amber-500
                                      hover:text-amber-400 p-0">
    Click me
    <ArrowRight className="ml-2 h-4 w-4" />
  </Button>
</div>
```

## Questions to Ask Before Designing

1. What emotion should users feel?
2. What's the ONE memorable element?
3. How does this differ from competitors?
4. Where can I break expectations?
5. What details will reward close inspection?

## Final Check

Before submitting any UI:
- [ ] Would I screenshot this for my portfolio?
- [ ] Is there at least ONE unexpected element?
- [ ] Does it have a consistent, intentional aesthetic?
- [ ] Are the defaults challenged (fonts, colors, spacing)?
- [ ] Does motion enhance, not decorate?
