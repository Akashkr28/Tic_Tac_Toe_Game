import { motion, AnimatePresence } from 'framer-motion'

function ScoreRow({ name, symbol, score, colorVar, activeBg, activeBorder, isActive }) {
  return (
    <div
      className="flex items-center justify-between px-4 py-3 rounded-2xl transition-all duration-300"
      style={{
        background:  isActive ? activeBg     : 'var(--score-inactive-bg)',
        border:      `1px solid ${isActive ? activeBorder : 'var(--score-inactive-border)'}`,
        boxShadow:   isActive ? `0 4px 16px ${activeBorder}` : 'none',
        transform:   isActive ? 'scale(1.02)' : 'scale(1)',
      }}
    >
      <div className="min-w-0 flex-1 mr-2">
        <p className="text-[9px] font-bold uppercase tracking-wider"
           style={{ color: isActive ? `var(${colorVar})` : 'var(--text-lighter)' }}>
          {symbol}
        </p>
        <p
          className="font-black leading-tight mt-0.5 truncate"
          style={{
            color:    `var(${colorVar})`,
            fontSize: name.length > 10 ? '13px' : '17px',
          }}
          title={name}
        >
          {name}
        </p>
      </div>

      <div className="relative h-11 flex items-center overflow-hidden flex-shrink-0">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={score}
            className="text-4xl font-black tabular-nums"
            style={{ color: `var(${colorVar})` }}
            initial={{ y: -22, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    y: 22,  opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {score}
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default function Scoreboard({ scores, currentPlayer, winner, players, gameMode }) {
  const totalGames = scores.X + scores.O + scores.draws
  const p1Name = players?.X ?? 'Player X'
  const p2Name = players?.O ?? 'Player O'

  const activeX = !winner && currentPlayer === 'X'
  const activeO = !winner && currentPlayer === 'O'

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-3xl"
      style={{
        background:     'var(--card-bg)',
        backdropFilter: 'blur(20px) saturate(160%)',
        border:         '1px solid var(--card-border)',
        boxShadow:      'var(--card-shadow)',
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-[10px] font-bold uppercase tracking-[0.22em]"
           style={{ color: 'var(--text-faint)' }}>
          Scoreboard
        </p>
        {gameMode === 'pvai' && (
          <span
            className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
            style={{ background: 'rgba(185,122,26,0.12)', color: 'var(--accent-deep)' }}
          >
            vs AI
          </span>
        )}
      </div>

      {/* Player X */}
      <ScoreRow
        name={p1Name} symbol="X" score={scores.X}
        colorVar="--color-x"
        activeBg="var(--score-x-bg)"
        activeBorder="var(--score-x-border)"
        isActive={activeX || winner === 'X'}
      />

      {/* Draws */}
      <div
        className="flex items-center justify-between px-4 py-3 rounded-2xl"
        style={{
          background: 'var(--score-inactive-bg)',
          border:     '1px solid var(--score-inactive-border)',
        }}
      >
        <div>
          <p className="text-[9px] font-bold uppercase tracking-wider"
             style={{ color: 'var(--text-lighter)' }}>
            Total
          </p>
          <p className="text-lg font-black leading-tight mt-0.5"
             style={{ color: 'var(--text-muted)' }}>
            Draws
          </p>
        </div>
        <AnimatePresence mode="popLayout">
          <motion.span
            key={scores.draws}
            className="text-4xl font-black tabular-nums"
            style={{ color: 'var(--text-muted)' }}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0,   opacity: 1 }}
            exit={{    y: 20,  opacity: 0 }}
            transition={{ type: 'spring', stiffness: 380, damping: 28 }}
          >
            {scores.draws}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Player O */}
      <ScoreRow
        name={p2Name} symbol="O" score={scores.O}
        colorVar="--color-o"
        activeBg="rgba(185,122,26,0.08)"
        activeBorder="rgba(185,122,26,0.28)"
        isActive={activeO || winner === 'O'}
      />

      {/* Footer */}
      <div
        className="pt-2 text-center"
        style={{ borderTop: '1px solid var(--score-sep)' }}
      >
        <p className="text-[10px]" style={{ color: 'var(--text-lighter)' }}>
          Games played:{' '}
          <span className="font-semibold" style={{ color: 'var(--text-soft)' }}>
            {totalGames}
          </span>
        </p>
      </div>
    </div>
  )
}
