import { drawSpriteAtPos, drawText } from "./graphics.js";
import Point from "./point.js";

export default class Hud {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.goldIcon = 31;
    this.goldIconPos = new Point(0, 0);
    this.goldStringMargin = 2;
    this.goldStringPos = new Point(
      this.goldIconPos.x + gameScreen.tileset.tileSize + this.goldStringMargin,
      this.goldIconPos.y + 6
    );
  }
  get goldString() {
    return this.gameScreen.gold.toString();
  }
  update(input) {}
  draw(context) {
    drawSpriteAtPos(
      context,
      this.gameScreen.tileset,
      this.goldIcon,
      this.goldIconPos
    );
    drawText(
      context,
      this.goldString,
      8,
      "white",
      this.goldStringPos.x,
      this.goldStringPos.y
    );
  }
}
