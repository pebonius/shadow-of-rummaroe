import { drawRectangle } from "./graphics.js";
import Point from "./point.js";
import Rectangle from "./rectangle.js";

export default class Physics {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.velocity = new Point(0, 0);
    this.damping = 0.9;
    this.walkSpeed = 1;
    this.isDropping = false;
    this.boundingRectMargin = 2;
    this.boundingRect = new Rectangle(
      this.boundingRectPos,
      new Point(
        this.parentObject.width - this.boundingRectMargin * 2,
        this.parentObject.height
      )
    );
    console.log(this.boundingRect);
  }
  get boundingRectPos() {
    return new Point(
      this.parentObject.position.x + this.boundingRectMargin,
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
  updateBoundingRect() {
    this.boundingRect.position = this.boundingRectPos;
  }
  update() {
    this.updateBoundingRect();
    this.updatePosByVelocity();
    this.applyDamping();
    this.fall();
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
  updatePosByVelocity() {
    const map = this.parentObject.map;

    if (
      (this.velocity.x > 0 && map.isWall(this.tileRight)) ||
      (this.velocity.x < 0 && map.isWall(this.tileLeft)) ||
      (this.isDropping &&
        this.velocity.x > 0 &&
        map.isWall(this.tileBelowRight)) ||
      (this.isDropping &&
        this.velocity.x < 0 &&
        map.isWall(this.tileBelowRight))
    ) {
      this.velocityX = 0;
    } else {
      this.parentObject.positionX =
        this.velocity.x + this.parentObject.position.x;
    }

    if (
      this.velocity.y < 0 &&
      (map.isWall(this.tileAbove) ||
        map.isWall(
          map.transformViewportPositionToMapTilePosition(
            new Point(this.boundingRect.left + 1, this.boundingRect.top)
          )
        ) ||
        map.isWall(
          map.transformViewportPositionToMapTilePosition(
            new Point(this.boundingRect.right - 1, this.boundingRect.top)
          )
        ))
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
  checkDrop() {
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

    return (
      map.isWall(this.tileBelow) ||
      (this.bottomSideOfBoundingRectTouchesWall(map) &&
        this.boundingRect.bottom <=
          this.parentObject.map.getTopOfTile(this.tileBelow).y) ||
      this.isOnPlatform()
    );
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

  tileBelowIsPlatform() {
    return this.parentObject.map.isPlatform(this.tileBelow);
  }
}
