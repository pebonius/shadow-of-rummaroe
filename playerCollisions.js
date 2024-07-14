import Debug from "./debug.js";
import Point from "./point.js";

export default class PlayerCollisions {
  constructor(player) {
    this.player = player;
  }
  get physics() {
    return this.player.physics;
  }
  get map() {
    return this.player.map;
  }
  get bottomTouchPoint() {
    return this.player.physics.bottomTouchPoint;
  }
  get rightTouchPoint() {
    return this.player.physics.rightTouchPoint;
  }
  get spikeTouchPoint() {
    return new Point(
      this.bottomTouchPoint.x,
      this.bottomTouchPoint.y - this.map.tileSize * 0.5
    );
  }
  checkForSpikes() {
    const tilePos = this.map.transformPos(this.spikeTouchPoint);

    if (this.map.isSpikes(tilePos)) {
      this.player.onHurt();
    }
  }
  checkForMapBorders() {
    const mapWidth = this.map.width * this.map.tileSize;
    const mapHeight = this.map.height * this.map.tileSize;

    if (this.player.position.y < 0 && this.map.mapAbove !== null) {
      this.player.enterMap(
        this.player.gameScreen.maps.getMapById(this.map.mapAbove)
      );
      this.player.positionY = mapHeight - this.map.tileSize - 1;
      return;
    }
    if (this.bottomTouchPoint.y >= mapHeight && this.map.mapBelow !== null) {
      this.player.enterMap(
        this.player.gameScreen.maps.getMapById(this.map.mapBelow)
      );
      this.player.positionY = 0;
      return;
    }
    if (this.player.position.x < 0 && this.map.mapLeft !== null) {
      this.player.enterMap(
        this.player.gameScreen.maps.getMapById(this.map.mapLeft)
      );
      this.player.positionX = mapWidth - this.map.tileSize - 1;
      return;
    }
    if (this.rightTouchPoint.x >= mapWidth && this.map.mapRight !== null) {
      this.player.enterMap(
        this.player.gameScreen.maps.getMapById(this.map.mapRight)
      );
      this.player.positionX = 0;
      return;
    }
  }
  update() {
    this.checkForSpikes();
    this.checkForMapBorders();
  }
}
