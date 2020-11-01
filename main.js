const boardTiles = [...document.querySelectorAll(".board__tile")];
const startBtn = document.querySelector(".game-stats__button");
let clockId = null;
let throttle = true;

const Move = new MoveManage();
const Pieces = new PiecesManage();
const Board = new BoardManage();

const mainGameFunc = () => {
  if (!throttle) return;

  const modal = document.querySelector(".modal");

  if (modal) {
    modal.classList.add("modal--invisible");
    setTimeout(() => document.querySelector(".board").removeChild(modal), 300);
  }
  throttle = false;

  Board.handleCurtain();

  // reset board
  setTimeout(() => {
    Pieces.resetPieces();
    Board.clearAvailableTiles();
    Board.updateGameInfo("black");
    Board.updateGameInfo("white");
    Board.handleHighlightTiles(true);
    Move.setTurn();
  }, 500);

  // add king for test
  // setTimeout(() => {
  //   boardTiles.forEach((tile) => (tile.innerHTML = ""));
  //   Pieces.generatePiece("white", 1, boardTiles[60], "king");
  //   Pieces.generatePiece("black", 1, boardTiles[35]);
  //   Pieces.generatePiece("black", 1, boardTiles[42]);
  //   Pieces.generatePiece("black", 1, boardTiles[37]);
  //   Pieces.generatePiece("black", 1, boardTiles[53]);
  //   Pieces.generatePiece("black", 1, boardTiles[51]);
  // }, 700);

  // Pieces.generatePiece("black", 1, boardTiles[51]);
  // Pieces.generatePiece("white", 1, boardTiles[23]);

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

startBtn.addEventListener("click", mainGameFunc);

document.addEventListener("DOMContentLoaded", () => {
  const curtainLeft = Board.createModal(
    "curtain",
    "curtain--left",
    "curtain--open"
  );
  const curtainRight = Board.createModal(
    "curtain",
    "curtain--right",
    "curtain--open"
  );

  const gameBoard = document.querySelector(".board");

  gameBoard.appendChild(curtainLeft);
  gameBoard.appendChild(curtainRight);
});
