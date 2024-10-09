import { drawRectangle } from "./graphics.js";
import Point from "./point.js";
import Rectangle from "./rectangle.js";

export default class Physics {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.velocity = new Point(0, 0);
    this.baseRadius = 2;
    this.damping = 0.9;
    this.walkSpeed = 1;
    this.isDropping = false;
    this.boundingRect = new Rectangle(
      new Point(0, 0),
      new Point(this.parentObject.width, this.parentObject.height)
    );
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
  get tileAbove() {
    return this.parentObject.map.transformPos(this.topTouchPoint);
  }
  get tileBelow() {
    return this.parentObject.map.transformPos(this.bottomTouchPoint);
  }
  get tileLeft() {
    return this.parentObject.map.transformPos(this.leftTouchPoint);
  }
  get tileRight() {
    return this.parentObject.map.transformPos(this.rightTouchPoint);
  }
  get tileBelowLeft() {
    return this.parentObject.map.transformPos(
      new Point(this.leftTouchPoint.x, this.bottomTouchPoint.y)
    );
  }
  get tileBelowRight() {
    return this.parentObject.map.transformPos(
      new Point(this.rightTouchPoint.x, this.bottomTouchPoint.y)
    );
  }
  get baseLeftPos() {
    return this.parentObject.map.transformPos(
      new Point(
        this.bottomTouchPoint.x - this.baseRadius,
        this.bottomTouchPoint.y
      )
    );
  }
  get baseRightPos() {
    return this.parentObject.map.transformPos(
      new Point(
        this.bottomTouchPoint.x + this.baseRadius,
        this.bottomTouchPoint.y
      )
    );
  }
  get headLeftPos() {
    return this.parentObject.map.transformPos(
      new Point(this.topTouchPoint.x - this.baseRadius, this.topTouchPoint.y)
    );
  }
  get headRightPos() {
    return this.parentObject.map.transformPos(
      new Point(this.topTouchPoint.x + this.baseRadius, this.topTouchPoint.y)
    );
  }
  get objectiveVelocityX() {
    const pow = Math.pow(this.velocity.x, 2);
    const sqrt = Math.sqrt(pow);
    const round = sqrt;
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
    this.velocity.x = value;
  }
  get velocityY() {
    return this.velocity.y;
  }
  set velocityY(value) {
    this.velocity.y = value;
  }
  updateBoundingRect() {
    this.boundingRect.position = this.parentObject.position;
  }
  update() {
    this.updateBoundingRect();
    this.updatePosByVelocity();
    this.applyDamping();
    this.fall();
  }
  draw(context) {
    // draw base
    const basePos = new Point(
      this.bottomTouchPoint.x - this.baseRadius,
      this.bottomTouchPoint.y
    );
    const baseSize = new Point(this.baseRadius * 2 + 1, 1);
    drawRectangle(context, basePos, baseSize, "cyan");

    // draw touch points
    this.touchPoints.forEach((element) => {
      drawRectangle(context, element, new Point(1, 1), "magenta");
    });

    // draw bounding rectangle
    drawRectangle(
      context,
      this.boundingRect.position,
      this.boundingRect.size,
      "magenta",
      false
    );
  }
  updatePosByVelocity() {
    const map = this.parentObject.map;

    if (
      (this.velocity.x > 0 && map.isWall(this.tileRight)) ||
      (this.velocity.x < 0 && map.isWall(this.tileLeft)) ||
      (this.isDropping &&
        this.velocity.x > 0 &&
        map.isWall(this.baseRightPos)) ||
      (this.isDropping && this.velocity.x < 0 && map.isWall(this.baseLeftPos))
    ) {
      this.velocityX = 0;
    } else {
      this.parentObject.positionX =
        this.velocity.x + this.parentObject.position.x;
    }

    if (
      this.velocity.y < 0 &&
      (map.isWall(this.tileAbove) ||
        map.isWall(this.headLeftPos) ||
        map.isWall(this.headRightPos)) &&
      !map.isPlatform(this.tileAbove)
    ) {
      this.velocityY = 0;
    } else {
      this.parentObject.positionY =
        this.velocity.y + this.parentObject.position.y;
    }
  }
  applyDamping() {
    this.velocityX *= this.damping * 0.5;
    this.velocityY *= this.damping;
  }
  floorVelocity() {
    if (this.objectiveVelocityX < 0.1) {
      this.velocityX = 0;
    }
    if (this.objectiveVelocityY < 0.1) {
      this.velocityY = 0;
    }
  }
  applyGravity() {
    this.velocity.y += 0.3;
  }
  fall() {
    if (this.isDropping) {
      this.checkDrop();
    }
    if (this.isStandingOnGround() && !this.isDropping) {
      this.velocity.y = 0;
      this.parentObject.positionY = this.parentObject.map.getTopOfTile(
        new Point(this.tileBelow.x, this.tileBelow.y - 1)
      ).y;
    } else this.applyGravity();
  }
  checkDrop() {
    if (
      this.bottomTouchPoint.y >
        this.startDropPosY + this.parentObject.map.tileSize ||
      this.bottomTouchPoint.y < this.startDropPosY
    ) {
      this.isDropping = false;
    }
  }
  isStandingOnGround() {
    return (
      this.parentObject.map.isWall(this.tileBelow) ||
      this.parentObject.map.isWall(this.baseLeftPos) ||
      this.parentObject.map.isWall(this.baseRightPos) ||
      this.isOnPlatform()
    );
  }
  isOnPlatform() {
    const topOfTileBelow = this.parentObject.map.getTopOfTile(this.tileBelow).y;
    return (
      this.parentObject.map.isPlatform(this.tileBelow) &&
      this.bottomTouchPoint.y - topOfTileBelow < 2 &&
      this.bottomTouchPoint.y - topOfTileBelow > -2
    );
  }
  moveLeft() {
    if (!this.canMoveLeft()) {
      return;
    }
    this.velocityX = -this.walkSpeed;
  }
  moveRight() {
    if (!this.canMoveRight()) {
      return;
    }
    this.velocityX = this.walkSpeed;
  }
  canMoveLeft() {
    return (
      this.parentObject.map.isWalkable(this.tileLeft) ||
      this.parentObject.map.isPlatform(this.tileLeft)
    );
  }
  canMoveRight() {
    return (
      this.parentObject.map.isWalkable(this.tileRight) ||
      this.parentObject.map.isPlatform(this.tileRight)
    );
  }
  jump() {
    this.velocityY = 0;
    this.velocityY -= this.parentObject.jump;
  }
  bounce() {
    this.velocityY = 0;
    this.velocityY -= this.parentObject.jump * 1.5;
  }
  drop() {
    if (this.parentObject.map.isPlatform(this.tileBelow)) {
      this.velocityY = 0;
      this.isDropping = true;
      this.startDropPosY = this.bottomTouchPoint.y;
    }
  }
}
