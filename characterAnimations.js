import { drawSpriteAtPos } from "./graphics.js";

export default class CharacterAnimations {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.defineCycles();
    this.idleDelay = 48;
    this.idleTimer = this.idleDelay;
    this.currentFrame = { sprite: this.baseSprite, flippedX: false };
  }
  get spriteSheet() {
    return this.parentObject.spriteSheet;
  }
  get baseSprite() {
    return this.parentObject.baseSprite;
  }
  defineCycles() {
    this.idleCycle = {
      timer: 0,
      frameDuration: 32,
      currentFrameId: 0,
      frames: [
        {
          sprite: this.baseSprite,
          flippedX: false,
        },
        {
          sprite: this.baseSprite,
          flippedX: true,
        },
      ],
    };
    this.walkLeftCycle = {
      timer: 0,
      frameDuration: 8,
      currentFrameId: 0,
      frames: [
        {
          sprite: this.baseSprite + 2,
          flippedX: true,
        },
        {
          sprite: this.baseSprite + 3,
          flippedX: true,
        },
      ],
    };
    this.walkRightCycle = {
      timer: 0,
      frameDuration: 8,
      currentFrameId: 0,
      frames: [
        {
          sprite: this.baseSprite + 2,
          flippedX: false,
        },
        {
          sprite: this.baseSprite + 3,
          flippedX: false,
        },
      ],
    };
  }
  getNextFrameId(frames, currentId) {
    if (currentId < frames.length - 1) {
      return currentId + 1;
    } else return 0;
  }
  getCurrentCycleFrame(cycle) {
    return cycle.frames[cycle.currentFrameId];
  }
  cycleFrames(cycle) {
    if (cycle.timer <= 0) {
      cycle.timer = cycle.frameDuration;
      cycle.currentFrameId = this.getNextFrameId(
        cycle.frames,
        cycle.currentFrameId
      );
    } else cycle.timer--;
  }
  walkLeft() {
    this.resetIdleTimer();
    if (!this.parentObject.physics.isStandingOnGround()) {
      this.currentFrame = this.walkLeftCycle.frames[1];
    } else {
      this.cycleFrames(this.walkLeftCycle);
      this.currentFrame = this.getCurrentCycleFrame(this.walkLeftCycle);
    }
  }
  walkRight() {
    this.resetIdleTimer();
    if (!this.parentObject.physics.isStandingOnGround()) {
      this.currentFrame = this.walkRightCycle.frames[1];
    } else {
      this.cycleFrames(this.walkRightCycle);
      this.currentFrame = this.getCurrentCycleFrame(this.walkRightCycle);
    }
  }
  resetIdleTimer() {
    this.idleTimer = 0;
    this.idleCycle.timer = 0;
  }
  idle() {
    this.cycleFrames(this.idleCycle);
    this.currentFrame = this.getCurrentCycleFrame(this.idleCycle);
  }
  updateIdleTimer() {
    if (this.idleTimer >= this.idleDelay) {
      this.idle();
    } else this.idleTimer++;
  }
  update() {
    this.updateIdleTimer();
  }
  draw(context) {
    drawSpriteAtPos(
      context,
      this.spriteSheet,
      this.currentFrame.sprite,
      this.parentObject.position,
      this.currentFrame.flippedX
    );
  }
}
