// JavaScript file for TikTok game

// Game state
const cells = Array.from(document.getElementsByClassName('game-cell'));
let currentPlayer = 'X';
let gameOver = false;

// Add click event listener to each cell
cells.forEach(cell => {
  cell.addEventListener('click', makeMove);
});

// Function to handle cell click
function makeMove(event) {
  if (!gameOver && event.target.innerHTML === '') {
    event.target.innerHTML = currentPlayer;

    // Check for win
    if (checkWin(currentPlayer)) {
      document.getElementById('result').innerHTML = `Congratulations! You win!`;
      gameOver = true;
    } else {
      currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
      if (!checkTie()) {
        computerMove();
      }
    }
  }
}

// Function to make computer move
function computerMove() {
  if (!gameOver) {
    let bestScore = -Infinity;
    let bestMove;

    // Evaluate each possible move using the Minimax algorithm
    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML === '') {
        cells[i].innerHTML = currentPlayer;
        let score = minimax(cells, 0, false);
        cells[i].innerHTML = '';

        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    cells[bestMove].innerHTML = currentPlayer;

    // Check for win
    if (checkWin(currentPlayer)) {
      document.getElementById('result').innerHTML = `Sorry, you lose!`;
      gameOver = true;
    } else if (checkTie()) {
      document.getElementById('result').innerHTML = `It's a tie!`;
      gameOver = true;
    } else {
      currentPlayer = (currentPlayer === 'X') ? 'O' : 'X';
    }
  }
}

// Minimax algorithm
function minimax(cells, depth, isMaximizing) {
  if (checkWin('X')) {
    return depth - 10;
  } else if (checkWin('O')) {
    return 10 - depth;
  } else if (checkTie()) {
    return 0;
  }

  if (isMaximizing) {
    let bestScore = -Infinity;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML === '') {
        cells[i].innerHTML = 'O';
        let score = minimax(cells, depth + 1, false);
        cells[i].innerHTML = '';
        bestScore = Math.max(score, bestScore);
      }
    }

    return bestScore;
  } else {
    let bestScore = Infinity;

    for (let i = 0; i < cells.length; i++) {
      if (cells[i].innerHTML === '') {
        cells[i].innerHTML = 'X';
        let score = minimax(cells, depth + 1, true);
        cells[i].innerHTML = '';
        bestScore = Math.min(score, bestScore);
      }
    }

    return bestScore;
  }
}

// Function to check for a win
function checkWin(player) {
  const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6] // Diagonals
  ];

  return winningCombos.some(combo => {
    return combo.every(index => cells[index].innerHTML === player);
  });
}

// Function to check for a tie
function checkTie() {
  return cells.every(cell => cell.innerHTML !== '');
}
