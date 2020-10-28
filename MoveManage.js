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
      this.capturePiece(currentTile.parentNode.dataset.key, e.target);

      Pieces.generatePiece(color, 1, e.target, type);
      currentTile.parentNode.innerHTML = "";

      BoardManage.clearAvailableTiles();
      // ! jeśli bicie ma inny pion niż bił przed chwilą nie zmienia tury
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

  capturePiece = (current, target) => {
    const possibleMoves = Pieces.getPossibleCapture();
    const targetKey = parseInt(target.dataset.key);

    if (possibleMoves.includes(boardTiles[targetKey - 7])) {
      boardTiles[targetKey - 7].innerHTML = "";
    } else if (possibleMoves.includes(boardTiles[targetKey - 9])) {
      boardTiles[targetKey - 9].innerHTML = "";
    } else if (possibleMoves.includes(boardTiles[parseInt(targetKey) + 7])) {
      boardTiles[targetKey + 7].innerHTML = "";
    } else if (possibleMoves.includes(boardTiles[parseInt(targetKey) + 9])) {
      boardTiles[targetKey + 9].innerHTML = "";
    }

    this.removeCapture();
  };

  // possibleMoves for pawns
  showPossibleMoves = (e) => {
    BoardManage.clearAvailableTiles();
    Pieces.clearActivePiece();

    const color = e.target.classList.contains("pawn--white")
      ? "white"
      : "black";

    const possibleTiles = [];
    // test part
    // -------------------------------------
    if (
      boardTiles[
        parseInt(e.target.parentNode.dataset.key) - (color === "white" ? 7 : -7)
      ]
    ) {
      possibleTiles.push(
        boardTiles[
          parseInt(e.target.parentNode.dataset.key) -
            (color === "white" ? 7 : -7)
        ].dataset.key
      );
    }

    if (
      boardTiles[
        parseInt(e.target.parentNode.dataset.key) - (color === "white" ? 9 : -9)
      ]
    ) {
      possibleTiles.push(
        boardTiles[
          parseInt(e.target.parentNode.dataset.key) -
            (color === "white" ? 9 : -9)
        ].dataset.key
      );
    }
    // -------------------------------------------------
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
              tile.children.length === 0) ||
            (tile.dataset.key == possibleTiles[1] && tile.children.length === 0)
          );
        });

        //   check if available square are free
        BoardManage.addAvailableTiles(filteredTiles);
        e.target.classList.add("pawn--active");
      }
    }
  };

  checkIfCapture = (color) => {
    const pieces = [
      ...document.querySelectorAll(`.pawn--${color}`),
      ...document.querySelectorAll(`.king--${color}`),
    ];

    // object with pawns that can capture
    const availablePawns = {};
    const pawnsToCapture = {};

    const amountLeft = color === "white" ? 9 : -9;
    const amountRight = color === "white" ? 7 : -7;
    const oppositeColor = color === "white" ? "black" : "white";

    const takenTiles = pieces.map((piece) => piece.parentNode.dataset.key);

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
          (leftTile.firstChild.classList.contains(`pawn--${oppositeColor}`) &&
            leftTile.classList.contains(`board__tile--black`)) ||
          (leftTile.firstChild.classList.contains(`king--${oppositeColor}`) &&
            leftTile.classList.contains(`board__tile--black`))
        ) {
          if (
            boardTiles[leftTile.dataset.key - amountLeft].children.length !==
              0 ||
            boardTiles[leftTile.dataset.key - amountLeft].classList.contains(
              "board__tile--white"
            )
          ) {
          } else {
            pawnsToCapture[pieces[i].parentNode.dataset.key] = [leftTile];
            // add pawns to object
            availablePawns[pieces[i].parentNode.dataset.key] = [
              boardTiles[leftTile.dataset.key - amountLeft],
            ];
          }
        }
      }

      // check right tile behind the pawn
      if (rightTile.firstChild) {
        if (
          (rightTile.firstChild.classList.contains(`pawn--${oppositeColor}`) &&
            rightTile.classList.contains(`board__tile--black`)) ||
          (rightTile.firstChild.classList.contains(`king--${oppositeColor}`) &&
            rightTile.classList.contains(`board__tile--black`))
        ) {
          if (
            boardTiles[rightTile.dataset.key - amountRight].children.length !==
              0 ||
            boardTiles[rightTile.dataset.key - amountRight].classList.contains(
              "board__tile--white"
            )
          ) {
          } else {
            pawnsToCapture[pieces[i].parentNode.dataset.key] = [rightTile];
            // add pawns to object
            availablePawns[pieces[i].parentNode.dataset.key] = [
              boardTiles[rightTile.dataset.key - amountRight],
            ];
          }
        }
      }
    }

    console.log(availablePawns);
    Pieces.setPossibleCapture(pawnsToCapture);
    return availablePawns;
  };
  // function to move the king
  // in developement
  showKingMoves = (e) => {
    BoardManage.clearAvailableTiles();
    Pieces.clearActivePiece();

    e.target.classList.add("king--active");
    const color = e.target.classList.contains("king--white")
      ? "white"
      : "black";

    const possibleMoves = [
      boardTiles[parseInt(e.target.parentNode.dataset.key) - 7],
      boardTiles[parseInt(e.target.parentNode.dataset.key) + 7],
      boardTiles[parseInt(e.target.parentNode.dataset.key) - 9],
      boardTiles[parseInt(e.target.parentNode.dataset.key) + 9],
    ];

    if (
      (color === "white" && this.getTurn()) ||
      (color === "black" && !this.getTurn())
    ) {
      if (Object.keys(this.checkIfKingCapture(color)).length > 0) {
        const data = this.checkIfKingCapture(color);

        const currentPiece = document.querySelector(".king--active").parentNode
          .dataset.key;

        console.log(data);
        this.setCapture();
        BoardManage.addAvailableTiles(data[currentPiece]);
        return;
      } else {
        BoardManage.addAvailableTiles(possibleMoves);
        e.target.classList.add("king--active");
      }
    }
  };

  checkIfKingCapture = (color) => {
    const oppositeColor = color === "black" ? "white" : "black";
    const currentSquare = parseInt(
      document.querySelector(".king--active").parentNode.dataset.key
    );
    const rightDiagonal = [];
    const leftDiagonal = [];

    // right diagonal
    for (let i = currentSquare - 7; i > 0; i -= 7) {
      rightDiagonal.push(boardTiles[i]);
    }

    for (let i = 0; currentSquare + i < 64; i += 7) {
      rightDiagonal.push(boardTiles[currentSquare + i]);
    }

    // left diagonal
    for (let i = currentSquare - 9; i > 0; i -= 9) {
      leftDiagonal.push(boardTiles[i]);
    }

    for (let i = 0; currentSquare + i < 64; i += 9) {
      leftDiagonal.push(boardTiles[currentSquare + i]);
    }

    const filteredLeft = leftDiagonal
      .filter((tile) => tile !== undefined)
      .filter((tile) => tile.classList.contains("board__tile--black"))
      .filter((tile) => tile.dataset.key != currentSquare);
    const filteredRight = rightDiagonal
      .filter((tile) => tile !== undefined)
      .filter((tile) => tile.classList.contains("board__tile--black"))
      .filter((tile) => tile.dataset.key != currentSquare);

    // possible captures  - right diagonal
    const right = this.filterTiles(
      7,
      filteredRight,
      currentSquare,
      oppositeColor
    );

    // possible captures  - left diagonal
    const left = this.filterTiles(
      9,
      filteredLeft,
      currentSquare,
      oppositeColor
    );

    Pieces.setPossibleCapture([...right.pieces, ...left.pieces]);

    return left.squares.length < 1 && right.squares < 1
      ? {}
      : { [currentSquare]: [...left.squares, ...right.squares] };
  };

  filterTiles = (direction, diagonal, current, color) => {
    const availableSquares = [];
    const possibleCaptures = [];

    diagonal.forEach((tile) => {
      const forward =
        tile.dataset.key > current
          ? null
          : boardTiles[tile.dataset.key - direction];
      const backward =
        tile.dataset.key > current
          ? boardTiles[parseInt(tile.dataset.key) + direction]
          : null;

      if (tile.children.length > 0) {
        if (
          tile.firstChild.classList.contains(`pawn--${color}`) ||
          tile.firstChild.classList.contains(`king--${color}`)
        ) {
          if (tile.dataset.key > current) {
            if (backward) {
              if (
                backward.classList.contains("board__tile--black") &&
                backward.children.length === 0
              ) {
                // available moves
                availableSquares.push(backward);

                // pieces that can be captured
                // required for capture function
                possibleCaptures.push(tile);
              }
            }
          } else {
            if (forward) {
              if (
                forward.classList.contains("board__tile--black") &&
                forward.children.length === 0
              ) {
                // available moves
                availableSquares.push(forward);

                // pieces that can be captured
                // required for capture function
                possibleCaptures.push(tile);
              }
            }
          }
        }
      }
    });

    return { squares: availableSquares, pieces: possibleCaptures };
  };
}
