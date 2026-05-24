import { useEffect } from 'react'
import { motion } from 'framer-motion'
import Square from './Square'
import WinLine from './WinLine'
import { getWinningSquares } from '../utils/gameLogic'

const lineVariant = {
  hidden:  { pathLength: 0, opacity: 0 },
  visible: (delay) => ({
    pathLength: 1,
    opacity: 1,
    transition: { delay, duration: 0.48, ease: 'easeInOut' },
  }),
}

export default function Board({ squares, onSquareClick, winner, playLine }) {
  const winningSquares = winner ? getWinningSquares(squares) : []

  useEffect(() => {
    if (!playLine) return
    const delays = [0.1, 0.28, 0.46, 0.64]
    const timers = delays.map((d) => setTimeout(() => playLine(), d * 1000))
    return () => timers.forEach(clearTimeout)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      className="relative rounded-3xl p-4 sm:p-5"
      style={{
        background:     'var(--card-bg-board)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border:         '1px solid var(--card-border-solid)',
        boxShadow:      'var(--card-shadow-board)',
      }}
    >
      {/* Inner board — sized by CSS vars, SVG grid scales via viewBox */}
      <div
        className="relative"
        style={{ width: 'var(--board)', height: 'var(--board)' }}
      >
        {/* SVG grid lines */}
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          viewBox="0 0 360 360"
        >
          <motion.line x1="6"   y1="120" x2="354" y2="120"
            style={{ stroke: 'var(--grid-line)' }} strokeWidth="2" strokeLinecap="round"
            variants={lineVariant} initial="hidden" animate="visible" custom={0.10} />
          <motion.line x1="6"   y1="240" x2="354" y2="240"
            style={{ stroke: 'var(--grid-line)' }} strokeWidth="2" strokeLinecap="round"
            variants={lineVariant} initial="hidden" animate="visible" custom={0.28} />
          <motion.line x1="120" y1="6"   x2="120" y2="354"
            style={{ stroke: 'var(--grid-line)' }} strokeWidth="2" strokeLinecap="round"
            variants={lineVariant} initial="hidden" animate="visible" custom={0.46} />
          <motion.line x1="240" y1="6"   x2="240" y2="354"
            style={{ stroke: 'var(--grid-line)' }} strokeWidth="2" strokeLinecap="round"
            variants={lineVariant} initial="hidden" animate="visible" custom={0.64} />
        </svg>

        {/* 3×3 cell grid */}
        <div
          className="absolute inset-0 grid"
          style={{
            gridTemplateColumns: 'repeat(3, var(--cell))',
            gridTemplateRows:    'repeat(3, var(--cell))',
          }}
        >
          {squares.map((value, index) => (
            <Square
              key={index}
              value={value}
              onClick={() => onSquareClick(index)}
              isWinning={winningSquares.includes(index)}
            />
          ))}
        </div>

        {/* Win line */}
        {winner && <WinLine winningSquares={winningSquares} winner={winner} />}
      </div>
    </div>
  )
}
