class PiecesManage {
  // reset pieces to starting position
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
