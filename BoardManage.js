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
}
