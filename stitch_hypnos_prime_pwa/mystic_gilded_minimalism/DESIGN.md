---
name: Mystic Gilded Minimalism
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
  secondary: '#cec98e'
  on-secondary: '#343206'
  secondary-container: '#4b481a'
  on-secondary-container: '#bcb77e'
  tertiary: '#eec98f'
  on-tertiary: '#422c01'
  tertiary-container: '#d0ae76'
  on-tertiary-container: '#594113'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffe088'
  primary-fixed-dim: '#e9c349'
  on-primary-fixed: '#241a00'
  on-primary-fixed-variant: '#574500'
  secondary-fixed: '#eae5a8'
  secondary-fixed-dim: '#cec98e'
  on-secondary-fixed: '#1e1c00'
  on-secondary-fixed-variant: '#4b481a'
  tertiary-fixed: '#ffdeaa'
  tertiary-fixed-dim: '#e5c187'
  on-tertiary-fixed: '#271900'
  on-tertiary-fixed-variant: '#5b4314'
  background: '#131313'
  on-background: '#e5e2e1'
  surface-variant: '#353534'
typography:
  display-lg:
    fontFamily: Playfair Display
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Playfair Display
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
  headline-md:
    fontFamily: Playfair Display
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
  headline-sm:
    fontFamily: Playfair Display
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
  body-lg:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
  body-md:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.1em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  container-margin: 24px
  gutter: 16px
  unit: 8px
  section-gap: 48px
---

## Brand & Style

The design system is a fusion of high-end editorial elegance and mystical spirituality, engineered for a luxury wellness experience. It targets an exclusive audience seeking mental transformation and deep subconscious exploration.

The visual style is **Mystical Minimalism with Glassmorphic accents**. It relies on the heavy use of negative space provided by a deep matte black canvas, allowing the rich gold accents to appear as "light sources" within the UI. This creates a sense of depth, focus, and quiet authority. The presence of the sacred geometry and chakra icons introduces a spiritual layer that is balanced by a structured, high-tech layout inspired by Material Design 3. 

The emotional goal is to evoke **serenity, prestige, and awakening**. Users should feel they are entering a private, sacred digital sanctuary that is both technologically advanced and ancient in its wisdom.

## Colors

The palette is strictly curated to maintain a premium "Midnight & Gold" aesthetic. 

- **Primary Gold (#D4AF37):** Used for primary actions, key iconography, and branding elements. It represents the "polished" luxury of the system.
- **Highlight Gold (#FBF5B7):** A luminous, pale gold used for gradients, inner glows, and subtle highlights to simulate a metallic shimmer.
- **Muted Gold (#8A6D3B):** A bronze-leaning gold used for secondary information, borders, and inactive states to ensure the UI remains calm and not overly flashy.
- **Deep Matte Black (#121212):** The foundation of the entire system. It provides the "void" necessary for the gold elements to shine.

**Gradients:** Use linear gradients from Primary Gold to Muted Gold at a 45-degree angle to create a "brushed metal" texture for buttons and active chips.

## Typography

This system uses a high-contrast typographic pairing to signal both luxury and modernity.

**Playfair Display** is the editorial voice of the system. It should be used for all large titles, headlines, and numbers. It conveys a sense of history and timelessness. For a truly premium feel, use "italic" variants for emphasis in headlines.

**Manrope** provides the functional clarity required for a high-tech app. Its balanced, clean proportions ensure readability against the dark background. 

**Formatting Note:** Labels and small UI identifiers should always use the `label-md` style with increased letter spacing and uppercase styling to mimic high-end fashion branding.

## Layout & Spacing

The layout philosophy follows a **Fixed Grid** model with generous white space (or "black space") to prevent the UI from feeling cluttered.

- **Mobile:** 4-column grid, 24px side margins, 16px gutters.
- **Desktop:** 12-column centered grid, max-width of 1280px.

Elements are spaced in increments of **8px**. To maintain the "mystical" and "calming" vibe, avoid tight vertical spacing. Use the `section-gap` of 48px between different content modules to give the user's eyes room to breathe. Components should be center-aligned where possible to enhance the sense of balance and meditation.

## Elevation & Depth

In this design system, depth is created through **Glassmorphism** and **Tonal Layering** rather than traditional shadows.

1.  **Base Layer:** The Deep Matte Black (#121212) background.
2.  **Surface Layer:** Semi-transparent containers (Background: #FFFFFF at 5% opacity) with a Backdrop Blur of 20px. 
3.  **Gold Accents:** Surfaces are defined by a thin 1px border. Use a linear gradient for borders (Muted Gold to Primary Gold) to create a "gilded edge" effect.
4.  **Luminescence:** Instead of drop shadows, use "Glows." Apply an outer shadow with 0px offset, 20px blur, and the Primary Gold color at 15% opacity to indicate active or highly elevated elements like the primary "Play" button.

## Shapes

The shape language is **Rounded**, echoing the circular nature of the chakra icons and the concept of "wholeness."

- Standard components (Inputs, Chips) use a **0.5rem (8px)** corner radius.
- Interactive cards use a more pronounced **1rem (16px)** radius to feel softer and more inviting.
- Primary buttons and iconography should lean towards **circular or pill-shaped** forms to emphasize the spiritual and organic nature of the product.

## Components

### Buttons
- **Primary:** Pill-shaped with a Gold gradient background and black text. No border.
- **Secondary:** Pill-shaped with a 1px Gold border and transparent center. Gold text.
- **Tertiary:** Text-only, Playfair Display Italic, Primary Gold color.

### Cards
Cards are the primary container for content. They must feature the Glassmorphism effect: a 20px backdrop blur, a 5% white fill, and a 1px gilded border gradient. Content inside should be center-aligned for "Master" profiles and left-aligned for "Lesson" lists.

### Chips
Small, pill-shaped elements for categories. Inactive chips have a dark grey border; active chips are filled with Muted Gold (#8A6D3B) with Black text.

### Inputs
Fields should be "Underlined" style (Material 3 style) rather than boxed, using Primary Gold for the underline and Manrope for the input text. This mimics high-end stationery.

### Audio Player
The core feature. The "Play" button should be a large gold circle with a subtle outer glow. The progress bar is a thin Primary Gold line with a circular "shimmer" thumb.

### Categories (Chakra Icons)
Use the provided golden icons as the focal point for navigation categories. They should always be presented in a square or circular glassmorphic container to maintain visual consistency.