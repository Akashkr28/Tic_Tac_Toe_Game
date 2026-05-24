import { motion, AnimatePresence } from 'framer-motion'

const pop = {
  initial:    { opacity: 0, y: -10, scale: 0.92 },
  animate:    { opacity: 1, y: 0,   scale: 1 },
  exit:       { opacity: 0, y: 10,  scale: 0.92 },
  transition: { duration: 0.28, ease: [0.16, 1, 0.3, 1] },
}

export default function GameStatus({ winner, isDraw, currentPlayer, players, aiThinking }) {
  const currentName = players?.[currentPlayer] ?? `Player ${currentPlayer}`
  const winnerName  = winner ? (players?.[winner] ?? `Player ${winner}`) : null

  return (
    <AnimatePresence mode="wait">

      {/* AI thinking */}
      {!winner && !isDraw && aiThinking && (
        <motion.div key="ai-thinking" {...pop}
          className="px-8 sm:px-10 py-4 rounded-2xl text-center"
          style={{
            background:     'rgba(185,122,26,0.10)',
            border:         '1px solid rgba(185,122,26,0.26)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-2"
             style={{ color: 'var(--text-soft)' }}>
            Computer
          </p>
          <div className="flex items-center justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <motion.span
                key={i} className="inline-block w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--accent)' }}
                animate={{ opacity: [0.3, 1, 0.3], y: [0, -4, 0] }}
                transition={{ duration: 0.75, delay: i * 0.18, repeat: Infinity }}
              />
            ))}
            <p className="text-base font-bold ml-1" style={{ color: 'var(--accent-deep)' }}>
              Thinking…
            </p>
          </div>
        </motion.div>
      )}

      {/* Winner */}
      {winner && (
        <motion.div key={`win-${winner}`} {...pop}
          className="px-8 sm:px-10 py-4 rounded-2xl text-center"
          style={{
            background:     winner === 'X'
              ? 'rgba(28,25,23,0.07)'
              : 'rgba(185,122,26,0.10)',
            border:         `1px solid ${winner === 'X'
              ? 'rgba(28,25,23,0.18)'
              : 'rgba(185,122,26,0.28)'}`,
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1"
             style={{ color: 'var(--text-soft)' }}>
            Winner
          </p>
          <p className="text-2xl sm:text-3xl font-black"
             style={{ color: winner === 'X' ? 'var(--color-x)' : 'var(--color-o)' }}>
            {winnerName}
          </p>
        </motion.div>
      )}

      {/* Draw */}
      {!winner && isDraw && (
        <motion.div key="draw" {...pop}
          className="px-8 sm:px-10 py-4 rounded-2xl text-center"
          style={{
            background:     'var(--card-bg)',
            border:         '1px solid var(--card-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1"
             style={{ color: 'var(--text-soft)' }}>
            Result
          </p>
          <p className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-muted)' }}>
            Draw!
          </p>
        </motion.div>
      )}

      {/* Current turn */}
      {!winner && !isDraw && !aiThinking && (
        <motion.div key={`turn-${currentPlayer}`} {...pop}
          className="px-8 sm:px-10 py-4 rounded-2xl text-center"
          style={{
            background:     'var(--card-bg)',
            border:         '1px solid var(--card-border)',
            backdropFilter: 'blur(12px)',
          }}
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] mb-1"
             style={{ color: 'var(--text-soft)' }}>
            Current Turn
          </p>
          <p className="text-xl font-semibold" style={{ color: 'var(--text-body)' }}>
            <span
              className="text-xl sm:text-2xl font-black"
              style={{ color: currentPlayer === 'X' ? 'var(--color-x)' : 'var(--color-o)' }}
            >
              {currentName}
            </span>
          </p>
        </motion.div>
      )}

    </AnimatePresence>
  )
}
