const boardTiles = [...document.querySelectorAll(".board__tile")];

checkIfCapture = (color) => {
  // all white pawns
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

    // check left tile behind the black pawn
    if (leftTile.firstChild) {
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
  PiecesManage.clearActivePawn();

  // white's move
  if (e.target.classList.contains("pawn--white") && Move.getTurn()) {
    //   check if capture is available
    if (Object.keys(checkIfCapture("white")).length > 0) {
      const data = checkIfCapture("white");
      const keys = Object.keys(data);

      if (!keys.includes(e.target.parentNode.dataset.key)) {
        return;
      } else {
        e.target.classList.add("pawn--active");
        const currentPawn = document.querySelector(".pawn--active").parentNode
          .dataset.key;

        Move.setCapture();
        BoardManage.addAvailableTiles(data[currentPawn]);
        return;
      }
    } else {
      //   if no capture available
      const filteredTiles = boardTiles.filter(
        (tile) =>
          tile.dataset.key < e.target.parentNode.dataset.key &&
          e.target.parentNode.dataset.key - tile.dataset.key > 6 &&
          e.target.parentNode.dataset.key - tile.dataset.key < 10 &&
          tile.classList.contains("board__tile--black")
      );

      //   check if available square are free
      BoardManage.addAvailableTiles(filteredTiles);
      e.target.classList.add("pawn--active");
    }

    // black's move
  } else if (e.target.classList.contains("pawn--black") && !Move.getTurn()) {
    //   check if capture is available
    if (Object.keys(checkIfCapture("black")).length > 0) {
      e.target.classList.add("pawn--active");
      const data = checkIfCapture("black");

      const currentPawn = document.querySelector(".pawn--active").parentNode
        .dataset.key;

      Move.setCapture();
      BoardManage.addAvailableTiles(data[currentPawn]);
      return;
    } else {
      //   if no capture available
      const filteredTiles = boardTiles.filter((tile) => {
        const possibleTiles = [
          boardTiles[parseInt(e.target.parentNode.dataset.key) + 7].dataset.key,
          boardTiles[parseInt(e.target.parentNode.dataset.key) + 9].dataset.key,
        ];

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
  PiecesManage.resetPieces();
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
