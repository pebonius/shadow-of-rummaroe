import Point from "./point.js";

export default class Tileset {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.displayedTileSize = new Point(
      this.gameScreen.canvas.width / 10,
      this.gameScreen.canvas.height / 10
    );
    this.image = gameScreen.content.getAssetByName("tileset");
    this.baseTileSize = 16;
  }
  tilesetWidthInTiles = () => {
    return Math.ceil(this.image.width / this.baseTileSize);
  };
  tileToCol = (tile) => {
    const row = Math.floor(tile / this.tilesetWidthInTiles());
    return tile - row * this.tilesetWidthInTiles();
  };
  tileToRow = (tile) => {
    return Math.floor(tile / this.tilesetWidthInTiles());
  };
}
