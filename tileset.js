import Point from "./point.js";

export default class Tileset {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.image = gameScreen.content.getAssetByName("tileset");
    this.tileSize = 16;
  }
  tilesetWidthInTiles = () => {
    return Math.ceil(this.image.width / this.tileSize);
  };
  tileToCol = (tile) => {
    const row = Math.floor(tile / this.tilesetWidthInTiles());
    return tile - row * this.tilesetWidthInTiles();
  };
  tileToRow = (tile) => {
    return Math.floor(tile / this.tilesetWidthInTiles());
  };
}
