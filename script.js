document.addEventListener("DOMContentLoaded", () => {
  const boardsElement = document.getElementById("game");
  const messageElement = document.getElementById("message");
  const resetButton = document.getElementById("resetButton");
  const difficultySelector = document.getElementById("difficulty");
  const currentDiv = document.getElementById("current");
  const turnDiv = document.getElementById("turn");

  let lostMessage = "COMPUTER WON!!";
  let wonMessage = "YOU WON!!";

  let currentPlayer = "X";

  let gameOver = false;
  let difficulty = "easy"; // Default difficulty

  const boards = Array.from({ length: 4 }, () =>
    Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => ""))
  );

  const renderBoards = () => {
    boardsElement.innerHTML = "";

    for (let i = 0; i < 4; i++) {
      const playFieldBox = document.createElement("div");
      playFieldBox.classList.add("playfield");
      const floorBox = document.createElement("div");
      floorBox.classList.add("floor");

      const boardElement = document.createElement("div");
      boardElement.classList.add("board");

      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          const cell = document.createElement("div");
          cell.classList.add("segment", `x${k % 4}`, `y${j % 4}`, `z0`);
          cell.dataset.row = i;
          cell.dataset.col = j;
          cell.dataset.depth = k;
          cell.textContent = boards[i][j][k];
          cell.addEventListener("click", handleCellClick);
          floorBox.appendChild(cell);
        }
      }
      playFieldBox.appendChild(floorBox);

      boardsElement.appendChild(playFieldBox);
    }
    currentDiv.classList.add(currentPlayer.toLowerCase());
    turnDiv.innerText = "Your Turn:";
  };

  const handleCellClick = (event) => {
    if (currentPlayer === "O") {
      console.log("Wait for Your Move ");

      return;
    } else {
      console.log("Your Move Done");
    }

    if (!gameOver) {
      const { row, col, depth } = event.target.dataset;

      if (boards[row][col][depth] === "") {
        boards[row][col][depth] = currentPlayer;
        renderBoards(); // Render boards after the human player's move
        checkWinner();

        if (!gameOver) {
          switchPlayer(); // Switch player after the human player's move

          if (currentPlayer === "O") {
            setTimeout(() => {
              makeSmartMove();
              //makeRandomMove();
              renderBoards(); // Render boards after the computer's move
              checkWinner();
              if (!gameOver) {
                switchPlayer(); // Switch player after the computer's move
              }
            }, 0);
          }
        }
      }
    }
  };

  const switchPlayer = () => {
    if (currentDiv.classList.contains(currentPlayer.toLowerCase()))
      currentDiv.classList.remove(currentPlayer.toLowerCase());
    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (currentPlayer === "X") {
      turnDiv.innerText = "Your Turn:";
    } else {
      turnDiv.innerText = "Computer's Turn:";
    }

    currentDiv.classList.add(currentPlayer.toLowerCase());
  };

  const makeRandomMove = () => {
    const emptyCells = getEmptyCells();
    if (emptyCells.length > 0) {
      const randomIndex = Math.floor(Math.random() * emptyCells.length);
      const { row, col, depth } = emptyCells[randomIndex];
      boards[row][col][depth] = "O";
    }
  };

  const makeSmartMove = () => {
    const emptyCells = getEmptyCells();

    // Choose depth based on difficulty level
    let level;

    switch (difficulty) {
      case "easy":
        level = 2;
        break;
      case "medium":
        level = 4;
        break;
      case "hard":
        level = 6;
        break;
      default:
        level = 2; // Default to medium difficulty
    }

    // Check if the player can win in the next move and block the player
    for (let i = 0; i < emptyCells.length; i++) {
      const { row, col, depth } = emptyCells[i];
      boards[row][col][depth] = "X";
      if (checkWin("X")) {
        boards[row][col][depth] = "O"; // Block the player
        return;
      }
      boards[row][col][depth] = ""; // Reset for checking other possibilities
    }

    // If no immediate threat, make a smart move using Alpha-Beta pruning
    const bestMove = alphaBetaPruning(boards, level, -Infinity, Infinity, true);
    console.log("Is best move " + bestMove);

    if (typeof bestMove === "object") {
      const { row, col, depth } = bestMove;
      console.log(row, col, depth);
      console.log(boards);
      boards[row][col][depth] = "O";
    } else {
      // Alpha-Beta pruning fails, fallback to a random move
      makeRandomMove();
    }
  };

  const alphaBetaPruning = (board, level, alpha, beta, maximizingPlayer) => {
    const emptyCells = getEmptyCells(board);

    if (level === 0 || emptyCells.length === 0) {
      // If reached the specified depth or no more empty cells, evaluate the board
      return evaluateBoard(board);
    }

    if (maximizingPlayer) {
      let maxEval = -Infinity;
      let bestMove = null;

      for (let i = 0; i < emptyCells.length; i++) {
        const { row, col, depth } = emptyCells[i];
        board[row][col][depth] = "O";

        const eval = alphaBetaPruning(board, level - 1, alpha, beta, false);

        if (eval > maxEval) {
          maxEval = eval;
          bestMove = { row, col, depth };
        }

        alpha = Math.max(alpha, eval);
        board[row][col][depth] = ""; // Undo the move

        if (beta <= alpha) {
          break; // Beta cut-off
        }
      }

      return level === 6 ? bestMove : maxEval;
    } else {
      let minEval = Infinity;

      for (let i = 0; i < emptyCells.length; i++) {
        const { row, col, depth } = emptyCells[i];
        board[row][col][depth] = "X";

        const eval = alphaBetaPruning(board, level - 1, alpha, beta, true);

        minEval = Math.min(minEval, eval);
        beta = Math.min(beta, eval);
        board[row][col][depth] = ""; // Undo the move

        if (beta <= alpha) {
          break; // Alpha cut-off
        }
      }

      return minEval;
    }
  };

  const evaluateBoard = (board) => {
    // Check if the current player wins
    if (checkWin("O", board)) {
      return 1; // Maximize for the AI player (O)
    }

    // Check if the opponent wins
    if (checkWin("X", board)) {
      return -1; // Minimize for the opponent player (X)
    }

    // If no one wins, return a neutral score
    return 0;
  };

  const getEmptyCells = () => {
    const emptyCells = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        for (let k = 0; k < 4; k++) {
          if (boards[i][j][k] === "") {
            emptyCells.push({ row: i, col: j, depth: k });
          }
        }
      }
    }
    return emptyCells;
  };

  const checkWin = (player) => {
    // Check rows
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          boards[i][j][0] === player &&
          boards[i][j][1] === player &&
          boards[i][j][2] === player &&
          boards[i][j][3] === player
        ) {
          return true;
        }
      }
    }

    // Check columns
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          boards[i][0][j] === player &&
          boards[i][1][j] === player &&
          boards[i][2][j] === player &&
          boards[i][3][j] === player
        ) {
          return true;
        }
      }
    }

    // Check depths
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          boards[0][i][j] === player &&
          boards[1][i][j] === player &&
          boards[2][i][j] === player &&
          boards[3][i][j] === player
        ) {
          return true;
        }
      }
    }

    // Check diagonals
    for (let i = 0; i < 4; i++) {
      if (
        boards[0][i][0] === player &&
        boards[1][i][1] === player &&
        boards[2][i][2] === player &&
        boards[3][i][3] === player
      ) {
        return true;
      }

      if (
        boards[0][i][3] === player &&
        boards[1][i][2] === player &&
        boards[2][i][1] === player &&
        boards[3][i][0] === player
      ) {
        return true;
      }
    }
    for (let i = 0; i < 4; i++) {
      if (
        boards[i][0][0] === player &&
        boards[i][1][1] === player &&
        boards[i][2][2] === player &&
        boards[i][3][3] === player
      ) {
        return true;
      }

      if (
        boards[i][0][3] === player &&
        boards[i][1][2] === player &&
        boards[i][2][1] === player &&
        boards[i][3][0] === player
      ) {
        return true;
      }
    }
    for (let i = 0; i < 4; i++) {
      if (
        boards[0][0][i] === player &&
        boards[1][1][i] === player &&
        boards[2][2][i] === player &&
        boards[3][3][i] === player
      ) {
        return true;
      }

      if (
        boards[0][3][i] === player &&
        boards[1][2][i] === player &&
        boards[2][1][i] === player &&
        boards[3][0][i] === player
      ) {
        return true;
      }
    }

    if (
      boards[0][0][0] === player &&
      boards[1][1][1] === player &&
      boards[2][2][2] === player &&
      boards[3][3][3] === player
    ) {
      return true;
    }
    if (
      boards[0][0][3] === player &&
      boards[1][1][2] === player &&
      boards[2][2][1] === player &&
      boards[3][3][0] === player
    ) {
      return true;
    }

    // No winning condition found
    return false;
  };

  const isBoardFull = () => {
    return boards.every((row) =>
      row.every((col) => col.every((depth) => depth !== ""))
    );
  };

  const checkWinner = () => {
    // Implementation of checkWin() remains the same as in the previous responses
    // ...
    if (checkWin("X")) {
      gameOver = true;
      messageElement.textContent = wonMessage;

      currentDiv.classList.remove("x", "o");
    } else if (checkWin("O")) {
      gameOver = true;
      messageElement.textContent = lostMessage;

      currentDiv.classList.remove("x", "o");
    } else if (getEmptyCells().length == 0) {
      gameOver = true;
      messageElement.textContent = "It's a draw!";

      currentDiv.classList.remove("x", "o");
    }
  };

  const resetGame = () => {
    currentPlayer = "X";
    gameOver = false;
    messageElement.textContent = "";
    boards.forEach((row) => row.forEach((col) => col.fill("")));
    renderBoards();
  };

  const updateDifficulty = () => {
    difficulty = difficultySelector.value;
    resetGame();
  };

  difficultySelector.addEventListener("change", updateDifficulty);
  resetButton.addEventListener("click", resetGame);

  renderBoards(); // Initial render
});

// Get the modal
var modal = document.getElementById("myModal");

// Get the button that opens the modal
var btn = document.getElementById("myBtn");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function () {
  modal.style.display = "block";
};

// When the user clicks on <span> (x), close the modal
span.onclick = function () {
  modal.style.display = "none";
};
