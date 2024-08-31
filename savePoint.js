import Debug from "./debug.js";
import ItemAnimations from "./itemAnimations.js";
import Point from "./point.js";

export default class SavePoint {
  constructor(gameScreen, data, map) {
    this.gameScreen = gameScreen;
    this.map = map;
    this.baseSprite = 12;
    this.sound = "puroring";
    this.load(data);
    this.animations = new ItemAnimations(this);
  }
  set positionX(value) {
    this.position.x = Math.round(value);
  }
  set positionY(value) {
    this.position.y = Math.round(value);
  }
  get soundSrc() {
    return this.gameScreen.content.getAssetByName(this.sound);
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
    const player = this.gameScreen.player;
    if (
      player.currentSavePoint === null ||
      player.currentSavePoint.map !== this.map
    ) {
      this.gameScreen.sound.playSoundEffect(this.soundSrc);

      player.savePoint = { position: this.position, map: this.map };
    }
  }
  draw(context) {
    this.animations.draw(context);
  }
  load(data) {
    this.position = new Point(data.positionX, data.positionY);
  }
}
