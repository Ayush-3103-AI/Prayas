# Design System Documentation

**Version:** 2.0.0  
**Last Updated:** 2024  
**Status:** Production Ready

## Table of Contents

1. [Overview](#overview)
2. [Design Tokens](#design-tokens)
3. [Component Patterns](#component-patterns)
4. [Accessibility Guidelines](#accessibility-guidelines)
5. [Animation Guidelines](#animation-guidelines)
6. [Migration Guide](#migration-guide)
7. [Usage Examples](#usage-examples)

---

## Overview

This design system provides a comprehensive, production-ready foundation for building accessible, consistent, and premium user interfaces. All design decisions prioritize:

- **WCAG 2.1 AA+ Compliance**: All colors meet minimum contrast requirements (4.5:1 for text, 3:1 for UI)
- **Consistency**: Unified token system ensures visual harmony
- **Accessibility**: Keyboard navigation, screen reader support, and focus management
- **Performance**: Optimized animations and transitions
- **Maintainability**: Semantic tokens enable easy theme updates

### Core Principles

1. **Semantic Over Literal**: Use semantic tokens (`--color-primary-500`) over literal values (`#6b8e6b`)
2. **Mobile-First**: All designs start with mobile and scale up
3. **Progressive Enhancement**: Base functionality works everywhere, enhanced features for capable devices
4. **Accessibility First**: Every component must be keyboard accessible and screen-reader friendly

---

## Design Tokens

### Color System

#### Semantic Colors

The color system uses semantic naming for maintainability:

```css
/* Primary (Green/Eco Theme) */
--color-primary-50   /* Lightest tint */
--color-primary-500  /* Base color */
--color-primary-900  /* Darkest shade */

/* Usage */
.button-primary {
  background-color: var(--color-primary-500);
  color: var(--color-text-on-primary);
}
```

**Available Semantic Colors:**
- `--color-primary-*` (Green/Eco theme)
- `--color-secondary-*` (Brown/Earthy theme)
- `--color-accent-*` (Amber/Gold)
- `--color-destructive-*` (Red/Error)
- `--color-success-*` (Green/Success)
- `--color-warning-*` (Orange/Warning)
- `--color-info-*` (Blue/Info)

#### Neutral Scale

For grayscale needs:

```css
--color-neutral-50   /* Almost white */
--color-neutral-500  /* Medium gray */
--color-neutral-900   /* Almost black */
```

#### Surface Colors

Paper and background variants:

```css
--color-paper-primary: #faf0e6    /* Base paper color */
--color-paper-secondary: #f5f5dc  /* Beige variant */
--color-paper-aged: #f4e4c1        /* Aged paper */
--color-paper-border: #d4c5b0     /* Border color */
```

#### Text Colors

All text colors meet WCAG AA+ contrast:

```css
--color-text-primary: #3d2817      /* Main text - 4.5:1+ on paper */
--color-text-secondary: #2c1810    /* Secondary text */
--color-text-muted: #6b5d4f        /* Muted text - 4.5:1+ on paper */
--color-text-inverse: #faf0e6      /* For dark backgrounds */
```

#### State Colors

Interactive states:

```css
--color-hover-primary: #5a7a5a
--color-active-primary: #496649
--color-focus-ring: #6b8e6b
--color-disabled-bg: rgba(250, 240, 230, 0.5)
```

### Typography System

#### Font Families

```css
--font-family-primary: 'Canva Sans', 'Inter', sans-serif
--font-family-heading: 'Canva Sans', 'Inter', sans-serif
--font-family-body: 'Canva Sans', 'Inter', sans-serif
--font-family-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace
```

#### Fluid Type Scale

Responsive typography using `clamp()`:

```css
--font-size-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem)   /* 12px-14px */
--font-size-base: clamp(1rem, 0.95rem + 0.25vw, 1.125rem)  /* 16px-18px */
--font-size-4xl: clamp(2.25rem, 1.95rem + 1.5vw, 3rem)      /* 36px-48px */
```

**Usage:**
```css
.heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-wide);
}
```

#### Font Weights

```css
--font-weight-normal: 400
--font-weight-medium: 500
--font-weight-semibold: 600
--font-weight-bold: 700
```

### Spacing System

4px base unit for consistent spacing:

```css
--spacing-1: 4px    /* 0.25rem */
--spacing-2: 8px    /* 0.5rem */
--spacing-4: 16px   /* 1rem */
--spacing-8: 32px   /* 2rem */
--spacing-16: 64px  /* 4rem */
```

**Semantic Spacing:**
```css
--spacing-xs: var(--spacing-1)   /* 4px */
--spacing-sm: var(--spacing-2)    /* 8px */
--spacing-md: var(--spacing-4)    /* 16px */
--spacing-lg: var(--spacing-6)    /* 24px */
--spacing-xl: var(--spacing-8)    /* 32px */
```

### Shadow & Elevation System

#### Elevation Levels

```css
--shadow-0: none
--shadow-1: 0 1px 2px 0 rgba(0, 0, 0, 0.05)
--shadow-3: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)
--shadow-6: 0 25px 50px -12px rgba(0, 0, 0, 0.25)
```

#### Paper Shadows

Enhanced shadows for RecycledPaperCard:

```css
--shadow-paper-sm: /* Small paper shadow */
--shadow-paper-md: /* Medium paper shadow */
--shadow-paper-lg: /* Large paper shadow */
--shadow-paper-xl: /* Extra large paper shadow */
```

#### Interactive Shadows

```css
--shadow-hover: /* Hover state elevation */
--shadow-focus: /* Focus state with ring */
--shadow-active: /* Active/pressed state */
```

### Border Radius

```css
--radius-xs: 2px
--radius-sm: 4px
--radius-md: 8px
--radius-lg: 12px
--radius-xl: 16px
--radius-full: 9999px

/* Component-specific */
--radius-button: var(--radius-full)
--radius-card: var(--radius-lg)
--radius-input: var(--radius-md)
```

### Animation & Transitions

#### Duration Scale

```css
--duration-instant: 75ms
--duration-fast: 100ms
--duration-base: 150ms
--duration-normal: 200ms
--duration-slow: 300ms
--duration-slower: 500ms
```

#### Easing Functions

```css
--ease-linear: linear
--ease-in: cubic-bezier(0.4, 0, 1, 1)
--ease-out: cubic-bezier(0, 0, 0.2, 1)
--ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring: cubic-bezier(0.175, 0.885, 0.32, 1.275)
```

#### Transition Presets

```css
--transition-fast: var(--duration-fast) var(--ease-out)
--transition-base: var(--duration-base) var(--ease-in-out)
--transition-all: all var(--duration-normal) var(--ease-in-out)
--transition-colors: color var(--duration-base) var(--ease-out), ...
```

### Glassmorphism System

```css
--blur-xs: 4px
--blur-sm: 8px
--blur-md: 12px
--blur-lg: 16px

--glass-bg-light: rgba(255, 255, 255, 0.5)
--glass-bg-medium: rgba(255, 255, 255, 0.7)
--glass-bg-strong: rgba(255, 255, 255, 0.85)
```

---

## Component Patterns

### Buttons

#### Variants

```tsx
<Button variant="default">Default</Button>
<Button variant="emerald">Primary Action</Button>
<Button variant="destructive">Delete</Button>
<Button variant="outline">Secondary</Button>
<Button variant="ghost">Tertiary</Button>
<Button variant="link">Link Style</Button>
```

#### States

All buttons include:
- `:hover` - Elevated shadow, color change
- `:focus-visible` - Visible focus ring (3px, 2px offset)
- `:active` - Pressed state (scale 0.98)
- `:disabled` - Reduced opacity, no pointer events

#### Accessibility

- Minimum 44x44px touch target
- Keyboard accessible (Enter/Space)
- Visible focus indicators
- ARIA labels for icon-only buttons

### Cards (RecycledPaperCard)

```tsx
<RecycledPaperCard showLines={true}>
  <h3>Card Title</h3>
  <p>Card content</p>
</RecycledPaperCard>
```

**Features:**
- Paper texture overlay
- Optional ruled lines
- Natural rotation (random -1.5° to 1.5°)
- Enhanced shadows with inset effects
- Hover lift effect

### Inputs

#### Text Input

```tsx
<Input
  type="text"
  placeholder="Enter text"
  aria-label="Text input"
/>
```

**States:**
- Default: Paper border, paper background
- Focus: Primary color border, focus ring
- Error: Destructive border, error message
- Disabled: Reduced opacity, no interaction

#### Validation States

```css
/* Error */
[aria-invalid="true"] {
  border-color: var(--color-destructive-500);
}

/* Success */
.success {
  border-color: var(--color-success-500);
}
```

### Forms

#### Field Group

```tsx
<div className="field-group">
  <Label htmlFor="email">Email</Label>
  <Input id="email" type="email" required />
  <span className="error-message" role="alert">
    Please enter a valid email
  </span>
</div>
```

**Best Practices:**
- Always associate labels with inputs (`htmlFor` + `id`)
- Use `role="alert"` for error messages
- Mark required fields with `[required]` or `.required`
- Provide clear error messages

---

## Accessibility Guidelines

### WCAG 2.1 AA+ Compliance

#### Color Contrast

**Text Contrast:**
- Normal text: Minimum 4.5:1 (AA), Target 7:1 (AAA)
- Large text (18px+): Minimum 3:1 (AA)

**UI Components:**
- Interactive elements: Minimum 3:1
- Focus indicators: High contrast (4.5:1+)

**Verification:**
All color combinations in the design system have been verified to meet WCAG 2.1 AA+ standards.

### Focus Management

#### Visible Focus Indicators

All interactive elements must have visible focus states:

```css
:focus-visible {
  outline: none;
  box-shadow: 
    0 0 0 2px var(--color-focus-ring-offset),
    0 0 0 5px var(--color-focus-ring);
}
```

#### Focus Trap

For modals and dialogs:

```tsx
<div className="focus-trap" role="dialog" aria-modal="true">
  {/* Modal content */}
</div>
```

### Keyboard Navigation

#### Tab Order

- Logical tab order (top to bottom, left to right)
- Skip links for main content
- Focus trap in modals

#### Keyboard Shortcuts

Common patterns:
- `Enter` / `Space`: Activate buttons
- `Escape`: Close modals
- `Tab`: Navigate forward
- `Shift+Tab`: Navigate backward

### Screen Reader Support

#### ARIA Labels

```tsx
<button aria-label="Close dialog">
  <XIcon />
</button>
```

#### Live Regions

```tsx
<div role="status" aria-live="polite">
  Form saved successfully
</div>

<div role="alert" aria-live="assertive">
  Error: Please check your input
</div>
```

#### Semantic HTML

Use semantic elements:
- `<button>` for actions
- `<a>` for navigation
- `<nav>` for navigation regions
- `<main>` for main content
- `<header>`, `<footer>` for page structure

### Touch Targets

Minimum 44x44px for all interactive elements:

```css
.touch-target {
  min-width: 44px;
  min-height: 44px;
}
```

---

## Animation Guidelines

### Principles

1. **Purposeful**: Animations should enhance understanding, not distract
2. **Performant**: Use `transform` and `opacity` for smooth 60fps animations
3. **Respectful**: Honor `prefers-reduced-motion`

### Micro-interactions

#### Button Press

```css
.press-effect:active {
  transform: scale(0.98);
  transition: transform var(--duration-fast);
}
```

#### Card Lift

```css
.lift-on-hover:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-hover);
  transition: transform var(--transition-transform), 
              box-shadow var(--transition-shadow);
}
```

#### Scale on Hover

```css
.scale-on-hover:hover {
  transform: scale(1.05);
  transition: transform var(--transition-transform);
}
```

### Page Transitions

#### Fade In

```css
.fade-in {
  animation: fadeIn var(--duration-normal) var(--ease-out);
}
```

#### Slide Up

```css
.slide-up {
  animation: slideUp var(--duration-normal) var(--ease-out);
}
```

### Reduced Motion

Always respect user preferences:

```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Migration Guide

### From Hardcoded Colors to Tokens

#### Before

```css
.button {
  background-color: #6b8e6b;
  color: #ffffff;
}
```

#### After

```css
.button {
  background-color: var(--color-primary-500);
  color: var(--color-text-on-primary);
}
```

### From Hardcoded Spacing to Tokens

#### Before

```css
.card {
  padding: 24px;
  margin-bottom: 16px;
}
```

#### After

```css
.card {
  padding: var(--spacing-6);
  margin-bottom: var(--spacing-4);
}
```

### From Hardcoded Shadows to Tokens

#### Before

```css
.card {
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}
```

#### After

```css
.card {
  box-shadow: var(--shadow-3);
}
```

### Component Updates

#### Button Component

**Old:**
```tsx
className="bg-[#d4c5b0] text-[#3d2817]"
```

**New:**
```tsx
className="bg-[var(--color-paper-border)] text-[var(--color-text-primary)]"
```

#### RecycledPaperCard

**Old:**
```tsx
style={{ backgroundColor: '#faf0e6' }}
```

**New:**
```tsx
style={{ backgroundColor: 'var(--color-paper-primary)' }}
```

---

## Usage Examples

### Creating a Button

```tsx
import { Button } from './ui/button';

function MyComponent() {
  return (
    <Button 
      variant="emerald" 
      size="lg"
      onClick={handleClick}
      aria-label="Submit form"
    >
      Submit
    </Button>
  );
}
```

### Creating a Card

```tsx
import { RecycledPaperCard } from './ui/RecycledPaperCard';

function MyComponent() {
  return (
    <RecycledPaperCard showLines={true}>
      <h2>Card Title</h2>
      <p>Card content goes here</p>
    </RecycledPaperCard>
  );
}
```

### Custom Styling with Tokens

```css
.my-custom-component {
  background-color: var(--color-paper-primary);
  color: var(--color-text-primary);
  padding: var(--spacing-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-paper-md);
  transition: var(--transition-all);
}

.my-custom-component:hover {
  box-shadow: var(--shadow-hover);
}
```

### Responsive Typography

```css
.responsive-heading {
  font-size: var(--font-size-4xl);
  line-height: var(--line-height-tight);
  letter-spacing: var(--letter-spacing-wide);
}
```

### Glassmorphism Effect

```css
.glass-panel {
  backdrop-filter: blur(var(--blur-md));
  -webkit-backdrop-filter: blur(var(--blur-md));
  background: var(--glass-bg-medium);
  border: 1px solid var(--glass-border-light);
}
```

---

## Accessibility Checklist

### Color & Contrast
- [ ] All text meets 4.5:1 contrast ratio (AA)
- [ ] Large text meets 3:1 contrast ratio
- [ ] UI components meet 3:1 contrast ratio
- [ ] Color is not the only indicator (use icons, text)

### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Tab order is logical
- [ ] Focus indicators are visible
- [ ] Escape key closes modals
- [ ] Skip links are available

### Screen Readers
- [ ] All images have alt text
- [ ] Icon buttons have aria-labels
- [ ] Form fields have associated labels
- [ ] Error messages use role="alert"
- [ ] Live regions for dynamic content

### Touch Targets
- [ ] All interactive elements are at least 44x44px
- [ ] Adequate spacing between touch targets

### Motion
- [ ] Animations respect prefers-reduced-motion
- [ ] No auto-playing animations longer than 5 seconds
- [ ] Pause/stop controls for animations

---

## Resources

### Design Token Files
- `src/styles/design-tokens.css` - Complete token system
- `src/styles/theme.css` - Theme variables (backward compatible)
- `src/styles/accessibility.css` - Accessibility utilities
- `src/styles/breakpoints.css` - Responsive breakpoints

### Component Files
- `src/components/ui/button.tsx` - Button component
- `src/components/ui/RecycledPaperCard.tsx` - Card component

### Tools
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [WAVE Browser Extension](https://wave.webaim.org/extension/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## Support

For questions or issues with the design system:
1. Check this documentation
2. Review component source code
3. Consult accessibility guidelines
4. Contact the design system team

---

**Last Updated:** 2024  
**Maintained By:** Design System Team


