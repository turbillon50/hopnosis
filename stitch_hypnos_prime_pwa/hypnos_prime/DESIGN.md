---
name: Hypnos Prime
colors:
  surface: '#131313'
  surface-dim: '#131313'
  surface-bright: '#393939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353534'
  on-surface: '#e5e2e1'
  on-surface-variant: '#d0c5af'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#99907c'
  outline-variant: '#4d4635'
  surface-tint: '#e9c349'
  primary: '#f2ca50'
  on-primary: '#3c2f00'
  primary-container: '#d4af37'
  on-primary-container: '#554300'
  inverse-primary: '#735c00'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#474746'
  on-secondary-container: '#b7b5b4'
  tertiary: '#e9cb85'
  on-tertiary: '#3e2e00'
  tertiary-container: '#ccb06c'
  on-tertiary-container: '#564207'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1b1b1b'
  on-secondary-fixed-variant: '#474746'
  tertiary-fixed: '#fedf97'
  tertiary-fixed-dim: '#e1c37d'
  on-tertiary-fixed: '#251a00'
  on-tertiary-fixed-variant: '#584409'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 57px
    fontWeight: '400'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '500'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '400'
    lineHeight: 36px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '400'
    lineHeight: 32px
  title-lg:
    fontFamily: Hanken Grotesk
    fontSize: 22px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Hanken Grotesk
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0.5px
  body-md:
    fontFamily: Hanken Grotesk
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.25px
  label-lg:
    fontFamily: Hanken Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
  headline-lg-mobile:
    fontFamily: Playfair Display
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  baseline: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 64px
  gutter: 16px
  section-gap: 48px
---

## Brand & Style
The design system embodies a "Celestial Luxury" aesthetic, specifically tailored for a premium hypnosis experience. It merges the structured reliability of Material Design 3 with a mystical, high-end finish. The interface should feel like an entry into a sacred, quiet space—transcending traditional app design to evoke a sense of cosmic tranquility.

The style is **Minimalist-Luxury**. It prioritizes extreme focus, utilizing heavy negative space to reduce cognitive load, allowing the user to transition into a state of mindfulness. Visual elements are sparse but meticulously crafted, featuring thin lines, gold accents, and a deep, matte environment that feels both vast and intimate.

## Colors
The palette is rooted in a "Void and Radiance" concept. The background is a strictly enforced **Deep Matte Black (#121212)**, chosen to minimize light emission and support eye comfort during night-time or low-light sessions.

**Rich Polished Gold (#D4AF37)** serves as the primary vessel for information and interaction. It is used for all high-emphasis text, primary icons, and active states. To provide depth without breaking the dark aesthetic, **Secondary Black (#1C1C1C)** is used for surface containers, creating a subtle tiered hierarchy. A **Muted Bronze (#705A1F)** is reserved for disabled states and secondary information to maintain the monochromatic-metallic harmony.

## Typography
Typography creates a dialogue between the traditional and the modern. 

**Playfair Display** provides an authoritative, literary feel for session titles and major headings, echoing the prestige of Maestro Honorio Castillo's teachings. Its high contrast strokes feel elegant and premium.

**Hanken Grotesk** is used for all functional and body text. Its sharp, contemporary geometry ensures legibility at small sizes and provides a technical, precise counter-balance to the expressive serif headings. 

For labels and navigation items, use `label-lg` with 10% letter spacing and uppercase styling to evoke a "gallery-style" editorial feel.

## Layout & Spacing
The layout follows a **Fixed Center** philosophy for desktop to maintain intimacy, while utilizing a **Fluid Grid** for mobile devices. 

Content should be airy. We use an 8px baseline grid, but vertical rhythm is driven by "breathing room"—sections are separated by a minimum of 48px to prevent the UI from feeling cluttered. 

On desktop, the main content container is capped at 1024px, centered, to ensure the user's eye remains focused on the session controls and mystical imagery. On mobile, margins are increased to 20px to prevent elements from touching the screen edges, maintaining the "floating" feeling of the components.

## Elevation & Depth
Elevation is conveyed through **Aura and Tonal Layering** rather than traditional drop shadows.

1.  **Surfaces:** Instead of shadows, higher elevation levels are indicated by shifting the background color from #121212 to #1C1C1C. 
2.  **The Gold Glow:** For primary interactive elements (like the "Start Session" button) or active states, a subtle, diffused outer glow using the primary gold color (#D4AF37 at 15-20% opacity) is used. This creates a "luminescent" effect as if the UI element is a source of light in a dark room.
3.  **Outlines:** Low-emphasis containers use a 1px solid border in #705A1F (Muted Bronze) to define boundaries without adding visual weight.

## Shapes
This design system utilizes a **Rounded (0.5rem)** shape language. This specific radius strikes a balance between the precision of luxury tech and the organic softness required for a wellness app.

- **Standard Elements:** 8px (0.5rem) corner radius.
- **Large Containers/Cards:** 16px (1rem) corner radius.
- **Specialty Elements:** Audio playhead thumbs and progress bar ends are completely circular (Pill) to feel tactile and smooth under the thumb.

## Components
Consistent with Material Design 3 patterns but visually re-skinned for the gold/black theme:

- **Primary Buttons:** High-contrast Gold (#D4AF37) fill with Black (#121212) text. No shadow, but a 4px "Aura" glow on hover.
- **Cards:** Surface color #1C1C1C with a 1px border of #705A1F. Headings inside cards must be Playfair Display.
- **Audio Player:** A custom "Cosmic Slider." The track is a thin 2px line in #1C1C1C, with the progress filled in Gold. The thumb is a small gold circle with a subtle glow.
- **Input Fields:** Bottom-line only (M3 style) in #705A1F, turning to a 2px Gold line on focus. Labels float above the line in Gold.
- **Chips:** Outlined only. Gold text and Gold border (1px). When selected, they take a Gold fill with Black text.
- **Navigation:** A bottom bar for mobile using the #1C1C1C surface. Active icons are Gold with a small glowing dot beneath them; inactive icons are Muted Bronze.
- **Bottom Sheets:** For session details, use a "Frosted Black" backdrop blur (glassmorphism) behind the sheet to maintain the sense of depth.