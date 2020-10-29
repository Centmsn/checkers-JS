const boardTiles = [...document.querySelectorAll(".board__tile")];
let clockId = null;

const mainGameFunc = () => {
  const modal = document.querySelector(".modal");
  // reset board
  Pieces.resetPieces();
  BoardManage.clearAvailableTiles();
  BoardManage.updateGameInfo("black");
  BoardManage.updateGameInfo("white");

  if (modal) {
    document.querySelector(".board").removeChild(modal);
  }
  // whites moves if set to true
  Move.setTurn();

  // add king for test
  // boardTiles.forEach((tile) => (tile.innerHTML = ""));
  // Pieces.generatePiece("white", 1, boardTiles[28]);
  // Pieces.generatePiece("white", 1, boardTiles[26]);
  // Pieces.generatePiece("black", 1, boardTiles[17]);
  // Pieces.generatePiece("black", 1, boardTiles[53]);
  // Pieces.generatePiece("black", 1, boardTiles[49]);
  // Pieces.generatePiece("black", 1, boardTiles[21]);
  // REMOVE BEFORE PLAYING

  // start the clock
  const clock = document.querySelector(".game-stats__clock");

  clock.textContent = "00:00";
  let seconds = 0;
  let minutes = 0;

  if (clockId) {
    clearInterval(clockId);
  }

  clockId = setInterval(() => {
    seconds++;
    if (seconds === 60) {
      minutes++;
      seconds = 0;
    }

    clock.textContent = `${minutes < 10 ? `0${minutes}` : minutes}:${
      seconds < 10 ? `0${seconds}` : seconds
    }`;
  }, 1000);
};

const startBtn = document.querySelector(".game-stats__button");
startBtn.addEventListener("click", mainGameFunc);

const Move = new MoveManage();
const Pieces = new PiecesManage();

// development function to add available class
const addFlash = (num) => {
  const piece = document.querySelectorAll(".board__tile")[num].firstChild;

  const type = piece.classList.contains("pawn") ? "pawn" : "king";

  piece.classList.remove(`${type}--available`);
  piece.classList.add(`${type}--available`);
};
