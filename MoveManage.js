class MoveManage {
  constructor() {
    this._capture = false;
    this._move = true;
  }

  setCapture = () => {
    this.capture = !this.capture;
  };

  getTurn = () => {
    return this.move;
  };

  setTurn = () => {
    this.move = !this.move;
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
    }

    PiecesManage.generatePawns(color, 1, e.target);
    currentTile.parentNode.innerHTML = "";

    BoardManage.clearAvailableTiles();
    Move.setTurn();
  };

  capturePawn = (current, available, color) => {
    let capturedPawn = 0;

    if (color === "white") {
      capturedPawn = current - (current - available) / 2;
    } else {
      capturedPawn = parseInt(available) - (available - current) / 2;
    }

    console.log(capturedPawn);
    boardTiles[capturedPawn].innerHTML = "";

    this.setCapture();
  };
}
