import CharacterAnimations from "./characterAnimations.js";
import Debug from "./debug.js";
import { Physics } from "./physics.js";
import Point from "./point.js";

export default class Player {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.spriteSheet = gameScreen.tileset;
    this.physics = new Physics(this);
    this.animations = new CharacterAnimations(this);
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
    if (input.isLeft()) {
      this.physics.walkLeft();
      this.animations.walkLeft();
    } else if (input.isRight()) {
      this.physics.walkRight();
      this.animations.walkRight();
    }
    if (this.physics.isStandingOnGround() && input.isJump()) {
      this.physics.jump();
    }
    this.animations.update();
  }
  draw(context) {
    this.animations.draw(context);

    if (this.gameScreen.debugMode) {
      this.physics.draw(context); //TODO: remove
    }
  }
  load(data) {
    const playerData = data.player;
    this.map = this.gameScreen.maps.getMapById(playerData.startingMapId);
    this.position = new Point(playerData.startingPosX, playerData.startingPosY);
    this.maxSpeed = playerData.maxSpeed;
    this.jump = playerData.jump;
    this.baseSprite = data.player.baseSprite;
  }
}
