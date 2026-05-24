import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function DateTimeClock({ lastGame }) {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(t)
  }, [])

  const h12   = now.getHours() % 12 || 12
  const hh    = String(h12).padStart(2, '0')
  const mm    = String(now.getMinutes()).padStart(2, '0')
  const ss    = String(now.getSeconds()).padStart(2, '0')
  const ampm  = now.getHours() >= 12 ? 'PM' : 'AM'
  const dayName = now.toLocaleDateString('en-US', { weekday: 'long' })
  const day     = now.getDate()
  const month   = now.toLocaleDateString('en-US', { month: 'long' })
  const year    = now.getFullYear()

  return (
    <div
      className="flex flex-col gap-4 p-5 rounded-3xl"
      style={{
        background:     'var(--card-bg)',
        backdropFilter: 'blur(20px) saturate(160%)',
        border:         '1px solid var(--card-border)',
        boxShadow:      'var(--card-shadow)',
      }}
    >
      {/* Live dot */}
      <div className="flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-60"
                style={{ background: 'var(--accent)' }} />
          <span className="relative inline-flex rounded-full h-2 w-2"
                style={{ background: 'var(--accent)' }} />
        </span>
        <span className="text-[10px] font-bold uppercase tracking-[0.22em]"
              style={{ color: 'var(--text-faint)' }}>
          Live
        </span>
      </div>

      {/* Time */}
      <div className="tabular-nums">
        <div className="flex items-baseline gap-0.5">
          <span className="text-4xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>{hh}</span>
          <span className="text-4xl font-black leading-none" style={{ color: 'var(--text-lighter)' }}>:</span>
          <span className="text-4xl font-black leading-none" style={{ color: 'var(--text-primary)' }}>{mm}</span>
          <span className="text-4xl font-black leading-none" style={{ color: 'var(--text-lighter)' }}>:</span>
          <span className="text-4xl font-black leading-none" style={{ color: 'var(--accent)' }}>{ss}</span>
        </div>
        <p className="text-xs font-semibold mt-1" style={{ color: 'var(--text-faint)' }}>{ampm}</p>
      </div>

      {/* Date */}
      <div
        className="flex flex-col gap-0.5"
        style={{ borderTop: '1px solid var(--sep)', paddingTop: '12px' }}
      >
        <p className="text-base font-bold" style={{ color: 'var(--text-secondary)' }}>{dayName}</p>
        <p className="text-sm"             style={{ color: 'var(--text-muted)' }}>{day} {month}</p>
        <p className="text-sm"             style={{ color: 'var(--text-soft)' }}>{year}</p>
      </div>

      {/* Last game */}
      <AnimatePresence>
        {lastGame && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{    opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div
              style={{ borderTop: '1px solid var(--sep)', paddingTop: '12px' }}
              className="flex flex-col gap-1"
            >
              <p className="text-[9px] font-bold uppercase tracking-[0.18em]"
                 style={{ color: 'var(--text-faint)' }}>
                Last Game
              </p>
              <div className="flex items-center gap-1 flex-wrap">
                <span className="font-black text-sm" style={{ color: 'var(--text-primary)' }}>
                  {lastGame.player1}
                </span>
                <span className="text-xs" style={{ color: 'var(--text-lighter)' }}>vs</span>
                <span className="font-black text-sm" style={{ color: 'var(--color-o)' }}>
                  {lastGame.player2}
                </span>
              </div>
              <p className="text-xs" style={{ color: 'var(--text-soft)' }}>
                {lastGame.date} · {lastGame.time}
              </p>
              <p className="text-xs font-bold"
                 style={{ color: lastGame.isDraw ? 'var(--text-muted)' : 'var(--green)' }}>
                {lastGame.isDraw ? 'Draw' : `${lastGame.winner} won`}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
