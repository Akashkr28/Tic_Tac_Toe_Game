// All 8 possible winning combinations (row/col/diagonal indices)
export const WINNING_LINES = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7], 
    [2, 5, 8], 
    [0, 4, 8], 
    [2, 4, 6],
  ];
  
  // Returns 'X', 'O', or null
  export function calculateWinner(squares) {
    for (const [a, b, c] of WINNING_LINES) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return squares[a];
        }
    }
    return null;
  }
  
  // Returns the [a, b, c] indices of the winning line, or []
  export function getWinningSquares(squares) {
    for (const [a, b, c] of WINNING_LINES) {
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [a, b, c];
        }
    }
    return [];
  }
  
  // Returns true when the game is a draw
  export function isDraw(squares) {
    return squares.every((square) => square !== null) && calculateWinner(squares) === null;
  }