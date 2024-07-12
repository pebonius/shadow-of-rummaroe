import CharacterAnimations from "./characterAnimations.js";
import CharacterSounds from "./characterSounds.js";
import Physics from "./physics.js";
import Point from "./point.js";

export default class Enemy {
  constructor(gameScreen, data, map) {
    this.gameScreen = gameScreen;
    this.map = map;
    this.spriteSheet = gameScreen.tileset;
    this.physics = new Physics(this);
    this.sounds = new CharacterSounds(this);
    this.load(data);
    this.animations = new CharacterAnimations(this);
    this.stunTimer = 0;
    this.stunCooldown = 96;
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
  get center() {
    const half = this.spriteSheet.tileSize * 0.5;
    return new Point(this.position.x + half, this.position.y + half);
  }
  walkAround() {
    if (this.walkLeft && this.encounteredObstacleLeft()) {
      this.walkLeft = false;
    }

    if (!this.walkLeft && this.encounteredObstacleRight()) {
      this.walkLeft = true;
    }

    if (this.walkLeft) {
      this.physics.walkLeft();
      this.animations.walkLeft();
    } else {
      this.physics.walkRight();
      this.animations.walkRight();
    }
  }
  encounteredObstacleLeft() {
    return (
      !this.physics.canWalkLeft() ||
      this.map.isWalkable(this.physics.tileBelowLeft)
    );
  }
  encounteredObstacleRight() {
    return (
      !this.physics.canWalkRight() ||
      this.map.isWalkable(this.physics.tileBelowRight)
    );
  }
  onStunned() {
    this.stunTimer = this.stunCooldown;
  }
  isStunned() {
    return this.stunTimer > 0;
  }
  actStunned() {
    this.stunTimer--;
    this.animations.beStunned();
  }
  onCollide() {
    const player = this.gameScreen.player;
    const minVerticalDifference = 3;

    if (player.center.y < this.center.y - minVerticalDifference) {
      this.onStunned();
      player.enemyJump();
    } else {
      player.die();
    }
  }
  checkForPlayerCollision() {
    const range = 8;
    const distance = Point.distance(this.gameScreen.player.center, this.center);

    if (distance < range) {
      this.onCollide();
    }
  }
  update(input) {
    this.physics.update();
    this.animations.update();
    this.checkForPlayerCollision();

    if (this.isStunned()) {
      this.actStunned();
    } else {
      this.walkAround();
    }
  }
  draw(context) {
    this.animations.draw(context);

    if (this.gameScreen.debugMode) {
      this.physics.draw(context);
    }
  }
  applyType(type) {
    this.type = type;
    switch (this.type) {
      case "bug":
        this.baseSprite = 4;
        break;
      default:
        this.baseSprite = 229;
        break;
    }
  }
  load(data) {
    this.applyType(data.type);
    this.position = new Point(data.positionX, data.positionY);
    this.walkLeft = data.walkLeft;
  }
}
