import Debug from "./debug.js";
import Point from "./point.js";
import { arrayContains, cloneArray, isNumber } from "./utilities.js";

export default class Tilemap {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.tileset = gameScreen.tileset;
    this.tileSize = this.tileset.tileSize;
    this.load(data);
    this.tilesheet = this.tileset.image;
  }
  toString() {
    return this.name;
  }
  get width() {
    return this.tiles.length;
  }
  get height() {
    return this.tiles[0].length;
  }
  containsPosition(pos) {
    return (
      pos.x >= 0 && pos.x < this.width && pos.y >= 0 && pos.y < this.height
    );
  }
  getTile(pos) {
    if (this.containsPosition(pos)) {
      return this.tiles[pos.y][pos.x];
    }
    return null;
  }
  getTileByDisplayPosition(pos) {
    const transformedPosition = new Point(
      pos.x / this.tileSize,
      pos.y / this.tileSize
    );

    return this.getTile(transformedPosition);
  }
  isWalkableByDisplayPosition(pos) {
    const transformedPosition = this.transformPosToTilemapPos(pos);
    return this.isWalkable(transformedPosition);
  }
  transformPosToTilemapPos(pos) {
    const transformedPosition = new Point(
      Math.floor(pos.x / this.tileSize),
      Math.floor(pos.y / this.tileSize)
    );

    return transformedPosition;
  }
  getTopOfTile(pos) {
    const transformedPosition = new Point(
      Math.ceil(pos.x * this.tileSize),
      Math.ceil(pos.y * this.tileSize)
    );

    return transformedPosition;
  }
  getTileWalkable(tileId) {
    return arrayContains(this.walkableTiles, tileId);
  }
  isWalkable(pos) {
    return this.getTileWalkable(this.getTile(pos));
  }
  drawTile(pos, context) {
    const tileId = this.tiles[pos.y][pos.x];
    if (tileId === undefined) {
      return;
    }

    if (!isNumber(tileId)) {
      throw new Error(`tileId should be a number, and it's ${tileId}`);
    }

    const tilePos = new Point(pos.x * this.tileSize, pos.y * this.tileSize);

    context.drawImage(
      this.tilesheet,
      this.tileset.tileToCol(tileId) * this.tileSize,
      this.tileset.tileToRow(tileId) * this.tileSize,
      this.tileSize,
      this.tileSize,
      tilePos.x,
      tilePos.y,
      this.tileSize,
      this.tileSize
    );
  }
  drawObjects(context) {
    // draw objects belonging to this map
  }
  drawPlayer(context) {
    const player = this.gameScreen.player;
  }
  draw(context) {
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++) {
        var pos = new Point(x, y);
        this.drawTile(pos, context);
      }
    this.drawObjects(context);
  }
  load(data) {
    this.name = data.name;
    this.walkableTiles = cloneArray(data.walkableTiles);
    this.tiles = cloneArray(data.tiles);
  }
}
