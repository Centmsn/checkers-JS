const boardTiles = [...document.querySelectorAll(".board__tile")];
let clockId = null;

const mainGameFunc = () => {
  // reset board
  Pieces.resetPieces();
  BoardManage.clearAvailableTiles();
  BoardManage.updateGameInfo("black");
  BoardManage.updateGameInfo("white");

  // whites moves if set to true
  Move.setTurn();

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
