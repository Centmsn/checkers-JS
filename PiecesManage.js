class PiecesManage {
  constructor() {
    // number of pawns on the board
    this._whitePawns = 12;
    this._blackPawns = 12;

    // number of kings on the board
    this._whiteKings = 0;
    this._blackKings = 0;
  }
  // reset pieces to starting position
  resetPieces = () => {
    this._whitePawns = 12;
    this._blackPawns = 12;
    this._whiteKings = 0;
    this._blackKings = 0;

    boardTiles.forEach((tile) => {
      tile.innerHTML = "";
      BoardManage.clearAvailableTiles();
    });
    // generate starting pawns
    this.generatePawns("black", 12);
    this.generatePawns("white", 12);
  };

  clearActivePawn = () => {
    document
      .querySelectorAll(".pawn--black, .pawn--white")
      .forEach((pawn) => pawn.classList.remove("pawn--active"));
  };

  // generate pawns and append them to DOM
  generatePawns = (color, amount, tile) => {
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
  getStartingPosition = (color) => {
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

  checkIfKing = () => {
    boardTiles.forEach((tile) => {
      if (
        tile.firstChild?.classList.contains("pawn--black") &&
        tile.dataset.key >= 56
      ) {
        tile.firstChild.classList.add("king", "king--black");
      } else if (
        tile.firstChild?.classList.contains("pawn--white") &&
        tile.dataset.key <= 7
      ) {
        tile.firstChild?.classList.add("king", "king--white");
      }
    });
  };
}
