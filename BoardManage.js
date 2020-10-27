class BoardManage {
  static clearAvailableTiles = () => {
    boardTiles.forEach((tile) =>
      tile.classList.remove("board__tile--available")
    );
    boardTiles.forEach((tile) =>
      tile.removeEventListener("click", Move.movePiece)
    );
  };

  static addAvailableTiles = (tiles) => {
    if (typeof tiles !== "object") {
      return;
    }

    const validatedTiles = tiles.filter((tile) => tile !== undefined);

    console.log(validatedTiles);

    validatedTiles.forEach((tile) => {
      if (tile.children.length === 0) {
        tile.classList.add("board__tile--available");
        tile.addEventListener("click", Move.movePiece);
      }
    });
  };

  static checkIfWin = () => {
    const { white, black } = Pieces.getPieces();

    if (white.pawn === 0 && white.king === 0) {
      console.log("koniec");
    } else if (black.king === 0 && black.pawn === 0) {
      console.log("koniec");
    }
  };

  static updateGameInfo = (color) => {
    const stats = document.querySelector(`.game-stats__${color}`);
    const { pawn, king } = Pieces.getPieces(color);

    const pawnCount = pawn > 0 ? `<p>Pawns: ${pawn}</p>` : "";
    const kingCount = king > 0 ? `<p>Kings: ${king}</p>` : "";

    stats.innerHTML = `${pawnCount}<br>${kingCount}`;
  };
}
