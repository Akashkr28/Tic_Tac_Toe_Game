import { useEffect } from 'react'
import { motion } from 'framer-motion'

export default function LoadingScreen({ onComplete }) {
  useEffect(() => {
    const t = setTimeout(onComplete, 2800)
    return () => clearTimeout(t)
  }, [onComplete])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
      style={{ background: 'var(--bg-page)' }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.75, ease: [0.32, 0, 0.67, 0] }}
    >
      {/* Blobs */}
      <motion.div
        className="absolute top-[-5%] right-[-5%] w-[500px] h-[500px] rounded-full"
        style={{ background: 'var(--bg-blob-1)' }}
        animate={{ scale: [1, 1.08, 1], rotate: [0, 15, 0] }}
        transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-[-5%] left-[-5%] w-[450px] h-[450px] rounded-full"
        style={{ background: 'var(--bg-blob-2)' }}
        animate={{ scale: [1, 1.1, 1], rotate: [0, -12, 0] }}
        transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />

      {/* X and O */}
      <div className="flex items-center gap-10 sm:gap-14 mb-10">
        {/* X */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: -15 }}
          animate={{ opacity: 1, scale: 1,   rotate: 0 }}
          transition={{ delay: 0.2, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg viewBox="0 0 100 100" className="w-20 h-20 sm:w-28 sm:h-28" fill="none"
               style={{ filter: 'drop-shadow(0 4px 16px rgba(28,25,23,0.12))' }}>
            <motion.line
              x1="18" y1="18" x2="82" y2="82"
              style={{ stroke: 'var(--color-x)' }}
              strokeWidth="11" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.5, duration: 0.35, ease: 'easeOut' }}
            />
            <motion.line
              x1="82" y1="18" x2="18" y2="82"
              style={{ stroke: 'var(--color-x)' }}
              strokeWidth="11" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 0.88, duration: 0.35, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>

        {/* Separator */}
        <motion.span
          className="text-5xl sm:text-6xl font-thin"
          style={{ color: 'var(--text-lighter)' }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.05, duration: 0.3 }}
        >
          ×
        </motion.span>

        {/* O */}
        <motion.div
          initial={{ opacity: 0, scale: 0.6, rotate: 15 }}
          animate={{ opacity: 1, scale: 1,   rotate: 0 }}
          transition={{ delay: 0.6, duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <svg viewBox="0 0 100 100"
               className="w-20 h-20 sm:w-28 sm:h-28"
               fill="none"
               style={{ transform: 'rotate(-90deg)' }}>
            <motion.circle
              cx="50" cy="50" r="34"
              style={{ stroke: 'var(--color-o)' }}
              strokeWidth="11" fill="none" strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ delay: 1.1, duration: 0.55, ease: 'easeOut' }}
            />
          </svg>
        </motion.div>
      </div>

      {/* Title */}
      <motion.div
        className="text-center px-4"
        initial={{ opacity: 0, y: 22 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.75, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="text-4xl sm:text-5xl font-black tracking-tight"
            style={{ color: 'var(--text-primary)' }}>
          Tic Tac Toe
        </h1>
        <p className="text-sm mt-2 tracking-[0.25em] uppercase font-medium"
           style={{ color: 'var(--text-soft)' }}>
          A Classic Reimagined
        </p>
      </motion.div>

      {/* Loading dots */}
      <motion.div
        className="absolute bottom-12 sm:bottom-14 flex gap-2.5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.1 }}
      >
        {[0, 1, 2].map(i => (
          <motion.div
            key={i} className="w-2 h-2 rounded-full"
            style={{ background: 'var(--accent)' }}
            animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 1.1, delay: i * 0.22, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>
    </motion.div>
  )
}
