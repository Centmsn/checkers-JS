class BoardManage {
  constructor() {
    this._recentlyMoved = { prev: null, current: null };
  }

  setRecentlyMoved = (prev, current) => {
    this._recentlyMoved = { prev, current };
  };

  getRecentlyMoved = () => {
    return this._recentlyMoved;
  };

  clearAvailableTiles = () => {
    boardTiles.forEach((tile) =>
      tile.classList.remove("board__tile--available")
    );
    boardTiles.forEach((tile) =>
      tile.removeEventListener("click", Move.movePiece)
    );
  };

  handleHighlightTiles = (clear = false) => {
    const { prev, current } = this.getRecentlyMoved();

    if (!prev || !current) return;

    if (clear) {
      prev.classList.remove("board__tile--previous");
      current.classList.remove("board__tile--current");
    } else {
      prev.classList.add("board__tile--previous");
      current.classList.add("board__tile--current");
    }
  };

  addAvailableTiles = (tiles) => {
    if (typeof tiles !== "object") {
      return;
    }

    // validate if tile is not undefined and black
    const validatedTiles = tiles.filter(
      (tile) =>
        tile !== undefined && tile.classList.contains("board__tile--black")
    );

    validatedTiles.forEach((tile) => {
      if (tile.children.length === 0) {
        tile.classList.add("board__tile--available");
        tile.addEventListener("click", Move.movePiece);
      }
    });
  };

  checkIfWin = () => {
    const { white, black } = Pieces.getPieces();

    if (white.pawn === 0 && white.king === 0) {
      this.endGame("black");
    } else if (black.king === 0 && black.pawn === 0) {
      this.endGame("white");
    }
  };

  updateGameInfo = (color) => {
    const stats = document.querySelector(`.game-stats__${color}`);
    const { pawn, king } = Pieces.getPieces(color);

    const pawnCount = pawn > 0 ? `<p>Pawns: ${pawn}</p>` : "";
    const kingCount = king > 0 ? `<p>Kings: ${king}</p>` : "";

    stats.innerHTML = `${pawnCount}<br>${kingCount}`;
  };

  endGame = (color) => {
    const button = document.querySelector(".game-stats__button");
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const info = document.createElement("p");

    if (color === "white") {
      info.textContent = "White is victorious!";
    } else {
      info.textContent = "Black is victorious!";
    }

    modal.appendChild(info);
    document.querySelector(".board").appendChild(modal);

    document
      .querySelectorAll(".pawn", ".king")
      .forEach((piece) =>
        piece.removeEventListener("click", Move.showPossibleMoves)
      );

    clearInterval(clockId);
    button.classList.add("game-stats__button--flash");

    setTimeout(() => {
      button.classList.remove("game-stats__button--flash");
    }, 2000);
  };
}
