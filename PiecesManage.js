class PiecesManage {
  constructor() {
    // number of pawns on the board
    this._whitePawns = 12;
    this._blackPawns = 12;

    // number of kings on the board
    this._whiteKings = 0;
    this._blackKings = 0;

    // pieces which can be captured
    this._possibleCaptures = [];
  }

  setPossibleCapture = (object) => {
    if (typeof object !== "object") {
      throw new Error("Incorrect argument - object required");
    }
    this._possibleCaptures = object;
  };

  getPossibleCapture = () => {
    return this._possibleCaptures;
  };

  getPieces = (color = "all") => {
    const white = { king: this._whiteKings, pawn: this._whitePawns };
    const black = { king: this._blackKings, pawn: this._blackPawns };

    switch (color) {
      case "white":
        return white;
      case "black":
        return black;
      case "all":
        return {
          white,
          black,
        };
    }
  };

  // remove piece from stats
  removePiece = (color, type) => {
    if (color === "black") {
      type === "pawn" ? this._blackPawns-- : this._blackKings--;
    } else {
      type === "pawn" ? this._whitePawns-- : this._whiteKings--;
    }
  };

  // add king to king count
  addKing = (color) => {
    switch (color) {
      case "black":
        this._blackKings++;
        break;

      case "white":
        this._whiteKings++;
        break;

      default:
        throw new Error("Incorrect type of argument. Use 'white' or 'black'");
    }
  };

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
    this.generatePiece("black", 12);
    this.generatePiece("white", 12);
  };

  // removes active class from all pieces
  clearActivePiece = () => {
    document
      .querySelectorAll(".pawn--black, .pawn--white, .king")
      .forEach((piece) =>
        piece.classList.remove("pawn--active", "king--active")
      );
  };

  // generate piece and append them to DOM
  // if no tile is passed - reset game
  generatePiece = (color, amount, tile, type = "pawn") => {
    for (let i = 0; i < amount; i++) {
      const piece = document.createElement("div");
      piece.classList.add(`${type}`, `${type}--${color}`);
      piece.addEventListener("click", Move.showPossibleMoves);

      if (tile) {
        // generate 1 pawn and append
        tile.appendChild(piece);
      } else {
        // default - reset game
        this.getStartingPosition(color)[i].appendChild(piece);
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

  // promotes pawn to king and manages classes
  checkIfKing = () => {
    boardTiles.forEach((tile) => {
      if (
        tile.firstChild?.classList.contains("pawn--black") &&
        tile.dataset.key >= 56
      ) {
        if (!tile.firstChild.classList.contains("king")) {
          tile.innerHTML = "";
          this.addKing("black");
          this.removePiece("black", "pawn");
          this.generatePiece("black", 1, tile, "king");
        }
      } else if (
        tile.firstChild?.classList.contains("pawn--white") &&
        tile.dataset.key <= 7
      ) {
        if (!tile.firstChild.classList.contains("king")) {
          tile.innerHTML = "";
          this.addKing("white");
          this.removePiece("white", "pawn");
          this.generatePiece("white", 1, tile, "king");
        }
      }
    });
  };
}
