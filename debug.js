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
  }

  drawPlayerPosition(context) {
    const playerPosX = this.gameScreen.player.position.x;
    const playerPosY = this.gameScreen.player.position.y;
    drawText(context, `pos: (${playerPosX}, ${playerPosY})`, 5, "white", 2, 5);
  }

  drawPlayerVelocity(context) {
    const playerVelocity = this.gameScreen.player.physics.velocity;
    drawText(context, `velocityX: ${playerVelocity.x}`, 5, "white", 2, 10);
    drawText(context, `velocityY: ${playerVelocity.y}`, 5, "white", 2, 15);
  }

  drawPlayerObjectiveVelocity(context) {
    const objectiveVelocityX =
      this.gameScreen.player.physics.objectiveVelocityX;
    drawText(context, `objVelocityX: ${objectiveVelocityX}`, 5, "white", 2, 20);
    const objectiveVelocityY =
      this.gameScreen.player.physics.objectiveVelocityY;
    drawText(context, `objVelocityX: ${objectiveVelocityY}`, 5, "white", 2, 25);
  }
}
