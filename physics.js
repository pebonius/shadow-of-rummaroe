import { drawRectangle } from "./graphics.js";
import Point from "./point.js";
import Rectangle from "./rectangle.js";

export default class Physics {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.velocity = new Point(0, 0);
    this.dampingY = 0.9;
    this.dampingX = 0.45;
    this.walkSpeed = 1;
    this.isDropping = false;
    this.boundingRectXShrink = 2;
    this.boundingRect = new Rectangle(
      this.boundingRectPos,
      new Point(
        this.parentObject.width - this.boundingRectXShrink * 2,
        this.parentObject.height
      )
    );
    this.topBoundingRectLenience = 3;
  }
  get boundingRectPos() {
    return new Point(
      this.parentObject.position.x + this.boundingRectXShrink,
      this.parentObject.position.y
    );
  }
  get tileAbove() {
    return this.parentObject.map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.center.x, this.boundingRect.top)
    );
  }
  get tileBelow() {
    return this.parentObject.map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.center.x, this.boundingRect.bottom)
    );
  }
  get tileLeft() {
    return this.parentObject.map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.left, this.boundingRect.center.y)
    );
  }
  get tileRight() {
    return this.parentObject.map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.right, this.boundingRect.center.y)
    );
  }
  get tileBelowLeft() {
    return this.parentObject.map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.left, this.boundingRect.bottom)
    );
  }
  get tileBelowRight() {
    return this.parentObject.map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.right, this.boundingRect.bottom)
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
  update() {
    this.updateBoundingRect();
    this.floorVelocity();
    this.limitVelocity();
    this.updatePosByVelocity();
    this.applyDamping();
    this.fall();
  }
  updateBoundingRect() {
    this.boundingRect.position = this.boundingRectPos;
  }
  updatePosByVelocity() {
    const map = this.parentObject.map;

    this.parentObject.positionX =
      this.parentObject.position.x + this.xPositionDelta(map);
    this.parentObject.positionY =
      this.parentObject.position.y + this.yPositionDelta(map);
  }
  limitVelocity() {
    const maxVelocity = 10;

    if (this.velocity.x > maxVelocity) {
      this.velocity.x = maxVelocity;
    }
    if (this.velocity.x < -maxVelocity) {
      this.velocity.x = -maxVelocity;
    }
    if (this.velocity.y > maxVelocity) {
      this.velocity.y = maxVelocity;
    }
    if (this.velocity.y < -maxVelocity) {
      this.velocity.y = -maxVelocity;
    }
  }
  xPositionDelta(map) {
    if (this.velocity.x < 0 && this.leftSideOfBoundingRectTouchesWall(map)) {
      this.velocity.x = 0;
    }

    if (this.velocity.x > 0 && this.rightSideOfBoundingRectTouchesWall(map)) {
      this.velocity.x = 0;
    }

    if (
      this.isDropping &&
      this.velocity.x < 0 &&
      map.isWall(this.tileBelowLeft)
    ) {
      this.velocity.x = 0;
    }

    if (
      this.isDropping &&
      this.velocity.x > 0 &&
      map.isWall(this.tileBelowRight)
    ) {
      this.velocity.x = 0;
    }

    return this.velocity.x;
  }
  yPositionDelta(map) {
    if (
      this.velocity.y < 0 &&
      (map.isWall(this.tileAbove) || this.topSideOfBoundingRectTouchesWall(map))
    ) {
      this.velocity.y = 0;
    }

    return this.velocity.y;
  }
  topSideOfBoundingRectTouchesWall(map) {
    return (
      map.isWall(
        map.transformViewportPositionToMapTilePosition(
          new Point(this.boundingRect.left + 1, this.boundingRect.top)
        )
      ) ||
      map.isWall(
        map.transformViewportPositionToMapTilePosition(
          new Point(this.boundingRect.right - 1, this.boundingRect.top)
        )
      )
    );
  }
  bottomSideOfBoundingRectTouchesWall(map) {
    return (
      map.isWall(
        map.transformViewportPositionToMapTilePosition(
          new Point(this.boundingRect.left + 1, this.boundingRect.bottom)
        )
      ) ||
      map.isWall(
        map.transformViewportPositionToMapTilePosition(
          new Point(this.boundingRect.right - 1, this.boundingRect.bottom)
        )
      )
    );
  }
  leftSideOfBoundingRectTouchesWall(map) {
    const tileAtTop = map.transformViewportPositionToMapTilePosition(
      new Point(
        this.boundingRect.left,
        this.boundingRect.top + this.topBoundingRectLenience
      )
    );

    if (map.isWall(tileAtTop)) {
      return true;
    }

    const tileAtBottom = map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.left, this.boundingRect.bottom - 1)
    );

    if (map.isWall(tileAtBottom)) {
      return true;
    }
  }
  rightSideOfBoundingRectTouchesWall(map) {
    const tileAtTop = map.transformViewportPositionToMapTilePosition(
      new Point(
        this.boundingRect.right,
        this.boundingRect.top + this.topBoundingRectLenience
      )
    );

    if (map.isWall(tileAtTop)) {
      return true;
    }

    const tileAtBottom = map.transformViewportPositionToMapTilePosition(
      new Point(this.boundingRect.right, this.boundingRect.bottom - 1)
    );

    if (map.isWall(tileAtBottom)) {
      return true;
    }
  }
  applyDamping() {
    this.velocityX *= this.dampingX;
    this.velocityY *= this.dampingY;
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
      this.checkIfShouldContinueDropping();
    }
    if (this.velocityY > 0 && this.isStandingOnGround() && !this.isDropping) {
      this.velocity.y = 0;
      this.fixPositionToTopOfTileBelow();
    } else this.applyGravity();
  }
  fixPositionToTopOfTileBelow() {
    this.parentObject.positionY = this.parentObject.map.getTopOfTile(
      new Point(this.tileBelow.x, this.tileBelow.y - 1)
    ).y;
  }
  checkIfShouldContinueDropping() {
    if (this.droppedDownFullTile() || this.wentAboveStartingPositionOfDrop()) {
      this.isDropping = false;
    }
  }
  wentAboveStartingPositionOfDrop() {
    return this.boundingRect.bottom < this.startDropPosY;
  }
  droppedDownFullTile() {
    return (
      this.boundingRect.bottom >
      this.startDropPosY + this.parentObject.map.tileSize
    );
  }
  isStandingOnGround() {
    const map = this.parentObject.map;

    if (map.isWall(this.tileBelow)) {
      return true;
    }

    if (this.bottomSideOfBoundingRectTouchesWall(map)) {
      return true;
    }

    if (this.isOnPlatform()) {
      return true;
    }

    return false;
  }
  isOnPlatform() {
    const topOfTileBelow = this.parentObject.map.getTopOfTile(this.tileBelow).y;
    return (
      this.parentObject.map.isPlatform(this.tileBelow) &&
      this.boundingRect.bottom - topOfTileBelow < 2 &&
      this.boundingRect.bottom - topOfTileBelow > -2
    );
  }
  moveLeft() {
    if (this.canMoveLeft()) {
      this.velocityX = -this.walkSpeed;
    }
  }
  moveRight() {
    if (this.canMoveRight()) {
      this.velocityX = this.walkSpeed;
    }
  }
  canMoveLeft() {
    return !this.leftSideOfBoundingRectTouchesWall(this.parentObject.map);
  }
  canMoveRight() {
    return !this.rightSideOfBoundingRectTouchesWall(this.parentObject.map);
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
    const map = this.parentObject.map;

    if (
      this.tileBelowIsPlatform() &&
      !this.bottomSideOfBoundingRectTouchesWall(map)
    ) {
      this.velocityY = 0;
      this.isDropping = true;
      this.startDropPosY = this.boundingRect.bottom;
    }
  }
  tileBelowIsPlatform() {
    return this.parentObject.map.isPlatform(this.tileBelow);
  }
  draw(context) {
    // draw bounding rectangle
    drawRectangle(
      context,
      this.boundingRect.position,
      this.boundingRect.size,
      "magenta",
      false
    );
  }
}
