# Lucky Draw Application - Technical Specification

## Project Overview
A web-based lucky draw application featuring a spin-the-wheel interface with weighted random selection. The app should feel high-stakes, exciting, and celebratory with a "Modern Midnight" aesthetic featuring neon accents and glassmorphism elements.

---

## Tech Stack

### Core Framework
- **Build Tool:** Vite
- **UI Framework:** React (TypeScript)
- **Styling:** Tailwind CSS

### Animation & Effects
- ** Animation:** FrPrimaryamer Motion (for spring physics and complex transitions)
- **Confetti:** `canvas-confetti` npm package
- **Icons:** `lucide-react` or `react-icons`

### Lucky Draw Component
- **Library:** `ts-spin-wheel` (GitHub: Sivamani-18/SpinWheel)
- **Features:** Customizable sectors, smooth easing animations, audio feedback support, modal pop-up for results
- **TypeScript:** Full support

### Fonts
- **Headlines:** Montserrat (Bold, 800 weight)
- **Body:** Inter (Regular, 400 weight)
- **Winner Name:** Montserrat (Black, 900 weight)

---

## Core Logic: Weighted Random Selection Algorithm

### Concept
Each prize is assigned a "weight" representing its relative probability of being selected. Higher weight = greater chance.

### Implementation Steps

1. **Calculate Total Weight:** Sum all individual weights assigned to each item in the draw pool.
2. **Generate Random Number:** Generate a random floating-point number within range `[0, totalWeight)` using `Math.random() * totalWeight`.
3. **Determine Winner:** Iterate through items, maintaining a `cumulativeWeight` counter. The first item where `cumulativeWeight >= randomNumber` is selected.

### TypeScript Implementation

```typescript
interface Prize {
  id: string;
  label: string;
  weight: number;
  color: string;
}

function selectWeightedRandom<T>(items: T[], weights: number[]): T {
  if (items.length !== weights.length || items.length === 0) {
    throw new Error("Items and weights arrays must have the same non-zero length.");
  }

  let totalWeight = 0;
  weights.forEach(weight => {
    if (weight < 0) {
      throw new Error("Weights cannot be negative.");
    }
    totalWeight += weight;
  });

  if (totalWeight === 0) {
    throw new Error("Total weight cannot be zero. Ensure at least one item has a positive weight.");
  }

  // Generate a random number between 0 (inclusive) and totalWeight (exclusive)
  const randomNumber = Math.random() * totalWeight;

  let cumulativeWeight = 0;
  for (let i = 0; i < items.length; i++) {
    cumulativeWeight += weights[i];
    if (cumulativeWeight >= randomNumber) {
      return items[i];
    }
  }

  return items[items.length - 1];
}

// Example Usage:
// const prizes = ["10% Off", "Free Shipping", "Try Again", "20% Off"];
// const probabilities = [30, 20, 40, 10]; // Sum is 100
// const winner = selectWeightedRandom(prizes, probabilities);
```

### Algorithm Variations

- **Dynamic Weighting:** Adjust probabilities in real-time based on remaining prizes, time limits, or to enforce distribution (e.g., ensuring rare prizes don't appear too frequently).
- **Pity Timers:** Guarantee a rare win after X attempts.
- **Advanced (Alias Method):** For O(1) selection with large item sets (overkill for typical use cases).

### Integration with Spin Wheel

1. Calculate winning prize using weighted random algorithm **before** spin starts.
2. Use `useRef` to reference the `SpinWheel` component.
3. Call `wheelRef.current.spin()` with the pre-determined winning sector index.
4. Use `onSpinEnd` callback to trigger result modal display.

### Security Note
- `Math.random()` is pseudo-random. For high-stakes applications, use server-side cryptographically secure RNG.

---

## UI/UX Design System

### Color Palette

| Role | Color Name | Hex Code | Tailwind Reference |
|------|------------|----------|-------------------|
| Primary Background | Deep Slate (Midnight Sky) | `#0F172A` | `bg-slate-900` |
| Secondary Surface | Slate (Card bg 60% opacity) | `#1E293B` | `bg-slate-800/60` |
| Accent - Action (Golden) | Vibrant Yellow | `#FACC15` | `text-yellow-400`, `bg-yellow-400` |
| Accent - Winner | Mint Green | `#4ADE80` | `text-green-400`, `bg-green-400` |
| Accent - Danger | Coral Red | `#F87171` | `text-red-400`, `bg-red-400` |
| Accent - Purple Glow | Electric Violet | `#A78BFA` | `text-violet-400` |
| Text Primary | Off-white | `#F8FAFC` | `text-slate-50` |
| Text Secondary | Slate Gray | `#94A3B8` | `text-slate-400` |
| Glass Border | White 10% | `rgba(255,255,255,0.1)` | `border-white/10` |

### Typography

| Element | Font | Size (Desktop) | Size (Mobile) | Weight |
|---------|------|----------------|---------------|--------|
| App Title | Montserrat | 28px | 22px | 800 |
| Section Headers | Inter | 20px | 18px | 700 |
| Winner Name (Modal) | Montserrat | 48px | 32px | 900 |
| Body Text | Inter | 16px | 14px | 400 |
| Button Text | Inter | 18px | 16px | 600 |

---

## Layout Structure

### Mobile Layout (< 640px)

```
┌─────────────────────────┐
│  [Logo]        [⚙️]     │  ← Header (h-16)
├─────────────────────────┤
│                         │
│   ┌─────────────────┐   │
│   │                 │   │
│   │   WHEEL/SPINNER │   │  ← Main Stage (flex-1)
│   │   (min-h-64)    │   │
│   │                 │   │
│   └─────────────────┘   │
│                         │
│   ┌─────────────────┐   │
│   │   [ DRAW! ]    │   │  ← Action Button
│   └─────────────────┘   │
│                         │
├─────────────────────────┤
│  Recent Winners ▸       │  ← Collapsible Section
│  ┌─────┐ ┌─────┐ ┌────┐ │
│  │ 👤 │ │ 👤 │ │👤  │ │  ← Winner Cards
│  └─────┘ └─────┘ └────┘ │
└─────────────────────────┘
```

### Desktop Layout (≥ 1024px)

```
┌──────────────────────────────────────────────────┐
│  [Logo]                    [Settings] [History]  │  ← Header
├────────────────────────────────┬─────────────────┤
│                                │                 │
│        ┌─────────────────┐     │  Winner Wall   │
│        │                 │     │  ┌───────────┐ │
│        │   WHEEL/STAGE   │     │  │ 👤 Name   │ │
│        │   (centered)    │     │  │ 👤 Name   │ │
│        │                 │     │  │ 👤 Name   │ │
│        └─────────────────┘     │  │ ...       │ │
│                                │  └───────────┘ │
│        [  DRAW BUTTON  ]       │                 │
│                                │  Settings Panel │
└────────────────────────────────┴─────────────────┘
```

---

## Component Specifications

### 1. Header
- **Height:** `h-16` (64px)
- **Background:** `bg-slate-900/80` with `backdrop-blur-md`
- **Border:** `border-b border-white/5`
- **Logo:** Left-aligned, text "Lucky Draw" in Montserrat Bold
- **Actions:** Right-aligned icons (Settings, History toggle)

### 2. Main Stage (Spin Area)
- **Container:** `min-h-[300px] md:min-h-[400px]`
- **Background:** Radial gradient `bg-gradient-to-b from-slate-800/50 to-slate-900`
- **Center Element:** 
  - Circular wheel
  - Size: `w-64 h-64 md:w-80 md:h-80`
  - Glass effect: `bg-white/5 backdrop-blur-sm border border-white/10`
  - Glow: `shadow-[0_0_60px_-15px_rgba(250,204,21,0.3)]`

### 3. Draw Button
- **Size:** `w-48 h-48` (mobile), `w-56 h-56` (desktop) - circular
- **Background:** `bg-gradient-to-br from-yellow-400 to-yellow-500`
- **Shadow:** `shadow-[0_10px_25px_-5px_rgba(250,204,21,0.5)]`
- **Icon:** Large "🎲" or "⚡" emoji, or custom SVG
- **Text:** "DRAW" in Montserrat Bold, `text-slate-900`
- **Hover State:** Scale `scale-105`, shadow intensifies
- **Active State:** Scale `scale-95`
- **Micro-interaction:** Pulse ring effect (`ring-4 ring-yellow-400/30`) on click

### 4. Winner Modal (Overlay)
- **Backdrop:** `bg-slate-900/80 backdrop-blur-lg`
- **Modal Card:**
  - `bg-slate-800/90 border border-yellow-400/30`
  - `rounded-3xl`
  - `p-8 md:p-12`
  - `max-w-sm md:max-w-md`
  - `shadow-[0_0_100px_-20px_rgba(250,204,21,0.4)]`
- **Animation:** Scale from 0.8 → 1.0 with spring bounce

### 5. Winner Card (History List)
- **Size:** `w-20 h-24` (small cards in grid)
- **Background:** `bg-slate-800/60`
- **Border:** `border border-white/5`, `hover:border-green-400/50`
- **Avatar:** `w-12 h-12 rounded-full bg-slate-700`
- **Name:** Truncated, `text-xs`, `text-slate-300`
- **Hover Interaction:** `translate-y-[-4px] shadow-lg`

---

## Animation Specifications

### A. Draw Button Hover
```css
/* Tailwind: hover:scale-105 transition-transform duration-200 */
transform: scale(1.05);
transition: transform 200ms cubic-bezier(0.4, 0, 0.2, 1);
```

### B. The Spin Animation (Key Effect)
**Duration:** 3000ms - 5000ms (configurable)

**Timing Function:**
```css
/* Cubic bezier for "wind-up and slow-down" */
transition: transform 4000ms cubic-bezier(0.45, 0.05, 0.55, 0.95);
```

**Phases:**
1. **Rapid Start (0-500ms):** Ease-in, velocity builds
2. **Full Speed (500-2500ms):** Linear or slight ease
3. **Deceleration (2500-4000ms):** Ease-out cubic, gradual stop

**Rotation Values (Wheel):**
- Minimum spins: 5 full rotations = `1800deg`
- Final position: `1800deg + random(0, 360deg)`

### C. Winner Reveal (Modal Pop)
**Animation Type:** Spring physics (Framer Motion)

```javascript
// Framer Motion values
{
  scale: [0.5, 1.1, 1],  // Overshoot then settle
  opacity: [0, 1],
  y: [20, 0],
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20
  }
}
```

**Tailwind Alternative:**
```css
/* Manual keyframes for pure CSS */
@keyframes winner-pop {
  0% { transform: scale(0.5); opacity: 0; }
  70% { transform: scale(1.1); }
  100% { transform: scale(1); opacity: 1; }
}
animation: winner-pop 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
```

### D. Confetti Burst
- **Trigger:** On winner modal appear
- **Library:** `canvas-confetti` (npm package)
- **Colors:** Yellow `#FACC15`, Green `#4ADE80`, Purple `#A78BFA`
- **Particle Count:** 100-150
- **Spread:** 70 degrees
- **Origin:** Top center (`{ x: 0.5, y: 0 }`)

### E. Micro-Interactions
| Element | Interaction | Animation |
|---------|-------------|-----------|
| Winner Card in list | Hover | `translate-y-[-4px] shadow-lg` |
| Settings Toggle | Click | `rotate-90` or slide panel |
| Spin Button | Click | Pulse ring effect (`ring-4 ring-yellow-400/30`) |
| List Items | Enter | Staggered fade-in (`delay-100`, `delay-200`, etc.) |

---

## Mobile-First Considerations

1. **Touch Targets:** Minimum 44x44px for all interactive elements
2. **Spacing:** Use `p-4` (16px) as base unit, scale up to `p-6` on desktop
3. **Font Sizes:** Base 16px on mobile to prevent iOS auto-zoom on inputs
4. **Safe Areas:** Use `env(safe-area-inset-bottom)` for bottom actions on notched devices

---

## Accessibility

- **Contrast Ratio:** Maintain 4.5:1 minimum on text
- **Reduced Motion:** Support `prefers-reduced-motion` by disabling spin animation
- **Keyboard Navigation:** Ensure all interactive elements are focusable
- **Screen Readers:** Proper semantic HTML and ARIA labels

---

## Haptic & Audio Feedback

### Haptic Feedback (Mobile)
- **Spin Start:** `navigator.vibrate(50)`
- **Win:** `navigator.vibrate([100, 50, 100])`

### Sound Effects (Optional)
- **Spin:** Soft "ratchet" click loop
- **Win:** Triumphant chime/horn

---

## Assets Required

### Icons (Lucide React)
- Settings gear (SettingsIcon)
- History/Clock (HistoryIcon)
- Trophy (TrophyIcon)
- Close/X button (XIcon)

### Fonts (Google Fonts)
- Inter: `https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap`
- Montserrat: `https://fonts.googleapis.com/css2?family=Montserrat:wght@800;900&display=swap`

---

## Tailwind CSS Quick Reference

```html
<!-- Main Container -->
<div class="min-h-screen bg-slate-900 text-slate-50 font-sans">

  <!-- Glass Card -->
  <div class="bg-slate-800/60 backdrop-blur-md border border-white/10 rounded-2xl">
    
    <!-- Draw Button -->
    <button class="
      w-48 h-48 rounded-full
      bg-gradient-to-br from-yellow-400 to-yellow-500
      shadow-[0_10px_25px_-5px_rgba(250,204,21,0.5)]
      hover:scale-105 active:scale-95
      transition-all duration-200
      text-slate-900 font-bold text-xl
    ">
      DRAW
    </button>

    <!-- Winner Text -->
    <h2 class="text-5xl font-black text-yellow-400 drop-shadow-lg">
      WINNER!
    </h2>
    
  </div>
</div>
```

---

## Implementation Checklist

### Phase 1: Core Setup
- [ ] Initialize Vite + React + TypeScript project
- [ ] Install Tailwind CSS and configure colors/fonts
- [ ] Install `ts-spin-wheel`, `framer-motion`, `canvas-confetti`, `lucide-react`

### Phase 2: Wheel Component
- [ ] Create spin wheel with `ts-spin-wheel`
- [ ] Implement weighted random selection algorithm
- [ ] Connect algorithm output to wheel spin target

### Phase 3: UI Components
- [ ] Build Header with navigation icons
- [ ] Build Main Stage container with glass effects
- [ ] Build Draw Button with hover/active states
- [ ] Build Winner Modal with spring animation
- [ ] Build Winner Cards for history list

### Phase 4: Polish
- [ ] Add confetti burst on win
- [ ] Implement haptic feedback (mobile)
- [ ] Add staggered animations for list items
- [ ] Configure responsive breakpoints
- [ ] Test accessibility (contrast, keyboard nav, reduced motion)

---

## File Structure

```
lucky-draw/
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── MainStage.tsx
│   │   ├── SpinWheel.tsx
│   │   ├── DrawButton.tsx
│   │   ├── WinnerModal.tsx
│   │   └── WinnerCard.tsx
│   ├── hooks/
│   │   ├── useWeightedRandom.ts
│   │   └── useHaptics.ts
│   ├── utils/
│   │   └── weightedRandom.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── public/
├── index.html
├── package.json
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
└── vite.config.ts
```

---

## Notes for Coder

1. **Algorithm First:** Implement the weighted random selection in `src/utils/weightedRandom.ts` before building the UI. Test with various weight distributions.

2. **Wheel Integration:** The `ts-spin-wheel` component requires pre-calculating the winner index. The spin animation should be told which sector to land on, not randomly determined during animation.

3. **Color Consistency:** Use the exact hex codes from the color palette. The yellow accent (`#FACC15`) is critical for the celebratory feel.

4. **Animation Timing:** The spin should last 3-5 seconds with the specific cubic-bezier curve for that "wind-up and slow-down" feel. Don't use linear timing.

5. **Mobile Priority:** Ensure all touch targets are at least 44x44px and test on actual mobile devices for haptic feedback.
