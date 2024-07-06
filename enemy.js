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
    this.walkLeft = true;
    this.stunTimer = 0;
    this.stunCooldown = 32;
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
  get baseSprite() {
    return 4;
  }
  walkAround() {
    if (this.walkLeft && !this.physics.canWalkLeft()) {
      this.walkLeft = false;
    }

    if (!this.walkLeft && !this.physics.canWalkRight()) {
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
  onStunned() {
    this.stunTimer = this.stunCooldown;
  }
  onCollide() {
    const player = this.gameScreen.player;
    const minVerticalDifference = 4;

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
    if (this.stunTimer > 0) {
      this.stunTimer--;
    } else {
      this.walkAround();
    }
  }
  draw(context) {
    this.animations.draw(context);
  }
  load(data) {
    this.position = new Point(data.positionX, data.positionY);
    //this.type = data.type;
  }
}
