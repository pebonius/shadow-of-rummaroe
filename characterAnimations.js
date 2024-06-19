import { drawSpriteAtPos } from "./graphics.js";

export default class CharacterAnimations {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.flippedX = false;
    this.walkFrameTimer = 0;
    this.walkFrameDuration = 8;
    this.idleFrameTimer = 0;
    this.idleFrameDuration = 32;
    this.idleDelay = 60;
    this.idleTimer = this.idleDelay;
    this.spriteOffset = 0;
  }
  get currentSprite() {
    return this.parentObject.baseSprite + this.spriteOffset;
  }
  get spriteSheet() {
    return this.parentObject.spriteSheet;
  }
  get baseSprite() {
    return this.parentObject.baseSprite;
  }
  switchWalkSprite() {
    switch (this.spriteOffset) {
      case 0:
        this.spriteOffset = 2;
        break;
      case 2:
        this.spriteOffset = 3;
        break;
      case 3:
        this.spriteOffset = 2;
        break;
      default:
        break;
    }
  }
  resetIdleTimer() {
    this.idleTimer = 0;
  }
  idle() {
    if (this.idleFrameTimer <= 0) {
      this.idleFrameTimer = this.idleFrameDuration;
      this.spriteOffset = 0;
      this.flippedX = !this.flippedX;
    } else this.idleFrameTimer--;
  }
  walkLeft() {
    if (this.walkFrameTimer <= 0) {
      this.resetIdleTimer();
      this.flippedX = true;
      this.walkFrameTimer = this.walkFrameDuration;
      if (this.parentObject.physics.isStandingOnGround()) {
        this.switchWalkSprite();
        this.parentObject.sounds.playStep();
      } else {
        this.spriteOffset = 2;
      }
    } else this.walkFrameTimer--;
  }
  walkRight() {
    if (this.walkFrameTimer <= 0) {
      this.resetIdleTimer();
      this.flippedX = false;
      this.walkFrameTimer = this.walkFrameDuration;
      if (this.parentObject.physics.isStandingOnGround()) {
        this.switchWalkSprite();
        this.parentObject.sounds.playStep();
      } else {
        this.spriteOffset = 2;
      }
    } else this.walkFrameTimer--;
  }
  update() {
    if (this.idleTimer >= this.idleDelay) {
      this.idle();
    } else this.idleTimer++;
  }
  draw(context) {
    drawSpriteAtPos(
      context,
      this.spriteSheet,
      this.currentSprite,
      this.parentObject.position,
      this.flippedX
    );
  }
}
