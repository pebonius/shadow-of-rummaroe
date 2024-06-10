import { drawRectangle } from "./graphics.js";
import Point from "./point.js";
import { maxNumber } from "./utilities.js";

export class Physics {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.velocity = new Point(0, 0);
    this.damping = 0.95;
  }

  get touchPoint() {
    return new Point(
      this.parentObject.position.x + this.parentObject.width * 0.5,
      this.parentObject.position.y + this.parentObject.height
    );
  }

  get tileBelow() {
    return this.parentObject.map.transformPosToTilemapPos(this.touchPoint);
  }

  get objectiveVelocityX() {
    return Math.sqrt(Math.pow(this.velocity.x * 100, 2));
  }

  get objectiveVelocityY() {
    return Math.sqrt(Math.pow(this.velocity.y * 100, 2));
  }

  get accelleration() {
    return this.parentObject.maxSpeed * 0.1;
  }

  update() {
    this.updatePosByVelocity();
    this.applyDamping();
    this.fall();
  }

  draw(context) {
    drawRectangle(context, this.touchPoint, new Point(2, 2), "red");
  }

  updatePosByVelocity() {
    this.parentObject.position.x += this.velocity.x;
    this.parentObject.position.y += this.velocity.y;
  }

  applyDamping() {
    this.velocity.x *= this.damping;
    this.velocity.y *= this.damping;
  }

  floorVelocity() {
    if (this.objectiveVelocityX < 0.01) {
      this.velocity.x = 0;
    }
    if (this.objectiveVelocityY < 0.01) {
      this.velocity.y = 0;
    }
  }

  applyGravity() {
    this.velocity.y += 0.5;
  }

  fall() {
    if (this.isStandingOnGround()) {
      this.velocity.y = 0;
      this.parentObject.position.y =
        this.parentObject.map.getTopOfTile(
          new Point(this.tileBelow.x, this.tileBelow.y - 1)
        ).y + 2;
    } else this.applyGravity();
  }

  isStandingOnGround() {
    return !this.parentObject.map.isWalkable(this.tileBelow);
  }

  walkLeft() {
    if (this.velocity.x > -this.parentObject.maxSpeed) {
      this.velocity.x -= this.accelleration;
    }
  }

  walkRight() {
    if (this.velocity.x < this.parentObject.maxSpeed) {
      this.velocity.x += this.accelleration;
    }
  }

  jump() {
    this.velocity.y = 0;
    this.velocity.y -= 5 * this.parentObject.jump;
  }
}
