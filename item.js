import { drawSpriteAtPos } from "./graphics.js";
import Point from "./point.js";

export default class Item {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.load(data);
  }
  set positionX(value) {
    this.position.x = Math.round(value);
  }
  set positionY(value) {
    this.position.y = Math.round(value);
  }
  get collectSoundSrc() {
    return this.gameScreen.content.getAssetByName(this.collectSound);
  }
  get itemValue() {
    switch (this.baseSprite) {
      case 27: // diamond
        return 10;
      case 28: // gem
        return 5;
      default: // any other
        return 1;
    }
  }
  onCollect() {
    this.gameScreen.sound.playSoundEffect(this.collectSoundSrc);
    this.isDead = true;
  }
  update(input) {
    const collectRange = 10;
    const distance = Point.distance(
      this.gameScreen.player.position,
      this.position
    );

    if (distance < collectRange) {
      this.onCollect();
    }
  }
  draw(context) {
    drawSpriteAtPos(
      context,
      this.gameScreen.tileset,
      this.baseSprite,
      this.position
    );
  }
  load(data) {
    this.position = new Point(data.positionX, data.positionY);
    this.collectSound = data.collectSound;
    this.baseSprite = data.sprite;
  }
}
