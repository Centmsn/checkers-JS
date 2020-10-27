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

  movePiece = (e) => {
    const type = document.querySelector(".king--active") ? "king" : "pawn";

    const currentTile = document.querySelector(`.${type}--active`);
    const color = currentTile.classList.contains(`${type}--black`)
      ? "black"
      : "white";

    if (this.capture) {
      this.capturePawn(
        currentTile.parentNode.dataset.key,
        document.querySelector(".board__tile--available").dataset.key,
        color
      );

      Pieces.generatePiece(color, 1, e.target, type);
      currentTile.parentNode.innerHTML = "";

      BoardManage.clearAvailableTiles();

      if (Object.keys(this.checkIfCapture(color)).length > 0) {
        this.checkIfCapture(color);
        this.setCapture();
      } else {
        Move.setTurn();
      }
    } else {
      Pieces.generatePiece(color, 1, e.target, type);
      currentTile.parentNode.innerHTML = "";

      BoardManage.clearAvailableTiles();
      Move.setTurn();
    }

    // check if pawn should be promoted to king
    Pieces.checkIfKing();
    BoardManage.updateGameInfo("black");
    BoardManage.updateGameInfo("white");
  };

  capturePawn = (current, available, color) => {
    let capturedPawn = 0;

    if (color === "white") {
      capturedPawn = current - (current - available) / 2;
      Pieces.removePiece("black", "pawn");
    } else {
      capturedPawn = parseInt(available) - (available - current) / 2;
      Pieces.removePiece("white", "pawn");
    }
    boardTiles[capturedPawn].innerHTML = "";

    this.removeCapture();
  };

  // possibleMoves for pawns
  showPossibleMoves = (e) => {
    BoardManage.clearAvailableTiles();
    Pieces.clearActivePiece();

    const color = e.target.classList.contains("pawn--white")
      ? "white"
      : "black";

    const possibleTiles = [
      boardTiles[
        parseInt(e.target.parentNode.dataset.key) - (color === "white" ? 7 : -7)
      ].dataset.key,
      boardTiles[
        parseInt(e.target.parentNode.dataset.key) - (color === "white" ? 9 : -9)
      ].dataset.key,
    ];

    if (
      (color === "white" && this.getTurn()) ||
      (color === "black" && !this.getTurn())
    ) {
      //   check if capture is available
      if (Object.keys(this.checkIfCapture(color)).length > 0) {
        e.target.classList.add("pawn--active");
        const data = this.checkIfCapture(color);

        const currentPawn = document.querySelector(".pawn--active").parentNode
          .dataset.key;

        this.setCapture();
        BoardManage.addAvailableTiles(data[currentPawn]);
        return;
      } else {
        //   if no capture available
        const filteredTiles = boardTiles.filter((tile) => {
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

  checkIfCapture = (color) => {
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

      if (typeof leftTile !== "object" || typeof rightTile !== "object") {
        continue;
      }

      if (
        !boardTiles[leftTile.dataset.key - amountLeft] ||
        !boardTiles[leftTile.dataset.key - amountLeft] ||
        !boardTiles[rightTile.dataset.key - amountRight] ||
        !boardTiles[rightTile.dataset.key - amountRight]
      ) {
        continue;
      }
      if (leftTile.firstChild) {
        if (
          leftTile.firstChild.classList.contains(`pawn--${oppositeColor}`) &&
          leftTile.classList.contains(`board__tile--black`)
        ) {
          if (
            boardTiles[leftTile.dataset.key - amountLeft].children.length !==
              0 ||
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
  // function to move the king
  // in developement
  showKingMoves = (e) => {
    BoardManage.clearAvailableTiles();
    Pieces.clearActivePiece();
    const color = e.target.classList.contains("king--white")
      ? "white"
      : "black";

    const possibleMoves = [
      boardTiles[parseInt(e.target.parentNode.dataset.key) - 7],
      boardTiles[parseInt(e.target.parentNode.dataset.key) + 7],
      boardTiles[parseInt(e.target.parentNode.dataset.key) - 9],
      boardTiles[parseInt(e.target.parentNode.dataset.key) + 9],
    ];

    console.log(possibleMoves);

    if (
      (color === "white" && this.getTurn()) ||
      (color === "black" && !this.getTurn())
    ) {
      if (Object.keys(this.checkIfCapture(color)).length > 0) {
        return;
      } else {
        BoardManage.addAvailableTiles(possibleMoves);
        e.target.classList.add("king--active");
      }
    }
  };
}
