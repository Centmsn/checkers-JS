class MoveManage {
  constructor() {
    // *true if capture is available
    this._capture = false;
    // *true if it's white's move
    this._move = true;
  }

  setCapture = (value) => {
    this.capture = value;
  };

  getTurn = () => {
    return this.move;
  };

  setTurn = () => {
    this.move = !this.move;
    Board.checkIfWin();

    const whitePieces = document.querySelectorAll(".pawn--white, .king--white");
    const blackPieces = document.querySelectorAll(".pawn--black, .king--black");

    if (this.move) {
      blackPieces.forEach((piece) =>
        piece.removeEventListener("click", Move.showPossibleMoves)
      );
      whitePieces.forEach((piece) =>
        piece.addEventListener("click", Move.showPossibleMoves)
      );
    } else {
      whitePieces.forEach((piece) =>
        piece.removeEventListener("click", Move.showPossibleMoves)
      );
      blackPieces.forEach((piece) =>
        piece.addEventListener("click", Move.showPossibleMoves)
      );
    }

    const info = document.querySelector(".game-stats__turn");

    info.textContent = this.move ? "White's turn" : "Black's turn";
  };

  movePiece = (e) => {
    Board.handleHighlightTiles(true);
    const type = document.querySelector(".king--active") ? "king" : "pawn";

    const currentPawn = document.querySelector(`.${type}--active`);
    const color = currentPawn.classList.contains(`${type}--black`)
      ? "black"
      : "white";

    Pieces.setMovedPiece(e.target.dataset.key);

    if (this.capture) {
      this.capturePiece(e.target);

      Pieces.generatePiece(color, 1, e.target, type);
      Board.clearAvailableTiles();

      const keys = Object.keys(this.checkIfCapture(color, type));

      if (keys.filter((key) => key != Pieces.prevMovedPiece).length > 0) {
        this.checkIfCapture(color, type);
        this.setCapture(true);
      } else {
        Move.setTurn();
      }
    } else {
      Pieces.generatePiece(color, 1, e.target, type);
      // TODO: set tiles
      Board.clearAvailableTiles();
      Move.setTurn();
    }

    // *highlights board tiles
    Board.setRecentlyMoved(currentPawn.parentNode, e.target);

    currentPawn.parentNode.innerHTML = "";
    // *check if pawn should be promoted to king
    Pieces.checkIfKing();
    // *update game stats
    Board.updateGameInfo("black");
    Board.updateGameInfo("white");
    Board.handleHighlightTiles();
  };

  // ! multiple pieces can capture during one turn
  capturePiece = (target) => {
    const possibleMoves = Pieces.getPossibleCapture();
    const targetKey = parseInt(target.dataset.key);

    const squares = [
      boardTiles[targetKey - 7],
      boardTiles[targetKey - 9],
      boardTiles[targetKey + 7],
      boardTiles[targetKey + 9],
    ];

    let index = null;

    if (possibleMoves.includes(squares[0])) {
      index = 0;
    } else if (possibleMoves.includes(squares[1])) {
      index = 1;
    } else if (possibleMoves.includes(squares[2])) {
      index = 2;
    } else if (possibleMoves.includes(squares[3])) {
      index = 3;
    }

    const type = squares[index].firstChild.classList.contains("pawn")
      ? "pawn"
      : "king";
    const color = squares[index].firstChild.classList.contains(`${type}--black`)
      ? "black"
      : "white";

    squares[index].innerHTML = "";
    Pieces.removePiece(color, type);
    this.setCapture(false);
  };

  showPossibleMoves = (e) => {
    Board.clearAvailableTiles();
    Pieces.clearActivePiece();

    const key = parseInt(e.target.parentNode.dataset.key);
    const type = e.target.classList.contains("king") ? "king" : "pawn";
    const color = e.target.classList.contains(`${type}--white`)
      ? "white"
      : "black";
    let possibleMoves = [];

    e.target.classList.add(`${type}--active`);

    if (type === "king") {
      possibleMoves = [
        boardTiles[key - 7],
        boardTiles[key + 7],
        boardTiles[key - 9],
        boardTiles[key + 9],
      ];
    } else {
      possibleMoves = [
        boardTiles[key + (color === "black" ? 7 : -7)],
        boardTiles[key + (color === "black" ? 9 : -9)],
      ];
    }

    // !checkIfCapture is called 3 times
    // !refactor required
    if (
      (color === "white" && this.getTurn()) ||
      (color === "black" && !this.getTurn())
    ) {
      if (
        Object.keys(this.checkIfCapture(color, type)).length > 0 ||
        Object.keys(
          this.checkIfCapture(color, type === "king" ? "pawn" : "king")
        ).length > 0
      ) {
        const data = this.checkIfCapture(color, type);
        const currentPiece = document.querySelector(`.${type}--active`)
          .parentNode.dataset.key;

        this.setCapture(true);
        Board.addAvailableTiles(data[currentPiece]);
        if (document.querySelectorAll(".board__tile--available").length === 0) {
          e.target.classList.remove(`${type}--active`);

          Pieces.highlightPiece();
        }
        return;
      } else {
        Board.addAvailableTiles(possibleMoves);
        e.target.classList.add(`${type}--active`);
      }
    }
  };

  checkIfCapture = (color, type) => {
    const oppositeColor = color === "black" ? "white" : "black";
    const takenTiles = document.querySelectorAll(`.${type}--${color}`);
    const possibleMoves = {};
    const possibleCaptures = [];

    takenTiles.forEach((takenTile) => {
      const currentSquare = parseInt(takenTile.parentNode.dataset.key);
      const rightDiagonal = [];
      const leftDiagonal = [];

      if (type === "king") {
        // *right diagonal
        for (let i = currentSquare - 7; i > 0; i -= 7) {
          rightDiagonal.push(boardTiles[i]);
        }

        for (let i = 0; currentSquare + i < 64; i += 7) {
          rightDiagonal.push(boardTiles[currentSquare + i]);
        }

        // *left diagonal
        for (let i = currentSquare - 9; i > 0; i -= 9) {
          leftDiagonal.push(boardTiles[i]);
        }

        for (let i = 0; currentSquare + i < 64; i += 9) {
          leftDiagonal.push(boardTiles[currentSquare + i]);
        }
      } else {
        rightDiagonal.push(
          boardTiles[currentSquare + (color === "black" ? 7 : -7)]
        );
        leftDiagonal.push(
          boardTiles[currentSquare + (color === "black" ? 9 : -9)]
        );
      }

      const filteredLeft = leftDiagonal
        .filter((tile) => tile !== undefined)
        .filter((tile) => tile.classList.contains("board__tile--black"))
        .filter((tile) => tile.dataset.key != currentSquare);
      const filteredRight = rightDiagonal
        .filter((tile) => tile !== undefined)
        .filter((tile) => tile.classList.contains("board__tile--black"))
        .filter((tile) => tile.dataset.key != currentSquare);

      // *possible captures  - right diagonal
      const right = this.filterTiles(
        7,
        filteredRight,
        currentSquare,
        oppositeColor
      );

      // *possible captures  - left diagonal
      const left = this.filterTiles(
        9,
        filteredLeft,
        currentSquare,
        oppositeColor
      );

      if (left.pieces.length > 0) {
        possibleCaptures.push(...left.pieces);
      }

      if (right.pieces.length > 0) {
        possibleCaptures.push(...right.pieces);
      }

      if (Object.keys(left.squares).length > 0) {
        if (possibleMoves[currentSquare]) {
          possibleMoves[currentSquare].push(...left.squares);
        } else {
          possibleMoves[currentSquare] = left.squares;
        }
      }

      if (Object.keys(right.squares).length > 0) {
        if (possibleMoves[currentSquare]) {
          possibleMoves[currentSquare].push(...right.squares);
        } else {
          possibleMoves[currentSquare] = right.squares;
        }
      }
    });

    if (type === "king") {
      Pieces.setAvailablePiece(possibleMoves, "king");
    } else {
      Pieces.setAvailablePiece(possibleMoves, "pawn");
    }
    Pieces.setPossibleCapture(possibleCaptures);
    return possibleMoves;
  };

  // King can capture even if he is blocked by a pawn of the same color as he is
  filterTiles = (direction, diagonal, current, color) => {
    const availableSquares = [];
    const possibleCaptures = [];

    diagonal.forEach((tile, index) => {
      const prev = diagonal[index - 1];
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
                if (
                  availableSquares.find(
                    (square) => square.dataset.key > current
                  )
                ) {
                  return;
                }
                if (prev && prev.children.length !== 0) {
                  return;
                }

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
                if (
                  availableSquares.find(
                    (square) => square.dataset.key < current
                  )
                ) {
                  return;
                }
                if (prev && prev.children.length !== 0) {
                  return;
                }
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
