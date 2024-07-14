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
    this.state = "normal";
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
      this.physics.moveLeft();
      this.animations.playWalkLeft();
    } else {
      this.physics.moveRight();
      this.animations.playWalkRight();
    }
  }
  encounteredObstacleLeft() {
    return (
      !this.physics.canMoveLeft() ||
      this.map.isWalkable(this.physics.tileBelowLeft)
    );
  }
  encounteredObstacleRight() {
    return (
      !this.physics.canMoveRight() ||
      this.map.isWalkable(this.physics.tileBelowRight)
    );
  }
  onStunned() {
    this.state = "stunned";
    this.stunTimer = this.stunCooldown;
  }
  actStunned() {
    if (this.stunTimer > 0) {
      this.stunTimer--;
      this.animations.playStunned();
    } else {
      this.state = "normal";
    }
  }
  onCollide() {
    const player = this.gameScreen.player;
    const minVerticalDifference = 3;

    if (player.center.y < this.center.y - minVerticalDifference) {
      this.onStunned();
      player.enemyJump();
    } else {
      player.onHurt();
      this.state = "frozen";
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
    switch (this.state) {
      case "normal":
        this.physics.update();
        this.animations.update();
        this.checkForPlayerCollision();
        this.walkAround();
        break;
      case "stunned":
        this.physics.update();
        this.animations.update();
        this.checkForPlayerCollision();
        this.actStunned();
        break;
      case "frozen":
        break;
      default:
        throw new Error(`enemy <${this.type}> put in unrecognized state`);
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
      case "slime":
        this.baseSprite = 20;
        break;
      case "skeleton":
        this.baseSprite = 36;
        break;
      case "ant":
        this.baseSprite = 52;
        break;
      default:
        this.baseSprite = 227;
        break;
    }
  }
  load(data) {
    this.applyType(data.type);
    this.position = new Point(data.positionX, data.positionY);
    this.walkLeft = data.walkLeft;
  }
}
