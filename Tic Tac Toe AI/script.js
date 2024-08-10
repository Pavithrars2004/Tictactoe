const board = document.querySelectorAll('.cell');
const restartButton = document.getElementById('restartButton');
let currentPlayer = 'X';
let gameBoard = ['', '', '', '', '', '', '', '', ''];

// Add click event listener to each cell
board.forEach(cell => cell.addEventListener('click', handleCellClick));

// Restart the game
restartButton.addEventListener('click', restartGame);

function handleCellClick(e) {
    const index = e.target.dataset.index;

    // If cell is already filled or the game is over, do nothing
    if (gameBoard[index] !== '' || isGameOver()) return;

    // Player's move
    gameBoard[index] = currentPlayer;
    e.target.textContent = currentPlayer;

    // Check if the player wins or it's a draw
    if (isGameOver()) return;

    // AI's move
    if (currentPlayer === 'X') {
        currentPlayer = 'O';
        bestMove();
        currentPlayer = 'X';
    }
}

function bestMove() {
    let bestScore = -Infinity;
    let move;

    for (let i = 0; i < gameBoard.length; i++) {
        if (gameBoard[i] === '') {
            gameBoard[i] = 'O';
            let score = minimax(gameBoard, 0, false);
            gameBoard[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }

    gameBoard[move] = 'O';
    board[move].textContent = 'O';

    isGameOver(); // Check if AI's move causes the game to end
}

function minimax(board, depth, isMaximizing) {
    let result = checkWinner();
    if (result !== null) {
        return result === 'O' ? 10 : result === 'X' ? -10 : 0;
    }

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    const winPatterns = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    for (const pattern of winPatterns) {
        const [a, b, c] = pattern;
        if (gameBoard[a] && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c]) {
            return gameBoard[a];
        }
    }

    return gameBoard.includes('') ? null : 'tie';
}

function isGameOver() {
    const winner = checkWinner();
    if (winner) {
        const winnerMessage = winner === 'tie' ? 'It\'s a tie!' : `${winner} wins!`;
        setTimeout(() => alert(winner === 'X' ? `Human (${winner}) wins!` : `AI (${winner}) wins!`), 100);
        return true;
    }
    return false;
}

function restartGame() {
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    board.forEach(cell => cell.textContent = '');
}
