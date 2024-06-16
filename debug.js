import { drawText } from "./graphics.js";
import { isRunningLocally } from "./utilities.js";

export default class Debug {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
  }
  static log(obj) {
    if (!isRunningLocally()) {
      return;
    }
    try {
      console.log(obj.toString());
    } catch (error) {
      console.log("trying to Debug.log an object caused the following error:");
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
    drawText(context, `pos: (${playerPosX}, ${playerPosY})`, 5, "white", 2, 5);
  }

  drawPlayerVelocity(context) {
    const playerVelocityX =
      this.gameScreen.player.physics.velocity.x.toFixed(2);
    const playerVelocityY =
      this.gameScreen.player.physics.velocity.y.toFixed(2);
    drawText(context, `velocityX: ${playerVelocityX}`, 5, "white", 2, 10);
    drawText(context, `velocityY: ${playerVelocityY}`, 5, "white", 2, 15);
  }

  drawPlayerObjectiveVelocity(context) {
    const objectiveVelocityX =
      this.gameScreen.player.physics.objectiveVelocityX.toFixed(2);
    drawText(context, `objVelocityX: ${objectiveVelocityX}`, 5, "white", 2, 20);
    const objectiveVelocityY =
      this.gameScreen.player.physics.objectiveVelocityY.toFixed(2);
    drawText(context, `objVelocityY: ${objectiveVelocityY}`, 5, "white", 2, 25);
  }

  drawPlayerSprite(context) {
    const playerSprite = this.gameScreen.player.animations.currentSprite;
    const isFlipped = this.gameScreen.player.animations.flippedX;

    drawText(context, `playerSprite: ${playerSprite}`, 5, "white", 2, 30);
    drawText(context, `flipped: ${isFlipped}`, 5, "white", 2, 35);
  }

  drawTileBelow(context) {
    const tileBelow = this.gameScreen.player.map.getTile(
      this.gameScreen.player.physics.tileBelow
    );

    drawText(context, `tileBelow: ${tileBelow}`, 5, "white", 60, 5);
  }
}
