import Debug from "./debug.js";
import Point from "./point.js";
import Item from "./item.js";
import {
  arrayContains,
  cloneArray,
  isNumber,
  removeDead,
} from "./utilities.js";

export default class Tilemap {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.tileset = gameScreen.tileset;
    this.tileSize = this.tileset.tileSize;
    this.tilesheet = this.tileset.image;
    this.load(data);
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
  onEnter(player) {
    this.playMusic();
  }
  playMusic() {
    if (this.music === null) {
      return;
    }
    const mapMusic = this.gameScreen.content.getAssetByName(this.music);
    this.gameScreen.sound.playMusic(mapMusic, true);
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
    const transformedPosition = this.transformPos(pos);
    return this.isWalkable(transformedPosition);
  }
  transformPos(pos) {
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
  isWalkable(pos) {
    const tile = this.getTile(pos);
    return arrayContains(this.walkableTiles, tile) || this.isSpikes(pos);
  }
  isSpikes(pos) {
    const tile = this.getTile(pos);
    return arrayContains(this.spikeTiles, tile);
  }
  isPlatform(pos) {
    const tile = this.getTile(pos);
    return arrayContains(this.platformTiles, tile);
  }
  isWall(pos) {
    const tile = this.getTile(pos);
    return (
      !arrayContains(this.walkableTiles, tile) &&
      !arrayContains(this.platformTiles, tile) &&
      !arrayContains(this.spikeTiles, tile)
    );
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
    this.items.forEach((element) => {
      element.draw(context);
    });
  }
  draw(context) {
    for (let y = 0; y < this.height; y++)
      for (let x = 0; x < this.width; x++) {
        var pos = new Point(x, y);
        this.drawTile(pos, context);
      }
    this.drawObjects(context);
  }
  updateObjects(input) {
    removeDead(this.items);

    this.items.forEach((element) => {
      element.update(input);
    });
  }
  update(input) {
    this.updateObjects(input);
  }
  loadItems(data) {
    data.items.forEach((element) => {
      this.items.push(new Item(this.gameScreen, element));
    });
  }
  load(data) {
    this.name = data.name;
    this.music = data.music;
    this.mapAbove = data.mapAbove;
    this.mapBelow = data.mapBelow;
    this.mapLeft = data.mapLeft;
    this.mapRight = data.mapRight;
    this.walkableTiles = cloneArray(data.walkableTiles);
    this.spikeTiles = cloneArray(data.spikeTiles);
    this.platformTiles = cloneArray(data.platformTiles);
    this.tiles = cloneArray(data.tiles);
    this.items = Array();
    this.loadItems(data);
  }
}
