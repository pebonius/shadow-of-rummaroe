import { drawSpriteAtPos } from "./graphics.js";
import Point from "./point.js";
import { randomNumber } from "./utilities.js";

export default class ItemAnimations {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.floatDelay = 16;
    this.floatTimer = 0;
    this.floatMax = 0;
    this.floatMin = -2;
    this.floatOffset = randomNumber(this.floatMin, this.floatMax);
    this.goUp = () => {
      return randomNumber(0, 1) === 1;
    };
  }
  get tileset() {
    return this.parentObject.gameScreen.tileset;
  }
  get sprite() {
    return this.parentObject.baseSprite;
  }
  get position() {
    return new Point(
      this.parentObject.position.x,
      this.parentObject.position.y + this.floatOffset
    );
  }
  update(input) {
    if (this.floatTimer >= this.floatDelay * -(this.floatOffset - 1)) {
      this.floatTimer = 0;
      this.checkForDirectionFlip();
      this.floatOffset += this.goUp ? 1 : -1;
    } else {
      this.floatTimer++;
    }
  }
  checkForDirectionFlip() {
    if (this.floatOffset >= this.floatMax) {
      this.goUp = false;
    } else if (this.floatOffset <= this.floatMin) {
      this.goUp = true;
    }
  }
  draw(context) {
    drawSpriteAtPos(context, this.tileset, this.sprite, this.position);
  }
}
