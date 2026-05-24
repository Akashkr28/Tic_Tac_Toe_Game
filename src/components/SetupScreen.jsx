import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const DIFFICULTIES = [
  { key: 'easy',   label: 'Easy',   color: 'var(--green)', bg: 'rgba(45,138,78,0.10)',  border: 'rgba(45,138,78,0.30)'  },
  { key: 'medium', label: 'Medium', color: 'var(--accent-deep)', bg: 'rgba(185,122,26,0.10)', border: 'rgba(185,122,26,0.30)' },
  { key: 'hard',   label: 'Hard',   color: 'var(--red)',   bg: 'rgba(192,64,48,0.10)',  border: 'rgba(192,64,48,0.30)'  },
]

function ModeCard({ icon, title, desc, active, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="flex flex-col items-center gap-2 p-4 sm:p-5 rounded-2xl text-center w-full"
      style={{
        background: active
          ? 'linear-gradient(135deg, rgba(232,184,64,0.18), rgba(201,149,42,0.10))'
          : 'var(--mode-inactive-bg)',
        border: `2px solid ${active ? 'rgba(200,148,40,0.55)' : 'var(--mode-inactive-border)'}`,
        boxShadow: active ? '0 4px 20px rgba(200,148,40,0.18)' : 'none',
      }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 380, damping: 26 }}
    >
      <span className="text-3xl sm:text-4xl">{icon}</span>
      <p className="font-black text-sm"
         style={{ color: active ? 'var(--text-primary)' : 'var(--text-body)' }}>
        {title}
      </p>
      <p className="text-xs leading-tight" style={{ color: 'var(--text-soft)' }}>{desc}</p>
    </motion.button>
  )
}

function NameInput({ label, placeholder, value, onChange, accentColor }) {
  const [focused, setFocused] = useState(false)
  return (
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-2"
         style={{ color: 'var(--text-faint)' }}>
        {label}
      </p>
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={18}
        className="w-full px-4 py-3 rounded-2xl text-base font-semibold outline-none transition-all duration-200"
        style={{
          background: 'var(--input-bg)',
          border:     `1.5px solid ${focused ? accentColor + '70' : 'var(--input-border)'}`,
          color:      accentColor,
          boxShadow:  focused ? `0 0 0 3px ${accentColor}18` : 'none',
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      />
    </div>
  )
}

export default function SetupScreen({ onStart }) {
  const [mode,       setMode]       = useState('pvp')
  const [name1,      setName1]      = useState('')
  const [name2,      setName2]      = useState('')
  const [difficulty, setDifficulty] = useState('hard')

  function handleStart() {
    onStart({
      mode,
      player1:    name1.trim() || 'Player X',
      player2:    mode === 'pvai' ? 'Computer' : (name2.trim() || 'Player O'),
      difficulty,
    })
  }

  return (
    <motion.div
      className="fixed inset-0 z-40 flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'var(--bg-page)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.02 }}
      transition={{ duration: 0.45 }}
    >
      {/* Blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-8%] w-80 sm:w-96 h-80 sm:h-96 rounded-full"
             style={{ background: 'var(--bg-blob-1)' }} />
        <div className="absolute bottom-[-8%] left-[-6%] w-72 sm:w-80 h-72 sm:h-80 rounded-full"
             style={{ background: 'var(--bg-blob-2)' }} />
      </div>

      {/* Card */}
      <motion.div
        className="relative w-full max-w-md rounded-3xl p-6 sm:p-8"
        style={{
          background:     'var(--card-bg-solid)',
          backdropFilter: 'blur(24px) saturate(180%)',
          border:         '1px solid var(--card-border-solid)',
          boxShadow:      'var(--card-shadow-board)',
        }}
        initial={{ y: 28, opacity: 0 }}
        animate={{ y: 0,  opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <div className="text-center mb-6 sm:mb-7">
          <h2 className="text-2xl sm:text-3xl font-black" style={{ color: 'var(--text-primary)' }}>
            New Game
          </h2>
          <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>
            Choose a mode and set player names
          </p>
        </div>

        {/* Mode selector */}
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
             style={{ color: 'var(--text-faint)' }}>
            Game Mode
          </p>
          <div className="grid grid-cols-2 gap-3">
            <ModeCard icon="⚔️" title="vs Player"   desc="Play with a friend locally"
              active={mode === 'pvp'}  onClick={() => setMode('pvp')} />
            <ModeCard icon="🤖" title="vs Computer" desc="Challenge the AI"
              active={mode === 'pvai'} onClick={() => setMode('pvai')} />
          </div>
        </div>

        {/* AI Difficulty */}
        <AnimatePresence>
          {mode === 'pvai' && (
            <motion.div
              className="mb-5 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{    opacity: 0, height: 0 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
                 style={{ color: 'var(--text-faint)' }}>
                AI Difficulty
              </p>
              <div className="flex gap-2">
                {DIFFICULTIES.map(d => (
                  <motion.button
                    key={d.key}
                    onClick={() => setDifficulty(d.key)}
                    className="flex-1 py-2.5 rounded-xl text-sm font-bold"
                    style={{
                      background: difficulty === d.key ? d.bg     : 'var(--diff-inactive-bg)',
                      border:     `1.5px solid ${difficulty === d.key ? d.border : 'var(--diff-inactive-border)'}`,
                      color:      difficulty === d.key ? d.color  : 'var(--diff-inactive-color)',
                    }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                  >
                    {d.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Player names */}
        <div className="flex flex-col gap-4 mb-6 sm:mb-7">
          <NameInput
            label={`Player X${mode === 'pvai' ? '  (You)' : ''}`}
            placeholder="Enter name…"
            value={name1}
            onChange={setName1}
            accentColor="var(--color-x)"
          />

          {mode === 'pvp' ? (
            <NameInput
              label="Player O"
              placeholder="Enter name…"
              value={name2}
              onChange={setName2}
              accentColor="var(--color-o)"
            />
          ) : (
            <div className="px-4 py-3 rounded-2xl"
                 style={{ background: 'var(--ai-card-bg)', border: '1px solid var(--ai-card-border)' }}>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-1"
                 style={{ color: 'var(--accent-deep)' }}>
                Player O
              </p>
              <p className="font-black text-xl" style={{ color: 'var(--color-o)' }}>
                Computer 🤖
              </p>
            </div>
          )}
        </div>

        {/* Start button */}
        <motion.button
          onClick={handleStart}
          className="w-full py-4 rounded-2xl font-black text-base tracking-wide"
          style={{
            background: 'linear-gradient(135deg, #e8b840, #c9952a)',
            color:      '#1c1917',
            boxShadow:  '0 6px 24px rgba(200,148,40,0.32)',
          }}
          whileHover={{ scale: 1.02, boxShadow: '0 8px 32px rgba(200,148,40,0.46)' }}
          whileTap={{ scale: 0.97 }}
          transition={{ type: 'spring', stiffness: 380, damping: 26 }}
        >
          Start Game →
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
