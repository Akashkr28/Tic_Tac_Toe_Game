import { useState, useEffect } from 'react'
import { motion, AnimatePresence, useAnimationControls } from 'framer-motion'
import confetti from 'canvas-confetti'

import Board          from './components/Board'
import GameStatus     from './components/GameStatus'
import Scoreboard     from './components/Scoreboard'
import DateTimeClock  from './components/DateTimeClock'
import LoadingScreen  from './components/LoadingScreen'
import SetupScreen    from './components/SetupScreen'
import Dashboard      from './components/Dashboard'

import { calculateWinner, isDraw } from './utils/gameLogic'
import { getBestMove }             from './utils/aiLogic'
import { saveGame, getLastGame }   from './utils/storage'
import { useSound }                from './hooks/useSound'

/* ── Icon helpers ── */
const SoundOnIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
)
const SoundOffIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
    <line x1="23" y1="9" x2="17" y2="15"/>
    <line x1="17" y1="9" x2="23" y2="15"/>
  </svg>
)
const HistoryIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M3 3v5h5"/>
    <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/>
    <path d="M12 7v5l4 2"/>
  </svg>
)
const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1"  x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22"  x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3"  y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)
const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
       strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

/* ═══════════════════════════════════════════════════════════════ */
export default function App() {

  /* ── Theme (persisted) ── */
  const [darkMode, setDarkMode] = useState(() => {
    const stored = localStorage.getItem('ttt_theme')
    if (stored) return stored === 'dark'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode)
    localStorage.setItem('ttt_theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  /* ── Phases ── */
  const [isLoading, setIsLoading] = useState(true)
  const [phase,     setPhase]     = useState('setup')

  /* ── Config ── */
  const [gameMode,     setGameMode]     = useState('pvp')
  const [aiDifficulty, setAiDifficulty] = useState('hard')
  const [players,      setPlayers]      = useState({ X: 'Player X', O: 'Player O' })

  /* ── Game state ── */
  const [squares,    setSquares]    = useState(Array(9).fill(null))
  const [xIsNext,    setXIsNext]    = useState(true)
  const [scores,     setScores]     = useState({ X: 0, O: 0, draws: 0 })
  const [gameKey,    setGameKey]    = useState(0)
  const [aiThinking, setAiThinking] = useState(false)

  /* ── UI state ── */
  const [soundOn,       setSoundOn]       = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)
  const [lastGame,      setLastGame]      = useState(() => getLastGame())

  /* ── Sound + shake ── */
  const { playDraw, playLine, playClick, playWin, playDrawMatch, toggle } = useSound()
  const boardControls = useAnimationControls()

  /* ── Derived ── */
  const winner        = calculateWinner(squares)
  const draw          = isDraw(squares)
  const currentPlayer = xIsNext ? 'X' : 'O'

  /* ── Save result ── */
  function finishGame(nextSquares, winnerSymbol, isDrawResult) {
    const winnerName = winnerSymbol ? players[winnerSymbol] : null
    const entry = saveGame({
      mode:    gameMode,
      player1: players.X,
      player2: players.O,
      winner:  winnerName,
      isDraw:  isDrawResult,
    })
    setLastGame(entry)
  }

  /* ── Win effects ── */
  useEffect(() => {
    if (!winner) return
    setTimeout(() => confetti({
      particleCount: 130,
      spread: 80,
      origin: { y: 0.55 },
      colors: ['#e8b840', '#d4a020', '#1c1917', '#c9952a', '#f5e8b0'],
      gravity: 1.1,
    }), 320)
    boardControls.start({
      x: [0, -9, 9, -7, 7, -4, 4, -1, 1, 0],
      transition: { duration: 0.5, ease: 'easeOut' },
    })
  }, [winner]) // eslint-disable-line

  /* ── Draw sound ── */
  useEffect(() => { if (draw) playDrawMatch() }, [draw]) // eslint-disable-line

  /* ── Human click ── */
  function handleClick(index) {
    if (squares[index] || winner || draw) return
    if (gameMode === 'pvai' && !xIsNext) return

    playDraw()
    const next       = squares.slice()
    next[index]      = xIsNext ? 'X' : 'O'
    const nextWinner = calculateWinner(next)
    const nextDraw   = next.every(s => s !== null) && !nextWinner

    if (nextWinner) {
      setScores(prev => ({ ...prev, [nextWinner]: prev[nextWinner] + 1 }))
      finishGame(next, nextWinner, false)
      setTimeout(() => playWin(), 260)
    } else if (nextDraw) {
      setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
      finishGame(next, null, true)
    }
    setSquares(next)
    setXIsNext(!xIsNext)
  }

  /* ── AI move ── */
  useEffect(() => {
    if (gameMode !== 'pvai') return
    if (xIsNext)             return
    if (winner || draw)      return

    setAiThinking(true)
    const t = setTimeout(() => {
      setAiThinking(false)
      const move = getBestMove(squares, 'O', aiDifficulty)
      if (move === -1 || squares[move] !== null) return

      playDraw()
      const next       = squares.slice()
      next[move]       = 'O'
      const nextWinner = calculateWinner(next)
      const nextDraw   = next.every(s => s !== null) && !nextWinner

      if (nextWinner) {
        setScores(prev => ({ ...prev, O: prev.O + 1 }))
        finishGame(next, 'O', false)
        setTimeout(() => playWin(), 260)
      } else if (nextDraw) {
        setScores(prev => ({ ...prev, draws: prev.draws + 1 }))
        finishGame(next, null, true)
      }
      setSquares(next)
      setXIsNext(true)
    }, 680)

    return () => { clearTimeout(t); setAiThinking(false) }
  }, [squares, xIsNext, gameMode, winner, draw]) // eslint-disable-line

  /* ── Handlers ── */
  function restartGame() {
    playClick()
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setGameKey(k => k + 1)
    setAiThinking(false)
  }
  function resetScore() {
    playClick()
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setScores({ X: 0, O: 0, draws: 0 })
    setGameKey(k => k + 1)
    setAiThinking(false)
  }
  function handleSoundToggle() { setSoundOn(toggle()) }
  function handleStart({ mode, player1, player2, difficulty }) {
    playClick()
    setGameMode(mode)
    setAiDifficulty(difficulty)
    setPlayers({ X: player1, O: player2 })
    setSquares(Array(9).fill(null))
    setXIsNext(true)
    setScores({ X: 0, O: 0, draws: 0 })
    setGameKey(k => k + 1)
    setAiThinking(false)
    setPhase('game')
  }
  function goToSetup() { playClick(); setPhase('setup'); setAiThinking(false) }

  /* ── Icon button style helper ── */
  const iconBtn = {
    background:     'var(--icon-btn-bg)',
    border:         '1px solid var(--icon-btn-border)',
    backdropFilter: 'blur(8px)',
  }

  /* ══════════════════════════ RENDER ══════════════════════════ */
  return (
    <div
      className="relative min-h-screen overflow-x-hidden"
      style={{ background: 'var(--bg-page)' }}
    >
      {/* Ambient blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute top-[-8%] right-[-8%] w-[520px] h-[520px] rounded-full"
          style={{ background: 'var(--bg-blob-1)' }}
          animate={{ x: [0, 28, 0], y: [0, -18, 0], scale: [1, 1.06, 1] }}
          transition={{ duration: 13, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-[-6%] left-[-6%] w-[460px] h-[460px] rounded-full"
          style={{ background: 'var(--bg-blob-2)' }}
          animate={{ x: [0, -22, 0], y: [0, 20, 0], scale: [1, 1.08, 1] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut', delay: 3 }}
        />
      </div>

      {/* ── Game screen ── */}
      {!isLoading && phase === 'game' && (
        <motion.div
          className="relative flex items-start justify-center min-h-screen
                     px-4 py-6 sm:px-6 sm:py-8 lg:py-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {/* ─ Three-column on lg+, single column on smaller ─ */}
          <div className="flex flex-col lg:flex-row items-center lg:items-start
                          gap-6 w-full max-w-5xl">

            {/* LEFT: Clock — desktop only */}
            <motion.aside
              className="hidden lg:block w-52 flex-shrink-0 lg:sticky lg:top-10"
              initial={{ opacity: 0, x: -28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <DateTimeClock lastGame={lastGame} />
            </motion.aside>

            {/* CENTER: Main game area */}
            <div className="flex flex-col items-center gap-4 sm:gap-5 flex-1 w-full min-w-0">

              {/* Title + subtitle */}
              <motion.div
                className="text-center w-full"
                initial={{ opacity: 0, y: -18 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.04, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              >
                <h1
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Tic{' '}
                  <span style={{
                    background: 'linear-gradient(135deg, #c9952a, #e8b840)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>Tac</span>
                  {' '}Toe
                </h1>
                <p className="text-xs mt-1.5 tracking-[0.24em] uppercase font-medium"
                   style={{ color: 'var(--text-soft)' }}>
                  {gameMode === 'pvai'
                    ? `${players.X}  vs  Computer`
                    : `${players.X}  vs  ${players.O}`}
                </p>
                <button
                  onClick={goToSetup}
                  className="text-xs mt-1 underline underline-offset-2 font-medium
                             transition-opacity hover:opacity-70"
                  style={{ color: 'var(--text-faint)' }}
                >
                  ← Change Players
                </button>
              </motion.div>

              {/* Status */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.18, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <GameStatus
                  winner={winner}
                  isDraw={draw}
                  currentPlayer={currentPlayer}
                  players={players}
                  aiThinking={aiThinking}
                />
              </motion.div>

              {/* Board */}
              <motion.div animate={boardControls}>
                <motion.div
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.22, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Board
                    key={gameKey}
                    squares={squares}
                    onSquareClick={handleClick}
                    winner={winner}
                    playLine={soundOn ? playLine : null}
                  />
                </motion.div>
              </motion.div>

              {/* Action buttons */}
              <motion.div
                className="flex flex-wrap gap-2 sm:gap-2.5 items-center justify-center"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.32, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Restart */}
                <motion.button
                  onClick={restartGame}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: 'linear-gradient(135deg, #e8b840, #c9952a)',
                    color:      '#1c1917',
                    boxShadow:  '0 4px 16px rgba(200,148,40,0.30)',
                  }}
                  whileHover={{ scale: 1.05, boxShadow: '0 6px 24px rgba(200,148,40,0.45)' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                >
                  Restart Game
                </motion.button>

                {/* Reset Score */}
                <motion.button
                  onClick={resetScore}
                  className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background:     'var(--btn-glass)',
                    border:         '1px solid var(--btn-glass-border)',
                    color:          'var(--btn-glass-color)',
                    backdropFilter: 'blur(8px)',
                  }}
                  whileHover={{ scale: 1.05, background: 'var(--btn-glass-hover)' }}
                  whileTap={{ scale: 0.96 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 26 }}
                >
                  Reset Score
                </motion.button>

                {/* Sound */}
                <motion.button
                  onClick={handleSoundToggle}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{
                    ...iconBtn,
                    color: soundOn ? 'var(--icon-btn-active)' : 'var(--icon-btn-muted)',
                  }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title={soundOn ? 'Mute' : 'Unmute'}
                >
                  {soundOn ? <SoundOnIcon /> : <SoundOffIcon />}
                </motion.button>

                {/* Theme toggle */}
                <motion.button
                  onClick={() => setDarkMode(d => !d)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ ...iconBtn, color: 'var(--icon-btn-active)' }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title={darkMode ? 'Switch to light' : 'Switch to dark'}
                >
                  {darkMode ? <SunIcon /> : <MoonIcon />}
                </motion.button>

                {/* History */}
                <motion.button
                  onClick={() => setShowDashboard(true)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ ...iconBtn, color: 'var(--icon-btn-active)' }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.92 }}
                  title="Match history"
                >
                  <HistoryIcon />
                </motion.button>
              </motion.div>

              {/* Clock + Scoreboard — visible on mobile/tablet (below buttons) */}
              <motion.div
                className="flex flex-col sm:flex-row gap-4 w-full lg:hidden"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.38, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="flex-1">
                  <DateTimeClock lastGame={lastGame} />
                </div>
                <div className="flex-1">
                  <Scoreboard
                    scores={scores}
                    currentPlayer={currentPlayer}
                    winner={winner}
                    players={players}
                    gameMode={gameMode}
                  />
                </div>
              </motion.div>

            </div>{/* end CENTER */}

            {/* RIGHT: Scoreboard — desktop only */}
            <motion.aside
              className="hidden lg:block w-52 flex-shrink-0 lg:sticky lg:top-10"
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.12, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
            >
              <Scoreboard
                scores={scores}
                currentPlayer={currentPlayer}
                winner={winner}
                players={players}
                gameMode={gameMode}
              />
            </motion.aside>

          </div>
        </motion.div>
      )}

      {/* ── Overlays ── */}
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen key="loading" onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!isLoading && phase === 'setup' && (
          <SetupScreen key="setup" onStart={handleStart} />
        )}
      </AnimatePresence>

      <Dashboard
        isOpen={showDashboard}
        onClose={() => setShowDashboard(false)}
      />
    </div>
  )
}
