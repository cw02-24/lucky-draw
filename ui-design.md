# Lucky Draw App - UI Design Document

## Design Concept: "The Golden Ticket"
The app should feel high-stakes, exciting, and celebratory. The aesthetic is "Modern Midnight" with vibrant neon accents and glassmorphism elements to create depth.

---

## Color Palette

| Role | Color | Hex Code | Tailwind Reference |
|------|-------|----------|-------------------|
| Primary Background | Deep Slate (Midnight Sky) | `#0F172A` | `bg-slate-900` |
| Secondary Surface | Slate (Card bg 60% opacity) | `#1E293B` | `bg-slate-800/60` |
| Accent - Action (Golden) | Vibrant Yellow | `#FACC15` | `text-yellow-400`, `bg-yellow-400` |
| Accent - Winner | Mint Green | `#4ADE80` | `text-green-400`, `bg-green-400` |
| Accent - Danger | Coral Red | `#F87171` | `text-red-400`, `bg-red-400` |
| Accent - Purple Glow | Electric Violet | `#A78BFA` | `text-violet-400` |
| Text Primary | Off-white | `#F8FAFC` | `text-slate-50` |
| Text Secondary | Slate Gray | `#94A3B8` | `text-slate-400` |
| Glass Border | White 10% | `rgba(255,255,255,0.1)` | `border-white/10` |

---

## Typography

- **Headlines:** `Inter` or `Montserrat` (Bold, 800 weight) - punchy, modern look
- **Body:** `Inter` (Regular, 400 weight) - clean readability
- **Winner Name:** `Montserrat` (Black, 900 weight) - extra bold for impact

| Element | Font | Size (Desktop) | Size (Mobile) | Weight |
|---------|------|----------------|---------------|--------|
| App Title | Montserrat | 28px | 22px | 800 |
| Section Headers | Inter | 20px | 18px | 700 |
| Winner Name (Modal) | Montserrat | 48px | 32px | 900 |
| Body Text | Inter | 16px | 14px | 400 |
| Button Text | Inter | 18px | 16px | 600 |

---

## Layout Structure (Mobile-First)

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
  - Circular "wheel" or vertical "slot drum"
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

## Mobile-First Considerations

1. **Touch Targets:** Minimum 44x44px for all interactive elements
2. **Spacing:** Use `p-4` (16px) as base unit, scale up to `p-6` on desktop
3. **Font Sizes:** Base 16px on mobile to prevent iOS auto-zoom on inputs
4. **Safe Areas:** Use `env(safe-area-inset-bottom)` for bottom actions on notched devices

---

## Assets Required

1. **Icons:** 
   - Settings gear
   - History/Clock
   - Trophy (for winner)
   - Close/X button
2. **Fonts:** 
   - Inter (Google Fonts)
   - Montserrat (Google Fonts)
3. **Libraries:**
   - `framer-motion` (React animations)
   - `canvas-confetti` (Celebration effect)
   - `lucide-react` or `react-icons` (Icon system)

---

## Design Notes

- **Haptic Feedback:** On mobile, trigger `navigator.vibrate(50)` during spin start, `navigator.vibrate([100, 50, 100])` on win.
- **Sound Effects (Optional):**
  - Spin: Soft "ratchet" click loop
  - Win: Triumphant chime/horn
- **Accessibility:** Ensure 4.5:1 contrast ratio on text; support `prefers-reduced-motion` by disabling spin animation for sensitive users.
