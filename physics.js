import { drawRectangle } from "./graphics.js";
import Point from "./point.js";

export class Physics {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.velocity = new Point(0, 0);
    this.edgeOffset = 4;
    this.damping = 0.9;
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
    return this.parentObject.maxSpeed * 0.2;
  }

  update() {
    this.updatePosByVelocity();
    this.applyDamping();
    this.fall();
  }

  draw(context) {
    drawRectangle(context, this.touchPoint, new Point(1, 1), "red");
  }

  updatePosByVelocity() {
    this.parentObject.position.x += this.velocity.x;
    this.parentObject.position.y += this.velocity.y;
  }

  applyDamping() {
    this.velocity.x *= this.damping * 0.5;
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
    this.velocity.y += 0.3;
  }

  fall() {
    if (this.isStandingOnGround()) {
      this.velocity.y = 0;
      this.parentObject.position.y = this.parentObject.map.getTopOfTile(
        new Point(this.tileBelow.x, this.tileBelow.y - 1)
      ).y;
    } else this.applyGravity();
  }

  isStandingOnGround() {
    return !this.parentObject.map.isWalkable(this.tileBelow);
  }

  walkLeft() {
    if (this.canWalkLeft()) {
      return;
    }
    if (this.velocity.x > -this.parentObject.maxSpeed) {
      this.velocity.x -= this.accelleration;
    }
  }

  canWalkLeft() {
    return this.touchPoint.x - this.edgeOffset <= 0;
  }

  walkRight() {
    if (this.canWalkRight()) {
      return;
    }
    if (this.velocity.x < this.parentObject.maxSpeed) {
      this.velocity.x += this.accelleration;
    }
  }

  canWalkRight() {
    return (
      this.touchPoint.x + this.edgeOffset >=
      this.parentObject.gameScreen.canvas.width / 2
    );
  }

  jump() {
    this.velocity.y = 0;
    this.velocity.y -= 5 * this.parentObject.jump;
  }
}
