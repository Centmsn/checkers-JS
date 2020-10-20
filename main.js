const boardTiles = [...document.querySelectorAll(".board__tile")];

checkIfCapture = (color) => {
  const pawns = [...document.querySelectorAll(`.pawn--${color}`)];
  // object with pawns that can capture
  const availablePawns = {};

  const amountLeft = color === "white" ? 9 : -9;
  const amountRight = color === "white" ? 7 : -7;
  const oppositeColor = color === "white" ? "black" : "white";

  const takenTiles = pawns.map((pawn) => pawn.parentNode.dataset.key);

  for (let i = 0; i < takenTiles.length; i++) {
    const leftTile = boardTiles[takenTiles[i] - amountLeft];
    const rightTile = boardTiles[takenTiles[i] - amountRight];

    if (typeof leftTile !== "object" || typeof rightTile !== "object") {
      continue;
    }

    if (
      boardTiles[leftTile.dataset.key - amountLeft] === undefined ||
      boardTiles[leftTile.dataset.key - amountLeft] === undefined ||
      boardTiles[rightTile.dataset.key - amountRight] === undefined ||
      boardTiles[rightTile.dataset.key - amountRight] === undefined
    ) {
      continue;
    }
    if (leftTile.firstChild) {
      // leftTile && rightTile may exceed numbers of tiles (0-63) if they are on the top or on the bottom of the board
      if (
        leftTile.firstChild.classList.contains(`pawn--${oppositeColor}`) &&
        leftTile.classList.contains(`board__tile--black`)
      ) {
        if (
          boardTiles[leftTile.dataset.key - amountLeft].children.length !== 0 ||
          boardTiles[leftTile.dataset.key - amountLeft].classList.contains(
            "board__tile--white"
          )
        ) {
        } else {
          // add pawns to object
          availablePawns[pawns[i].parentNode.dataset.key] = [
            boardTiles[leftTile.dataset.key - amountLeft],
          ];
        }
      }
    }

    // checkk right tile behind the pawn
    if (rightTile.firstChild) {
      if (
        rightTile.firstChild.classList.contains(`pawn--${oppositeColor}`) &&
        rightTile.classList.contains(`board__tile--black`)
      ) {
        if (
          boardTiles[rightTile.dataset.key - amountRight].children.length !==
            0 ||
          boardTiles[rightTile.dataset.key - amountRight].classList.contains(
            "board__tile--white"
          )
        ) {
        } else {
          // add pawns to object
          availablePawns[pawns[i].parentNode.dataset.key] = [
            boardTiles[rightTile.dataset.key - amountRight],
          ];
        }
      }
    }
  }
  return availablePawns;
};

// logic for possible moves
const showPossibleMoves = (e) => {
  BoardManage.clearAvailableTiles();
  Pieces.clearActivePawn();

  const color = e.target.classList.contains("pawn--white") ? "white" : "black";

  const possibleTiles = [
    boardTiles[
      parseInt(e.target.parentNode.dataset.key) - (color === "white" ? 7 : -7)
    ].dataset.key,
    boardTiles[
      parseInt(e.target.parentNode.dataset.key) - (color === "white" ? 9 : -9)
    ].dataset.key,
  ];

  if (
    (color === "white" && Move.getTurn()) ||
    (color === "black" && !Move.getTurn())
  ) {
    //   check if capture is available
    if (Object.keys(checkIfCapture(color)).length > 0) {
      e.target.classList.add("pawn--active");
      const data = checkIfCapture(color);

      const currentPawn = document.querySelector(".pawn--active").parentNode
        .dataset.key;

      Move.setCapture();
      BoardManage.addAvailableTiles(data[currentPawn]);
      return;
    } else {
      //   if no capture available
      const filteredTiles = boardTiles.filter((tile) => {
        return (
          (tile.dataset.key == possibleTiles[0] &&
            tile.children.length === 0 &&
            tile.classList.contains("board__tile--black")) ||
          (tile.dataset.key == possibleTiles[1] &&
            tile.children.length === 0 &&
            tile.classList.contains("board__tile--black"))
        );
      });

      //   check if available square are free
      BoardManage.addAvailableTiles(filteredTiles);
      e.target.classList.add("pawn--active");
    }
  }
};

const mainGameFunc = () => {
  // reset board
  Pieces.resetPieces();
  BoardManage.clearAvailableTiles();

  // whites moves if set to true
  Move.setTurn();

  document.querySelector(".game-stats__text").textContent = Move.getTurn()
    ? "White's turn"
    : "Black's turn";
};

const startBtn = document.querySelector(".game-stats__button");
startBtn.addEventListener("click", mainGameFunc);

const Move = new MoveManage();
const Pieces = new PiecesManage();
