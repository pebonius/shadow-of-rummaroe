import Debug from "./debug.js";
import Point from "./point.js";
import Item from "./item.js";
import {
  arrayContains,
  cloneArray,
  isNumber,
  removeDead,
} from "./utilities.js";
import Enemy from "./enemy.js";

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
    if (this.music === null || this.music === "") {
      this.gameScreen.sound.stopMusic();
      return;
    }
    const musicAsset = this.gameScreen.content.getAssetByName(this.music);
    this.gameScreen.sound.playMusic(musicAsset, true);
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
    return arrayContains(this.tileset.walkableTiles, tile) || this.isSpikes(pos);
  }
  isSpikes(pos) {
    const tile = this.getTile(pos);
    return arrayContains(this.tileset.spikeTiles, tile);
  }
  isPlatform(pos) {
    const tile = this.getTile(pos);
    return arrayContains(this.tileset.platformTiles, tile);
  }
  isWall(pos) {
    const tile = this.getTile(pos);
    return (
      !arrayContains(this.tileset.walkableTiles, tile) &&
      !arrayContains(this.tileset.platformTiles, tile) &&
      !arrayContains(this.tileset.spikeTiles, tile)
    );
  }
  drawTile(pos, context) {
    const tileId = this.tiles[pos.y][pos.x];

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

    this.enemies.forEach((element) => {
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
    removeDead(this.enemies);

    this.items.forEach((element) => {
      element.update(input);
    });

    this.enemies.forEach((element) => {
      element.update(input);
    });
  }
  update(input) {
    this.updateObjects(input);
  }
  getItemId(data) {
    return `${this.name}m${data.positionX}${data.positionY}${data.type}`;
  }
  loadItems(data) {
    data.items.forEach((element) => {
      const id = this.getItemId(element);
      if (!arrayContains(this.gameScreen.deadItemIds, id)) {
        this.items.push(new Item(this.gameScreen, element, id, this));
      }
    });
  }
  loadEnemies(data) {
    data.enemies.forEach((element) => {
      this.enemies.push(new Enemy(this.gameScreen, element, this));
    });
  }
  load(data) {
    this.name = data.name;
    this.music = data.music;
    this.mapAbove = data.mapAbove;
    this.mapBelow = data.mapBelow;
    this.mapLeft = data.mapLeft;
    this.mapRight = data.mapRight;
    this.tiles = cloneArray(data.tiles);
    this.items = Array();
    this.loadItems(data);
    this.enemies = Array();
    this.loadEnemies(data);
  }
}
