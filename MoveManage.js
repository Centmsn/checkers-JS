class MoveManage {
  constructor() {
    this._capture = false;
    // white's move if true
    this._move = true;
  }

  setCapture = () => {
    this.capture = true;
  };

  removeCapture = () => {
    this.capture = false;
  };

  getTurn = () => {
    return this.move;
  };

  setTurn = () => {
    this.move = !this.move;
    BoardManage.checkIfWin();

    const info = document.querySelector(".game-stats__turn");

    info.textContent = this.move ? "White's turn" : "Black's turn";
  };

  movePawn = (e) => {
    const currentTile = document.querySelector(".pawn--active");
    const color = currentTile.classList.contains("pawn--black")
      ? "black"
      : "white";

    if (this.capture) {
      this.capturePawn(
        currentTile.parentNode.dataset.key,
        document.querySelector(".board__tile--available").dataset.key,
        color
      );

      Pieces.generatePawns(color, 1, e.target);
      currentTile.parentNode.innerHTML = "";

      BoardManage.clearAvailableTiles();

      if (Object.keys(checkIfCapture(color)).length > 0) {
        checkIfCapture(color);
        this.setCapture();
      } else {
        Move.setTurn();
      }
    } else {
      Pieces.generatePawns(color, 1, e.target);
      currentTile.parentNode.innerHTML = "";

      BoardManage.clearAvailableTiles();
      Move.setTurn();
    }

    // check if pawn should be promoted to king
    Pieces.checkIfKing();
    BoardManage.updateGameInfo(color);
  };

  capturePawn = (current, available, color) => {
    let capturedPawn = 0;

    if (color === "white") {
      capturedPawn = current - (current - available) / 2;
    } else {
      capturedPawn = parseInt(available) - (available - current) / 2;
    }
    boardTiles[capturedPawn].innerHTML = "";

    this.removeCapture();
    Pieces.removePiece(color, "pawn");
  };
}
