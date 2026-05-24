import { motion } from 'framer-motion'

/* Symbol size = 56.7% of cell (≈ 68px at 120px cell, scales with --cell) */
const SYM = 'calc(var(--cell) * 0.567)'

function XSymbol() {
  return (
    <svg viewBox="0 0 100 100" style={{ width: SYM, height: SYM }} fill="none">
      <motion.line
        x1="20" y1="20" x2="80" y2="80"
        style={{ stroke: 'var(--color-x)' }}
        strokeWidth="9.5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
      />
      <motion.line
        x1="80" y1="20" x2="20" y2="80"
        style={{ stroke: 'var(--color-x)' }}
        strokeWidth="9.5" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.22, ease: 'easeOut', delay: 0.18 }}
      />
    </svg>
  )
}

function OSymbol() {
  return (
    <svg
      viewBox="0 0 100 100"
      style={{ width: SYM, height: SYM, transform: 'rotate(-90deg)' }}
      fill="none"
    >
      <motion.circle
        cx="50" cy="50" r="32"
        style={{ stroke: 'var(--color-o)' }}
        strokeWidth="9.5" fill="none" strokeLinecap="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.42, ease: 'easeOut' }}
      />
    </svg>
  )
}

export default function Square({ value, onClick, isWinning }) {
  const isX = value === 'X'
  const isO = value === 'O'

  const winStyle = isWinning
    ? {
        background:  isX ? 'var(--win-x-bg)'     : 'var(--win-o-bg)',
        borderColor: isX ? 'var(--win-x-border)'  : 'var(--win-o-border)',
      }
    : {}

  return (
    <motion.button
      onClick={onClick}
      className="relative flex items-center justify-center rounded-xl border border-transparent
                 cursor-pointer select-none transition-colors duration-150"
      style={{
        width:  'var(--cell)',
        height: 'var(--cell)',
        ...winStyle,
      }}
      whileHover={!value ? { scale: 1.06, backgroundColor: 'var(--shimmer-bg)' } : {}}
      whileTap={!value ? { scale: 0.94 } : {}}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
    >
      {!value && (
        <motion.div
          className="absolute rounded-lg pointer-events-none"
          style={{
            inset:  '8px',
            background: 'var(--shimmer-bg)',
            border: '1.5px dashed var(--shimmer-border)',
          }}
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
        />
      )}
      {isX && <XSymbol key="x" />}
      {isO && <OSymbol key="o" />}
    </motion.button>
  )
}
