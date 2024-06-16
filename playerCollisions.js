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
  get spikeTouchPoint() {
    return new Point(
      this.bottomTouchPoint.x,
      this.bottomTouchPoint.y - this.map.tileSize * 0.5
    );
  }
  checkForSpikes() {
    const tilePos = this.map.transformPos(this.spikeTouchPoint);

    if (this.map.isSpikes(tilePos)) {
      this.player.die();
    }
  }
  update() {
    this.checkForSpikes();
  }
}
