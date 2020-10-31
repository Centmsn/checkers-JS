const boardTiles = [...document.querySelectorAll(".board__tile")];
let clockId = null;

const Move = new MoveManage();
const Pieces = new PiecesManage();
const Board = new BoardManage();

const mainGameFunc = () => {
  const modal = document.querySelector(".modal");
  // reset board
  Pieces.resetPieces();
  Board.clearAvailableTiles();
  Board.updateGameInfo("black");
  Board.updateGameInfo("white");

  if (modal) {
    document.querySelector(".board").removeChild(modal);
  }
  // whites moves if set to true
  Move.setTurn();

  // add king for test
  // boardTiles.forEach((tile) => (tile.innerHTML = ""));
  // Pieces.generatePiece("white", 1, boardTiles[28], "king");
  // Pieces.generatePiece("black", 1, boardTiles[35]);
  // Pieces.generatePiece("black", 1, boardTiles[49]);
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

document
  .querySelector(".game-stats__button")
  .addEventListener("click", mainGameFunc);
