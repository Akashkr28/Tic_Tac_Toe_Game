const KEY = 'ttt_history'

/* ── Save a finished game and return the stored entry ── */
export function saveGame({ mode, player1, player2, winner, isDraw }) {
  const now   = new Date()
  const entry = {
    id:        now.getTime(),
    date:      now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' }),
    time:      now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
    timestamp: now.getTime(),
    mode,       // 'pvp' | 'pvai'
    player1,    // name of X player
    player2,    // name of O player (or 'Computer')
    winner,     // player name string, or null for draw
    isDraw,
  }

  const history = getHistory()
  history.unshift(entry)          // newest first
  if (history.length > 30) history.length = 30

  try { localStorage.setItem(KEY, JSON.stringify(history)) } catch (_) {}

  return entry
}

/* ── Read full history ── */
export function getHistory() {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

/* ── Wipe history ── */
export function clearHistory() {
  try { localStorage.removeItem(KEY) } catch (_) {}
}

/* ── Last played entry ── */
export function getLastGame() {
  const h = getHistory()
  return h.length > 0 ? h[0] : null
}
