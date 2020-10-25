class BoardManage {
  static clearAvailableTiles = () => {
    boardTiles.forEach((tile) =>
      tile.classList.remove("board__tile--available")
    );
    boardTiles.forEach((tile) =>
      tile.removeEventListener("click", Move.movePawn)
    );
  };

  static addAvailableTiles = (tiles) => {
    if (typeof tiles !== "object") {
      throw new Error("Incorrent argument type");
    }

    tiles.forEach((tile) =>
      tile.children.length === 0
        ? tile.classList.add("board__tile--available")
        : null
    );
    tiles.forEach((tile) =>
      tile.children.length === 0
        ? tile.addEventListener("click", Move.movePawn)
        : null
    );
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
    const pieces = Pieces.getPieces(color);

    stats.textContent = `Pawns: ${pieces.pawn} Kings: ${pieces.king}`;
  };
}
