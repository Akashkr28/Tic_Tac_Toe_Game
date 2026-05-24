import { useRef, useCallback } from 'react'

export function useSound() {
  const ctxRef  = useRef(null)
  const enabled = useRef(true)

  /* ── lazily create / resume AudioContext ── */
  function ac() {
    if (typeof window === 'undefined') return null
    if (!ctxRef.current) {
      const AC = window.AudioContext || window.webkitAudioContext
      if (!AC) return null
      ctxRef.current = new AC()
    }
    if (ctxRef.current.state === 'suspended') ctxRef.current.resume()
    return ctxRef.current
  }

  /* ── shared white-noise scratch helper ── */
  function scratch(durationSec, freq, gain, startGain = 0.02) {
    const ctx = ac()
    if (!ctx) return
    const sr  = ctx.sampleRate
    const buf = ctx.createBuffer(1, sr * durationSec, sr)
    const d   = buf.getChannelData(0)
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1

    const src = ctx.createBufferSource()
    src.buffer = buf

    const bp = ctx.createBiquadFilter()
    bp.type            = 'bandpass'
    bp.frequency.value = freq
    bp.Q.value         = 0.55

    const g = ctx.createGain()
    const t = ctx.currentTime
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(gain, t + startGain)
    g.gain.exponentialRampToValueAtTime(0.0001, t + durationSec)

    src.connect(bp)
    bp.connect(g)
    g.connect(ctx.destination)
    src.start(t)
    src.stop(t + durationSec)
  }

  /* ── pencil scratch: short ── */
  const playDraw = useCallback(() => {
    if (!enabled.current) return
    scratch(0.22, 4400, 0.38, 0.018)
  }, [])

  /* ── pencil scratch: longer (board line) ── */
  const playLine = useCallback(() => {
    if (!enabled.current) return
    scratch(0.38, 3200, 0.26, 0.04)
  }, [])

  /* ── soft click (button) ── */
  const playClick = useCallback(() => {
    if (!enabled.current) return
    const ctx = ac()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type            = 'sine'
    osc.frequency.value = 720
    const t = ctx.currentTime
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.07, t + 0.008)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.09)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.09)
  }, [])

  /* ── ascending fanfare (win) ── */
  const playWin = useCallback(() => {
    if (!enabled.current) return
    const ctx = ac()
    if (!ctx) return
    const melody = [523.25, 659.25, 783.99, 1046.5] // C5 E5 G5 C6
    melody.forEach((freq, i) => {
      const osc = ctx.createOscillator()
      const g   = ctx.createGain()
      osc.type            = 'sine'
      osc.frequency.value = freq
      const t = ctx.currentTime + i * 0.13
      g.gain.setValueAtTime(0, t)
      g.gain.linearRampToValueAtTime(0.22, t + 0.04)
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.45)
      osc.connect(g)
      g.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.45)
    })
  }, [])

  /* ── low neutral thud (draw) ── */
  const playDrawMatch = useCallback(() => {
    if (!enabled.current) return
    const ctx = ac()
    if (!ctx) return
    const osc = ctx.createOscillator()
    const g   = ctx.createGain()
    osc.type            = 'triangle'
    osc.frequency.value = 260
    osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.5)
    const t = ctx.currentTime
    g.gain.setValueAtTime(0, t)
    g.gain.linearRampToValueAtTime(0.18, t + 0.04)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.55)
    osc.connect(g)
    g.connect(ctx.destination)
    osc.start(t)
    osc.stop(t + 0.55)
  }, [])

  /* ── toggle ── */
  const toggle = useCallback(() => {
    enabled.current = !enabled.current
    return enabled.current
  }, [])

  const isEnabled = () => enabled.current

  return { playDraw, playLine, playClick, playWin, playDrawMatch, toggle, isEnabled }
}
