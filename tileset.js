import Point from "./point.js";

export default class Tileset {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.image = gameScreen.content.getAssetByName("tileset");
    this.walkableTiles = [255, 191, 190, 189];
    this.spikeTiles = [219, 220, 235, 236];
    this.platformTiles = [108];
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
