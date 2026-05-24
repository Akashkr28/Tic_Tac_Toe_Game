import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { getHistory, clearHistory } from '../utils/storage'

function HistoryCard({ entry, index }) {
  const isAI      = entry.mode === 'pvai'
  const resultTxt = entry.isDraw ? 'Draw' : `${entry.winner} wins`
  const resultClr = entry.isDraw ? 'var(--text-muted)' : 'var(--green)'

  return (
    <motion.div
      className="p-4 rounded-2xl"
      style={{
        background: 'var(--dash-card-bg)',
        border:     '1px solid var(--dash-card-border)',
        boxShadow:  '0 2px 8px rgba(0,0,0,0.06)',
      }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.035, duration: 0.25 }}
    >
      <div className="flex items-center justify-between mb-2">
        <p className="text-xs font-medium" style={{ color: 'var(--text-soft)' }}>
          {entry.date}
        </p>
        <span
          className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full"
          style={{
            background: isAI ? 'rgba(185,122,26,0.12)' : 'var(--score-inactive-bg)',
            color:      isAI ? 'var(--accent-deep)'     : 'var(--text-body)',
          }}
        >
          {isAI ? 'vs AI' : 'PvP'}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <span className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>
          {entry.player1}
        </span>
        <span className="text-xs" style={{ color: 'var(--text-lighter)' }}>vs</span>
        <span className="font-bold text-sm" style={{ color: 'var(--color-o)' }}>
          {entry.player2}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-xs" style={{ color: 'var(--text-faint)' }}>{entry.time}</p>
        <span className="text-xs font-bold" style={{ color: resultClr }}>{resultTxt}</span>
      </div>
    </motion.div>
  )
}

export default function Dashboard({ isOpen, onClose }) {
  const [history, setHistory] = useState([])

  useEffect(() => {
    if (isOpen) setHistory(getHistory())
  }, [isOpen])

  function handleClear() {
    clearHistory()
    setHistory([])
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40"
            style={{ background: 'var(--backdrop)', backdropFilter: 'blur(4px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Panel — full-width on mobile, fixed 370px on sm+ */}
          <motion.aside
            className="fixed right-0 top-0 h-full z-50 flex flex-col w-full sm:w-[370px]"
            style={{
              background:     'var(--dash-bg)',
              backdropFilter: 'blur(24px) saturate(160%)',
              borderLeft:     '1px solid var(--dash-border)',
              boxShadow:      '-20px 0 60px rgba(0,0,0,0.14)',
            }}
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 280, damping: 30 }}
          >
            {/* Header */}
            <div
              className="flex items-start justify-between px-6 py-5 flex-shrink-0"
              style={{ borderBottom: '1px solid var(--sep)' }}
            >
              <div>
                <h2 className="text-xl font-black" style={{ color: 'var(--text-primary)' }}>
                  Match History
                </h2>
                <p className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>
                  {history.length} game{history.length !== 1 ? 's' : ''} recorded
                </p>
              </div>
              <motion.button
                onClick={onClose}
                className="w-9 h-9 rounded-xl flex items-center justify-center mt-0.5"
                style={{
                  background: 'var(--score-inactive-bg)',
                  color:      'var(--text-muted)',
                  fontSize:   '14px',
                }}
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
              >
                ✕
              </motion.button>
            </div>

            {/* History list */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3">
              {history.length === 0 ? (
                <motion.div
                  className="flex flex-col items-center justify-center h-full gap-3 text-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <span className="text-5xl">🎮</span>
                  <p className="font-bold text-base" style={{ color: 'var(--text-muted)' }}>
                    No games yet
                  </p>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--text-faint)' }}>
                    Finish a game to see<br />your history here
                  </p>
                </motion.div>
              ) : (
                history.map((entry, i) => (
                  <HistoryCard key={entry.id} entry={entry} index={i} />
                ))
              )}
            </div>

            {/* Footer */}
            {history.length > 0 && (
              <div
                className="px-4 py-4 flex-shrink-0"
                style={{ borderTop: '1px solid var(--sep)' }}
              >
                <motion.button
                  onClick={handleClear}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    color:      'var(--red)',
                    border:     '1px solid color-mix(in srgb, var(--red) 30%, transparent)',
                    background: 'transparent',
                  }}
                  whileHover={{ background: 'color-mix(in srgb, var(--red) 8%, transparent)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  Clear All History
                </motion.button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
