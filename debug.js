import { drawText } from "./graphics.js";
import { isRunningLocally } from "./utilities.js";

export default class Debug {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.overlayFontSize = 5;
    this.firstRowX = 5;
    this.secondRowX = 65;
  }
  static log(obj) {
    if (!isRunningLocally()) {
      return;
    }
    try {
      console.log(obj.toString());
    } catch (error) {
      console.log("trying to Debug log an object caused the following error:");
      console.log(error);
    }
  }

  logInDebugMode(obj) {
    if (!this.gameScreen.debugMode) {
      return;
    }
    try {
      console.log(obj.toString());
    } catch (error) {
      console.log(
        "trying to logInDebugMode an object caused the following error:"
      );
      console.log(error);
    }
  }

  draw(context, canvas) {
    this.drawPlayerPosition(context);
    this.drawPlayerVelocity(context);
    this.drawPlayerObjectiveVelocity(context);
    this.drawPlayerSprite(context);
    this.drawTileBelow(context);
  }

  drawPlayerPosition(context) {
    const playerPosX = this.gameScreen.player.position.x;
    const playerPosY = this.gameScreen.player.position.y;
    drawText(
      context,
      `pos: (${playerPosX}, ${playerPosY})`,
      this.overlayFontSize,
      "white",
      this.firstRowX,
      5
    );
  }

  drawPlayerVelocity(context) {
    const playerVelocityX =
      this.gameScreen.player.physics.velocity.x.toFixed(2);
    const playerVelocityY =
      this.gameScreen.player.physics.velocity.y.toFixed(2);
    drawText(
      context,
      `velocityX: ${playerVelocityX}`,
      this.overlayFontSize,
      "white",
      this.firstRowX,
      10
    );
    drawText(
      context,
      `velocityY: ${playerVelocityY}`,
      this.overlayFontSize,
      "white",
      this.firstRowX,
      15
    );
  }

  drawPlayerObjectiveVelocity(context) {
    const objectiveVelocityX =
      this.gameScreen.player.physics.objectiveVelocityX.toFixed(2);
    drawText(
      context,
      `objVelocityX: ${objectiveVelocityX}`,
      this.overlayFontSize,
      "white",
      this.firstRowX,
      20
    );
    const objectiveVelocityY =
      this.gameScreen.player.physics.objectiveVelocityY.toFixed(2);
    drawText(
      context,
      `objVelocityY: ${objectiveVelocityY}`,
      this.overlayFontSize,
      "white",
      this.firstRowX,
      25
    );
  }

  drawPlayerSprite(context) {
    const playerSprite = this.gameScreen.player.animations.currentFrame.sprite;
    const isFlipped = this.gameScreen.player.animations.currentFrame.flippedX;

    drawText(
      context,
      `playerSprite: ${playerSprite}`,
      this.overlayFontSize,
      "white",
      this.firstRowX,
      30
    );
    drawText(context, `flipped: ${isFlipped}`, 5, "white", this.firstRowX, 35);
  }

  drawTileBelow(context) {
    const tileBelow = this.gameScreen.player.physics.isStandingOnGround()
      ? "true"
      : "false";

    drawText(
      context,
      `isOnGround: ${tileBelow}`,
      this.overlayFontSize,
      "white",
      this.secondRowX,
      5
    );
  }
}
