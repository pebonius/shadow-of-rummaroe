import { drawSpriteAtPos } from "./graphics.js";
import ItemAnimations from "./itemAnimations.js";
import Point from "./point.js";
import { randomNumber } from "./utilities.js";

export default class Item {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.load(data);
    this.animations = new ItemAnimations(this);
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
  update(input) {
    this.checkForPlayerCollision();
    this.animations.update(input);
  }
  checkForPlayerCollision() {
    const collectRange = 10;
    const distance = Point.distance(
      this.gameScreen.player.position,
      this.position
    );

    if (distance < collectRange) {
      this.onCollect();
    }
  }
  onCollect() {
    this.gameScreen.sound.playSoundEffect(this.collectSoundSrc);
    this.isDead = true;
  }
  draw(context) {
    this.animations.draw(context);
  }
  load(data) {
    this.position = new Point(data.positionX, data.positionY);
    this.collectSound = data.collectSound;
    this.baseSprite = data.sprite;
  }
}
