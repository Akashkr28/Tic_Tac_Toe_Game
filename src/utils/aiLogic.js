import { calculateWinner } from './gameLogic'

/* ── Minimax: returns a score for the current board state ── */
function minimax(squares, depth, isMaximizing, aiSymbol, humanSymbol) {
  const winner = calculateWinner(squares)
  if (winner === aiSymbol)   return 10 - depth
  if (winner === humanSymbol) return depth - 10
  if (squares.every(s => s !== null)) return 0

  const available = squares
    .map((s, i) => (s === null ? i : -1))
    .filter(i => i !== -1)

  if (isMaximizing) {
    let best = -Infinity
    for (const i of available) {
      const next = squares.slice()
      next[i] = aiSymbol
      best = Math.max(best, minimax(next, depth + 1, false, aiSymbol, humanSymbol))
    }
    return best
  } else {
    let best = Infinity
    for (const i of available) {
      const next = squares.slice()
      next[i] = humanSymbol
      best = Math.min(best, minimax(next, depth + 1, true, aiSymbol, humanSymbol))
    }
    return best
  }
}

/* ── Returns the best square index for the AI to play ── */
export function getBestMove(squares, aiSymbol = 'O', difficulty = 'hard') {
  const humanSymbol = aiSymbol === 'X' ? 'O' : 'X'
  const available   = squares
    .map((s, i) => (s === null ? i : -1))
    .filter(i => i !== -1)

  if (available.length === 0) return -1

  /* Easy: fully random */
  if (difficulty === 'easy') {
    return available[Math.floor(Math.random() * available.length)]
  }

  /* Medium: 50 % random, 50 % optimal */
  if (difficulty === 'medium' && Math.random() < 0.5) {
    return available[Math.floor(Math.random() * available.length)]
  }

  /* Hard (and medium-smart path): perfect minimax */
  let bestScore = -Infinity
  let bestMove  = available[0]

  for (const i of available) {
    const next = squares.slice()
    next[i] = aiSymbol
    const score = minimax(next, 0, false, aiSymbol, humanSymbol)
    if (score > bestScore) {
      bestScore = score
      bestMove  = i
    }
  }

  return bestMove
}
