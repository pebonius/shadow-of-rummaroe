import { cloneArray } from "./utilities.js";

export default class Tileset {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    const tilesetData = gameScreen.content.data.tileset;
    this.load(tilesetData);
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
  load(tilesetData) {
    this.image = this.gameScreen.content.getAssetByName(tilesetData.image);
    this.tileSize = tilesetData.tileSize;
    this.walkableTiles = cloneArray(tilesetData.walkableTiles);
    this.spikeTiles = cloneArray(tilesetData.spikeTiles);
    this.platformTiles = cloneArray(tilesetData.platformTiles);
  }
}
