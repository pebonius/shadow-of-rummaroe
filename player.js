import Debug from "./debug.js";
import { drawSpriteAtPos } from "./graphics.js";
import { Physics } from "./physics.js";
import Point from "./point.js";

export default class Player {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.spriteSheet = gameScreen.tileset;
    this.maxSpeed = 3;
    this.jump = 1;
    this.physics = new Physics(this);
    this.load(data);
  }
  get width() {
    return this.spriteSheet.tileSize;
  }
  get height() {
    return this.spriteSheet.tileSize;
  }
  set positionX(value) {
    this.position.x = Math.round(value);
  }
  set positionY(value) {
    this.position.y = Math.round(value);
  }
  update(input) {
    this.physics.update();
    if (input.isKeyDown(input.keys.LEFT)) {
      this.physics.walkLeft();
    } else if (input.isKeyDown(input.keys.RIGHT)) {
      this.physics.walkRight();
    }
    if (
      this.physics.isStandingOnGround() &&
      (input.isKeyPressed(input.keys.UP) || input.isKeyPressed(input.keys.X))
    ) {
      this.physics.jump();
    }
  }
  draw(context) {
    drawSpriteAtPos(
      context,
      this.spriteSheet,
      this.baseSpriteId,
      this.position
    );

    if (this.gameScreen.debugMode) {
      this.physics.draw(context); //TODO: remove
    }
  }
  load(data) {
    this.map = this.gameScreen.maps.getMapById(data.player.startingMapId);
    this.position = new Point(
      data.player.startingPosX,
      data.player.startingPosY
    );
    this.baseSpriteId = data.player.baseSprite;
  }
}
