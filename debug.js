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
    const playerPosX = this.gameScreen.player.position.x;
    const playerPosY = this.gameScreen.player.position.y;
    drawText(context, `pos: (${playerPosX}, ${playerPosY})`, 5, "white", 2, 2);
  }
}
