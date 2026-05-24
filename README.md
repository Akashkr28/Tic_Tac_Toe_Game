# Tic Tac Toe — A Classic Reimagined

A premium, cinematic Tic Tac Toe web application built with React 19 and Vite. Features a hand-drawn SVG aesthetic, smooth Framer Motion animations, Web Audio API sound design, an unbeatable AI opponent, full match history, and a polished dark / light theme — all fully responsive across every screen size.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Game Modes](#game-modes)
- [AI Engine](#ai-engine)
- [Sound System](#sound-system)
- [Theme System](#theme-system)
- [Responsive Design](#responsive-design)
- [Match History](#match-history)
- [Component Reference](#component-reference)
- [Utility Reference](#utility-reference)
- [How the Animations Work](#how-the-animations-work)
- [Scripts](#scripts)

---

## Features

### Gameplay
- **Player vs Player** — two humans on the same device
- **Player vs AI** — three difficulty levels (Easy / Medium / Hard)
- **Custom player names** — replace the default "X" and "O" labels before every session
- **Unbeatable AI** — perfect Minimax algorithm on Hard difficulty
- **Win detection** — highlights all three winning cells and draws an animated strike-through line
- **Draw detection** — triggers a unique sound and status message
- **Camera shake** — the board shakes on every win via Framer Motion animation controls

### UI / UX
- **Loading screen** — animated X and O draw themselves with SVG `pathLength` before the game begins
- **Setup screen** — mode selector, difficulty picker (PvAI), and name inputs before each session
- **Live clock** — real-time HH:MM:SS display with date in the sidebar
- **Scoreboard** — live X / Draws / O tally with score flip animations
- **Match history dashboard** — full slide-in panel listing every finished game, persisted in `localStorage`
- **Confetti** — warm-palette canvas-confetti burst on every win
- **"← Change Players" link** — jump back to setup at any time without losing scores

### Theme & Responsiveness
- **Dark / Light theme toggle** — moon/sun icon in the toolbar; preference saved to `localStorage`; respects OS `prefers-color-scheme` on first visit
- **Fully responsive** — single-column on mobile, side-by-side clock/scoreboard on tablet, three-column on desktop
- **Responsive board** — CSS custom properties (`--board`, `--cell`) resize the board and all SVG symbols proportionally across breakpoints

### Sound Design
- **Pencil scratch** — white-noise bandpass filter for cell clicks and board line drawing
- **Button click** — short 720 Hz sine tone
- **Win fanfare** — ascending C5 → E5 → G5 → C6 arpeggio
- **Draw thud** — falling triangle-wave tone (260 Hz → 180 Hz)
- **Mute toggle** — one click silences everything without recreating the `AudioContext`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 |
| Build tool | Vite 8 |
| Styling | Tailwind CSS v4 |
| Animation | Framer Motion v12 |
| Sound | Web Audio API (zero dependencies) |
| Confetti | canvas-confetti |
| Persistence | `localStorage` |
| Language | JavaScript (ESM) |

---

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm 9 or higher

### Installation

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd "Tic Tac Toe Game"

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build       # outputs to /dist
npm run preview     # serves the /dist build locally
```

---

## Project Structure

```
Tic Tac Toe Game/
├── public/
├── src/
│   ├── components/
│   │   ├── Board.jsx           # 3x3 grid with animated SVG lines
│   │   ├── Square.jsx          # Individual cell with X / O SVG path animations
│   │   ├── WinLine.jsx         # Animated strike-through on win
│   │   ├── GameStatus.jsx      # Current turn / winner / draw / AI thinking banner
│   │   ├── Scoreboard.jsx      # Live X / Draws / O score panel
│   │   ├── DateTimeClock.jsx   # Live clock + last game summary
│   │   ├── LoadingScreen.jsx   # Intro animation (auto-dismisses after 2.8 s)
│   │   ├── SetupScreen.jsx     # Mode, difficulty, name setup before each session
│   │   └── Dashboard.jsx       # Slide-in match history panel
│   ├── hooks/
│   │   └── useSound.js         # Web Audio API sound engine
│   ├── utils/
│   │   ├── gameLogic.js        # Win/draw detection, winning square lookup
│   │   ├── aiLogic.js          # Minimax algorithm with difficulty levels
│   │   └── storage.js          # localStorage read/write for match history
│   ├── App.jsx                 # Root component — state, layout, phase management
│   └── index.css               # CSS custom properties (light + dark themes), board sizing vars
├── index.html
├── package.json
└── vite.config.js
```

---

## Game Modes

### Player vs Player (PvP)
Both players share the same device and take turns clicking cells. Custom names can be set for each player before the game starts. The scoreboard tracks wins and draws across multiple rounds until one player clicks **Reset Score**.

### Player vs AI (PvAI)
The human always plays as **X** and moves first. The AI plays as **O**. After the human makes a move, a 680 ms "thinking" delay runs while a bouncing-dots animation is displayed, then the AI places its piece. The human cannot click during this window.

---

## AI Engine

**File:** `src/utils/aiLogic.js`

The AI uses the **Minimax algorithm** — a classic adversarial search that explores every possible future board state to find the theoretically optimal move.

### Difficulty Levels

| Level | Behaviour |
|---|---|
| **Easy** | Picks a random available cell every turn |
| **Medium** | 50% random move, 50% optimal Minimax move |
| **Hard** | Pure Minimax — mathematically unbeatable |

### Scoring

Terminal states are scored with a depth adjustment so the AI prefers faster wins and longer losses:

```
AI wins  →  +10 - depth   (prefer winning sooner)
AI loses →  depth - 10    (prefer losing later)
Draw     →   0
```

This means a player on Hard **cannot win** against the AI — the best achievable result with perfect play is a draw.

---

## Sound System

**File:** `src/hooks/useSound.js`

All audio is generated programmatically using the **Web Audio API** — no audio files are shipped with the project. The `AudioContext` is created lazily on the first user gesture to comply with browser autoplay policies.

| Function | Trigger | Technique |
|---|---|---|
| `playDraw()` | Cell clicked | 0.22 s white noise through a 4400 Hz bandpass filter |
| `playLine()` | Board grid line draws in | 0.38 s white noise through a 3200 Hz bandpass filter |
| `playClick()` | Button pressed | 0.09 s sine wave at 720 Hz |
| `playWin()` | Win detected (260 ms after move) | C5 → E5 → G5 → C6 arpeggio, notes staggered 130 ms |
| `playDrawMatch()` | Draw detected | Triangle wave falling 260 Hz → 180 Hz over 0.55 s |

The `toggle()` function flips a `useRef` flag and returns the new state. No reconnection or re-creation of the `AudioContext` is needed — every sound function simply returns early when disabled.

---

## Theme System

**File:** `src/index.css`

All visual tokens are defined as **CSS custom properties** on `:root` (light theme) and overridden inside `.dark` (dark theme). Toggling the `dark` class on `<html>` instantly repaints every component with no prop drilling or context required.

```css
:root {
  --text-primary:  #1c1917;
  --card-bg:       rgba(255,255,255,0.55);
  --color-x:       #1c1917;
  --color-o:       #b97a1a;
  /* ... 40+ tokens */
}

.dark {
  --text-primary:  #f0ebe3;
  --card-bg:       rgba(36,30,24,0.80);
  --color-x:       #f0ebe3;    /* cream so X is visible on dark background */
  --color-o:       #e8b840;    /* brighter amber */
  /* ... */
}
```

The toggle button (moon → switch to dark, sun → switch to light) lives in the game toolbar. The preference is written to `localStorage` under the key `ttt_theme` and read back on every page load. If no preference is stored, the OS `prefers-color-scheme` media query is used as the initial value.

### Token Reference

| Variable | Purpose |
|---|---|
| `--bg-page` | Full-page gradient background |
| `--card-bg` | Frosted-glass card background (semi-transparent) |
| `--card-bg-board` | Board card (slightly more opaque than standard cards) |
| `--text-primary` | Headlines and X symbol colour |
| `--text-soft` / `--text-faint` | Secondary and label text |
| `--color-x` | X symbol SVG stroke colour |
| `--color-o` | O symbol SVG stroke colour |
| `--grid-line` | Board grid line stroke colour |
| `--accent` / `--accent-bright` | Warm amber accent tones |
| `--sep` | Card dividers and borders |
| `--win-x-bg` / `--win-o-bg` | Winning cell background highlights |
| `--dash-bg` | Dashboard slide-in panel background |
| `--green` / `--red` | Result text and difficulty indicator colours |

---

## Responsive Design

### Breakpoints

| Viewport | Layout |
|---|---|
| `< 768px` — Mobile | Single column: Title → Status → Board → Buttons → Clock + Scoreboard row |
| `768px – 1023px` — Tablet | Same column; Clock and Scoreboard appear side-by-side in a row below the buttons |
| `>= 1024px` — Desktop | Three columns: Clock sidebar ← Game center → Scoreboard sidebar |

### Responsive Board Sizing

The board uses CSS custom properties so all coordinates and symbols scale together. The SVG grid and win-line overlays use `viewBox="0 0 360 360"` with `width/height: 100%`, so they scale automatically without any coordinate changes:

```css
:root          { --board: 360px;  --cell: 120px; }   /* desktop  */
@media <=500px { --board: 288px;  --cell:  96px; }   /* mobile   */
@media <=380px { --board: 255px;  --cell:  85px; }   /* small phone */
```

X and O symbols inside each cell are sized as `calc(var(--cell) * 0.567)` — maintaining the same visual ratio at every breakpoint. The Dashboard panel is full-width on mobile and fixed at 370 px on `sm+`.

---

## Match History

**File:** `src/utils/storage.js`

Every completed game (win or draw) is saved to `localStorage` under the key `ttt_history`. Up to **30 entries** are kept; older entries are trimmed automatically when a new game is saved.

### Entry Shape

```js
{
  id:        "1716556800000-abc",   // timestamp + random suffix (unique key)
  date:      "5/24/2026",           // locale-formatted date string
  time:      "3:45 PM",             // locale-formatted time string
  timestamp: 1716556800000,         // raw Unix ms (used for sorting)
  mode:      "pvp" | "pvai",
  player1:   "Akash",               // Player X display name
  player2:   "Computer",            // Player O display name
  winner:    "Akash" | null,        // null on draw
  isDraw:    false | true,
}
```

### Dashboard Panel

Opened via the clock/history icon in the toolbar. Entries are displayed newest-first. Each card shows:

- Date and a **PvP** / **vs AI** mode badge
- `Player X  vs  Player O` names
- Time and colour-coded result (green for win, muted for draw)

The **Clear All History** button wipes `localStorage` and empties the list with no confirmation prompt.

The `DateTimeClock` sidebar also shows a compact "Last Game" section that animates in (height + opacity transition) as soon as a game finishes. It is initialised from `localStorage` via `useState(() => getLastGame())` so it is available immediately on page load.

---

## Component Reference

### `<Board />`

Renders the 3×3 game grid inside a frosted-glass card. On every mount, four `motion.line` SVG elements draw themselves with staggered delays (0.10 s, 0.28 s, 0.46 s, 0.64 s) via `pathLength: 0 → 1`. The `key={gameKey}` prop in App.jsx forces a full remount on new game, re-triggering the draw-in animation.

**Props:** `squares`, `onSquareClick`, `winner`, `playLine`

---

### `<Square />`

A single clickable cell. Empty cells show a dashed amber shimmer on hover. When a value is placed:

- **X** — two `motion.line` strokes animate sequentially (`pathLength: 0 → 1`; second stroke delayed 0.18 s)
- **O** — one `motion.circle` with `pathLength: 0 → 1`; the SVG container is rotated −90° so the circle draws from the top rather than the right

Winning cells receive a tinted background and border driven by CSS variables (`--win-x-bg`, `--win-o-bg`, etc.) via the `isWinning` prop.

**Props:** `value`, `onClick`, `isWinning`

---

### `<WinLine />`

Overlays an animated strike-through on the board when a winner is found. Cell centres are calculated in the 360×360 viewBox space and extended 52 px beyond the outer cells. Two layers render simultaneously: a thick glow line (opacity 0.18) and a crisp main line, both using `pathLength: 0 → 1`.

**Props:** `winningSquares`, `winner`

---

### `<GameStatus />`

Displays one of four states, animated in and out with `AnimatePresence mode="wait"`:

1. **AI Thinking** — three bouncing amber dots with staggered pulse animations
2. **Winner** — player name in their symbol colour (X = `--color-x`, O = `--color-o`)
3. **Draw** — "Draw!" in muted warm tone
4. **Current Turn** — active player name with their colour

**Props:** `winner`, `isDraw`, `currentPlayer`, `players`, `aiThinking`

---

### `<Scoreboard />`

Three rows — Player X, Draws, Player O — each with an `AnimatePresence popLayout` score number that slides vertically when the value changes (new number enters from above, old exits downward). The active player's row scales to 1.02× with a coloured glow box-shadow. A "vs AI" badge appears in the header during PvAI mode.

**Props:** `scores`, `currentPlayer`, `winner`, `players`, `gameMode`

---

### `<DateTimeClock />`

Updates every second via `setInterval`. Displays HH:MM:SS (seconds rendered in amber accent colour), AM/PM, day of week, day/month, and year. An animated "Last Game" section slides in using `AnimatePresence` (height + opacity) whenever the `lastGame` prop is set.

**Props:** `lastGame`

---

### `<LoadingScreen />`

Fullscreen intro screen that auto-dismisses after **2.8 seconds** via `setTimeout`. Animation sequence:

| Time | Event |
|---|---|
| 0.50 s | X first stroke begins drawing |
| 0.88 s | X second stroke begins drawing |
| 1.10 s | O circle begins drawing |
| 1.75 s | Title and subtitle fade in |
| 2.10 s | Pulsing loading dots appear |
| 2.80 s | `onComplete()` fires, loading screen exits |

Exits via `AnimatePresence` with a cinematic `opacity: 0, scale: 1.04` transition.

**Props:** `onComplete`

---

### `<SetupScreen />`

Fullscreen overlay collecting game configuration before each session:

- Mode selector: **vs Player** / **vs Computer** (two `ModeCard` buttons)
- AI Difficulty: **Easy** / **Medium** / **Hard** — section animates in/out with `AnimatePresence` when PvAI is selected
- Name inputs with focus-ring accent colours (charcoal for X, amber for O)
- A locked "Computer 🤖" display in place of the Player O input in PvAI mode
- **Start Game →** calls `onStart({ mode, player1, player2, difficulty })`

**Props:** `onStart`

---

### `<Dashboard />`

Slide-in panel from the right edge (`x: 100% → 0`, spring physics). A blurred backdrop overlay sits behind it and closes the panel on click. On every open it re-reads history from `localStorage` via a `useEffect` dependency on `isOpen`. History cards animate in sequentially with staggered `x: 20 → 0` transitions.

**Props:** `isOpen`, `onClose`

---

## Utility Reference

### `src/utils/gameLogic.js`

| Export | Signature | Description |
|---|---|---|
| `calculateWinner` | `(squares: string[]) => string \| null` | Returns `'X'`, `'O'`, or `null` |
| `getWinningSquares` | `(squares: string[]) => number[]` | Returns `[a, b, c]` indices or `[]` |
| `isDraw` | `(squares: string[]) => boolean` | `true` if all cells filled and no winner |

Eight winning combinations are defined in a `WINNING_LINES` constant (3 rows + 3 columns + 2 diagonals).

---

### `src/utils/aiLogic.js`

| Export | Signature | Description |
|---|---|---|
| `getBestMove` | `(squares, aiSymbol, difficulty) => number` | Returns the best cell index (0–8) for the AI, or `-1` if the board is full |

The internal `minimax` function is not exported. It is called recursively by `getBestMove` with a depth counter used to score terminal states.

---

### `src/utils/storage.js`

| Export | Signature | Description |
|---|---|---|
| `saveGame` | `({ mode, player1, player2, winner, isDraw }) => entry` | Appends entry, trims to 30, returns the saved entry object |
| `getHistory` | `() => entry[]` | Returns all entries sorted newest-first |
| `getLastGame` | `() => entry \| null` | Returns the most recent entry or `null` |
| `clearHistory` | `() => void` | Removes the `ttt_history` key from `localStorage` |

---

## How the Animations Work

### Application Phase Flow

```
isLoading = true
    └─► <LoadingScreen>  ──(2.8 s)──► onComplete()
                                           │
                                   isLoading = false
                                   phase = 'setup'
                                           │
                                    <SetupScreen> ──► onStart()
                                                          │
                                                   phase = 'game'
                                                          │
                                                   <Game layout>
```

`AnimatePresence` wraps each overlay so the exit animation completes before the component unmounts.

---

### Board Remount Trick

`<Board key={gameKey} />` in App.jsx holds the key to the grid line re-animation. Every time `restartGame()` or `resetScore()` is called, `gameKey` increments by 1. React sees a new `key`, unmounts the old Board, and mounts a fresh one — the four SVG grid lines draw themselves in from scratch every time.

---

### SVG Path Drawing

Framer Motion's `pathLength` property animates a CSS `stroke-dashoffset` under the hood, creating the hand-drawn effect:

| Element | Initial | Animate | Notes |
|---|---|---|---|
| Board grid lines | `pathLength: 0` | `pathLength: 1` | 4 lines, staggered 0.18 s apart |
| X — stroke 1 | `pathLength: 0` | `pathLength: 1` | 0.22 s duration |
| X — stroke 2 | `pathLength: 0` | `pathLength: 1` | 0.22 s, delayed 0.18 s |
| O circle | `pathLength: 0` | `pathLength: 1` | 0.42 s, SVG rotated −90° to start from top |
| Win line | `pathLength: 0` | `pathLength: 1` | 0.45 s, two layers (glow + crisp) |

---

### Score Number Flip

`AnimatePresence mode="popLayout"` wraps each score digit. The `key` prop is set to the score value. When the score changes, React triggers an exit + enter animation simultaneously:

```
Old number → exits:   y: 0 → y: 22  (slides down and fades out)
New number → enters:  y: -22 → y: 0  (drops in from above)
```

This produces a slot-machine ticker effect on every point scored.

---

## Scripts

```bash
npm run dev       # Start Vite dev server with hot module replacement
npm run build     # Production build output to /dist
npm run preview   # Serve the /dist production build locally
npm run lint      # Run ESLint across the src/ directory
```

---

## License

This project is open source and available under the [MIT License](LICENSE).
