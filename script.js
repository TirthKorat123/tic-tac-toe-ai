const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const aiWinMessages = [
  "AI Bot says: Better luck next time, human 🤖😂",
  "Outsmarted by a bunch of code! 🧑‍💻🤯",
  "AI Bot just flexed on you 💪🤖",
  "Guess who needs more practice? (Hint: not the AI) 😉",
];

// Pick a random message
function getRandomAIMessage() {
  return aiWinMessages[Math.floor(Math.random() * aiWinMessages.length)];
}

let currentPlayer = "X";
let board = ["", "", "", "", "", "", "", "", ""];
let result = document.getElementById("result");
let choices = document.querySelectorAll(".box");
let gameActive = true;

document.getElementById("restartBtn").addEventListener("click", restartGame);

const aiAgent = () => {
  if (!gameActive) return;

  let bestScore = -Infinity;
  let move = null;

  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = "O"; // AI tries move
      let score = minimax(board, 0, false);
      board[i] = ""; // undo
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== null) {
    board[move] = "O";
    document.getElementById(move).innerText = "O";
    console.log(`AI chooses box = ${move}`);
    moveNextCheck();
  }
};

choices.forEach((choice) => {
  choice.addEventListener("click", () => {
    let index = choice.getAttribute("id");
    handleClick(index);
  });
});

const handleClick = (index) => {
  if (board[index] == "" && gameActive && currentPlayer == "X") {
    board[index] = currentPlayer;
    document.getElementById(index).innerText = currentPlayer;
    console.log(`Selected box = ${index}`);
    moveNextCheck();
    if (gameActive) {
      setTimeout(aiAgent, 500);
    }
  } else {
    console.log("Already Selected");
  }
};

const switchPlayer = () => {
  currentPlayer = currentPlayer == "X" ? "O" : "X";
};

const moveNextCheck = () => {
  if (checkWin()) {
    if (currentPlayer === "O") {
      result.innerText = getRandomAIMessage(); // AI win random msg
    } else {
      result.innerText = `Player ${currentPlayer} Wins!!`; // You can also make array for human
    }
    gameActive = false;
  } else if (!board.includes("")) {
    result.innerText = "It's a draw!";
    result.style.color = "orange";
    gameActive = false;
  } else {
    switchPlayer();                       
    // if (currentPlayer == "X") {
    //   document.querySelector("body").style.backgroundColor = "orange";
    // } else {
    //   document.querySelector("body").style.backgroundColor = "yellow";
    // }
  }
};

function restartGame() {
  for (let i = 0; i < 9; i++) {
    board[i] = "";
    choices[i].textContent = "";
    document.getElementById(i).style.backgroundColor = "#4caf50";
  }
  currentPlayer = "X";
  gameActive = true;
  result.innerText = "";
}

function checkWinner(testBoard, player) {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    return (
      testBoard[a] === player &&
      testBoard[b] === player &&
      testBoard[c] === player
    );
  });
}

function checkWin() {
  return winPatterns.some((pattern) => {
    const [a, b, c] = pattern;
    let rs =
      board[a] && board[a] === board[b] && board[a] === board[c];
    if (rs == true) {
      document.getElementById(a).style.backgroundColor = "green";
      document.getElementById(b).style.backgroundColor = "green";
      document.getElementById(c).style.backgroundColor = "green";
    }
    return rs;
  });
}

function minimax(newBoard, depth, isMaximizing) {
  if (checkWinner(newBoard, "O")) return 10 - depth;
  if (checkWinner(newBoard, "X")) return depth - 10;
  if (!newBoard.includes("")) return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "O";
        let score = minimax(newBoard, depth + 1, false);
        newBoard[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < newBoard.length; i++) {
      if (newBoard[i] === "") {
        newBoard[i] = "X";
        let score = minimax(newBoard, depth + 1, true);
        newBoard[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
}
