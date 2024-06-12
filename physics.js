import { drawRectangle } from "./graphics.js";
import Point from "./point.js";

export class Physics {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.velocity = new Point(0, 0);
    this.baseRadius = 2;
    this.damping = 0.9;
  }

  get bottomTouchPoint() {
    return new Point(
      this.parentObject.position.x + this.parentObject.width * 0.5,
      this.parentObject.position.y + this.parentObject.height
    );
  }

  get leftTouchPoint() {
    return new Point(
      this.parentObject.position.x,
      this.parentObject.position.y + this.parentObject.height * 0.5
    );
  }

  get rightTouchPoint() {
    return new Point(
      this.parentObject.position.x + this.parentObject.width,
      this.parentObject.position.y + this.parentObject.height * 0.5
    );
  }

  get topTouchPoint() {
    return new Point(
      this.parentObject.position.x + this.parentObject.width * 0.5,
      this.parentObject.position.y
    );
  }

  get touchPoints() {
    return [
      this.topTouchPoint,
      this.bottomTouchPoint,
      this.leftTouchPoint,
      this.rightTouchPoint,
    ];
  }

  get tileBelow() {
    return this.parentObject.map.transformPosToTilemapPos(
      this.bottomTouchPoint
    );
  }

  get tileLeft() {
    return this.parentObject.map.transformPosToTilemapPos(this.leftTouchPoint);
  }

  get tileRight() {
    return this.parentObject.map.transformPosToTilemapPos(this.rightTouchPoint);
  }

  get objectiveVelocityX() {
    const pow = Math.pow(this.velocity.x, 2);
    const sqrt = Math.sqrt(pow);
    const round = Math.round(sqrt);
    return round;
  }

  get objectiveVelocityY() {
    const pow = Math.pow(this.velocity.y, 2);
    const sqrt = Math.sqrt(pow);
    return sqrt;
  }

  get velocityX() {
    return this.velocity.x;
  }

  set velocityX(value) {
    this.velocity.x = Math.round(value);
  }

  get velocityY() {
    return this.velocity.y;
  }

  set velocityY(value) {
    this.velocity.y = value;
  }

  update() {
    this.updatePosByVelocity();
    this.applyDamping();
    this.fall();
  }

  draw(context) {
    const basePos = new Point(
      this.bottomTouchPoint.x - this.baseRadius,
      this.bottomTouchPoint.y
    );
    const baseSize = new Point(this.baseRadius * 2 + 1, 1);
    drawRectangle(context, basePos, baseSize, "magenta");
    this.touchPoints.forEach((element) => {
      drawRectangle(context, element, new Point(1, 1), "red");
    });
  }

  updatePosByVelocity() {
    this.parentObject.positionX =
      this.velocity.x + this.parentObject.position.x;
    this.parentObject.positionY =
      this.velocity.y + this.parentObject.position.y;
  }

  applyDamping() {
    this.velocityX *= this.damping * 0.5;
    this.velocityY *= this.damping;
  }

  floorVelocity() {
    if (this.objectiveVelocityX < 1) {
      this.velocityX = 0;
    }
    if (this.objectiveVelocityY < 1) {
      this.velocityY = 0;
    }
  }

  applyGravity() {
    this.velocity.y += 0.3;
  }

  fall() {
    if (this.isStandingOnGround()) {
      this.velocity.y = 0;
      this.parentObject.positionY = this.parentObject.map.getTopOfTile(
        new Point(this.tileBelow.x, this.tileBelow.y - 1)
      ).y;
    } else this.applyGravity();
  }

  isStandingOnGround() {
    return (
      !this.parentObject.map.isWalkable(this.tileBelow) ||
      !this.parentObject.map.isWalkableByDisplayPosition(
        new Point(
          this.bottomTouchPoint.x - this.baseRadius,
          this.bottomTouchPoint.y
        )
      ) ||
      !this.parentObject.map.isWalkableByDisplayPosition(
        new Point(
          this.bottomTouchPoint.x + this.baseRadius,
          this.bottomTouchPoint.y
        )
      )
    );
  }

  walkLeft() {
    if (!this.canWalkLeft()) {
      return;
    }
    if (this.velocityX > -this.parentObject.maxSpeed) {
      this.velocityX = -1;
    }
  }

  walkRight() {
    if (!this.canWalkRight()) {
      return;
    }
    if (this.velocityX < this.parentObject.maxSpeed) {
      this.velocityX = 1;
    }
  }

  canWalkLeft() {
    return (
      this.leftTouchPoint.x > 0 &&
      this.parentObject.map.isWalkable(this.tileLeft)
    );
  }

  canWalkRight() {
    return (
      this.rightTouchPoint.x <
        this.parentObject.gameScreen.canvas.width / 2 - 1 &&
      this.parentObject.map.isWalkable(this.tileRight)
    );
  }

  jump() {
    this.velocityY = 0;
    this.velocityY -= this.parentObject.jump;
  }
}
