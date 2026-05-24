import { motion } from 'framer-motion'

function cellCenter(idx) {
  return {
    x: (idx % 3) * 120 + 60,
    y: Math.floor(idx / 3) * 120 + 60,
  }
}

function getLineCoords(winningSquares, ext = 52) {
  const a = cellCenter(winningSquares[0])
  const c = cellCenter(winningSquares[2])
  const dx = c.x - a.x
  const dy = c.y - a.y
  const len = Math.sqrt(dx * dx + dy * dy)
  return {
    x1: a.x - (dx / len) * ext,
    y1: a.y - (dy / len) * ext,
    x2: c.x + (dx / len) * ext,
    y2: c.y + (dy / len) * ext,
  }
}

export default function WinLine({ winningSquares, winner }) {
  const { x1, y1, x2, y2 } = getLineCoords(winningSquares)

  /* Use CSS variables so colours flip with theme */
  const mainStroke = winner === 'X' ? 'var(--color-x)' : 'var(--color-o)'
  const glowStroke = winner === 'X' ? 'var(--grid-line)' : 'var(--accent-bright)'

  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 360 360"
      style={{ zIndex: 10 }}
    >
      {/* Glow */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={glowStroke}
        strokeWidth="14" strokeLinecap="round" opacity={0.18}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
      {/* Main line */}
      <motion.line
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={mainStroke}
        strokeWidth="5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.45, ease: 'easeOut' }}
      />
    </svg>
  )
}
