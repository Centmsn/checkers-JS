const boardTiles = [...document.querySelectorAll(".board__tile")];
let turnFlag = true;

const changeTurn = () => {
  const showTurn = document.querySelector(".game-stats__text");

  showTurn.textContent = turnFlag ? "Black's turn" : "White's turn";
  turnFlag = !turnFlag;
};

// const setClock = () => {
//   const clock = document.querySelector(".game-stats__clock");
//   time = 0;

//   const clockId = setInterval(() => {
//     time++;
//     clock.textContent = time;
//   }, 1000);
// };

checkIfCapture = () => {
  // all white pawns
  const whitePawns = [...document.querySelectorAll(".pawn--white")];

  // tiles taken by white pawns
  const takenTiles = whitePawns.map((pawn) => pawn.parentNode.dataset.key);

  // object with pawns that can capture
  const pawns = {};

  for (let i = 0; i < takenTiles.length; i++) {
    const leftTile = boardTiles[takenTiles[i] - 10];
    const rightTile = boardTiles[takenTiles[i] - 8];

    // check left tile behind the black pawn
    if (leftTile.firstChild) {
      if (leftTile.firstChild.classList.contains("pawn--black")) {
        if (boardTiles[leftTile.dataset.key - 10].children.length !== 0) {
        } else {
          // add pawns to object
          pawns[whitePawns[i].parentNode.dataset.key] = [
            boardTiles[leftTile.dataset.key - 10],
          ];
        }
      }
    }

    // checkk right tile behind the black pawn
    if (rightTile.firstChild) {
      if (rightTile.firstChild.classList.contains("pawn--black")) {
        if (boardTiles[rightTile.dataset.key - 8].children.length !== 0) {
        } else {
          // add pawns to object
          pawns[whitePawns[i].parentNode.dataset.key] = [
            boardTiles[rightTile.dataset.key - 8],
          ];
        }
      }
    }
  }

  /*
return object pawns = {
    41: {
        left: 24,
        right: 24
      }
    }
  */
  return pawns;
};

class PiecesManage {
  static resetPieces = () => {
    boardTiles.forEach((tile) => {
      tile.innerHTML = "";
      BoardManage.clearAvailableTiles();
    });
    // generate starting pawns
    this.generatePawns("black", 12);
    this.generatePawns("white", 12);
  };

  static clearActivePawn = () => {
    document
      .querySelectorAll(".pawn--black, .pawn--white")
      .forEach((pawn) => pawn.classList.remove("pawn--active"));
  };

  // generate pawns and append them to DOM
  static generatePawns = (color, amount, tile) => {
    for (let i = 0; i < amount; i++) {
      const pawn = document.createElement("div");
      pawn.classList.add("pawn", `pawn--${color}`);

      pawn.addEventListener("click", showPossibleMoves);

      if (tile) {
        // generate 1 pawn and append
        tile.appendChild(pawn);
      } else {
        // default - reset game
        this.getStartingPosition(color)[i].appendChild(pawn);
      }
    }
  };

  // starting position for pawns
  static getStartingPosition = (color) => {
    if (color === "white") {
      return boardTiles
        .slice(40)
        .filter((tile) => tile.classList.contains(`board__tile--black`));
    } else {
      return boardTiles
        .slice(0, 24)
        .filter((tile) => tile.classList.contains(`board__tile--black`));
    }
  };
}

class BoardManage {
  static clearAvailableTiles = () => {
    boardTiles.forEach((tile) =>
      tile.classList.remove("board__tile--available")
    );
    boardTiles.forEach((tile) =>
      tile.removeEventListener("click", MoveManage.movePawn)
    );
  };

  static addAvailableTiles = (tiles) => {
    tiles.forEach((tile) =>
      tile.children.length === 0
        ? tile.classList.add("board__tile--available")
        : null
    );
    tiles.forEach((tile) =>
      tile.children.length === 0
        ? tile.addEventListener("click", MoveManage.movePawn)
        : null
    );
  };
}

class MoveManage {
  static movePawn = (e) => {
    const currentTile = document.querySelector(".pawn--active");
    const color = currentTile.classList.contains("pawn--black")
      ? "black"
      : "white";

    PiecesManage.generatePawns(color, 1, e.target);
    currentTile.parentNode.innerHTML = "";

    BoardManage.clearAvailableTiles();
    changeTurn();
  };
}

const showPossibleMoves = (e) => {
  BoardManage.clearAvailableTiles();
  PiecesManage.clearActivePawn();

  if (e.target.classList.contains("pawn--white")) {
    if (turnFlag) {
      //   check if capture is available
      if (Object.keys(checkIfCapture()).length > 0) {
        e.target.classList.add("pawn--active");
        const data = checkIfCapture();

        const currentPawn = document.querySelector(".pawn--active").parentNode
          .dataset.key;

        BoardManage.addAvailableTiles(data[currentPawn]);
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
    }
  } else {
    if (!turnFlag) {
      //   show possible moves
      const filteredTiles = boardTiles.filter(
        (tile) =>
          tile.dataset.key > e.target.parentNode.dataset.key &&
          tile.dataset.key - e.target.parentNode.dataset.key > 6 &&
          tile.dataset.key - e.target.parentNode.dataset.key < 10 &&
          tile.classList.contains("board__tile--black")
      );

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
  //   setClock();

  turnFlag = true; // whites moves if set to true
};

const startBtn = document.querySelector(".game-stats__button");
startBtn.addEventListener("click", mainGameFunc);
