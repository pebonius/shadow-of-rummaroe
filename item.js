import Debug from "./debug.js";
import ItemAnimations from "./itemAnimations.js";
import Point from "./point.js";
import { arrayContains, isDefined } from "./utilities.js";

export default class Item {
  constructor(gameScreen, data, id, map) {
    this.gameScreen = gameScreen;
    this.map = map;
    this.id = id;
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
    this.gameScreen.sound.playSoundEffect(this.soundSrc);
    this.gameScreen.gold += this.price;
    this.isDead = true;
    this.gameScreen.deadItemIds.push(this.id);
  }
  draw(context) {
    this.animations.draw(context);
  }
  applyType(data) {
    const type = this.gameScreen.content.data.itemTypes.find(
      (x) => x.name === data.type
    );

    if (type === undefined) {
      this.type = "undefined";
      this.baseSprite = 227;
      this.sound = "damage";
      this.price = 0;
      return;
    }

    this.type = type.name;
    this.baseSprite = type.sprite;
    this.sound = type.sound;
    this.price = type.price;
  }
  load(data) {
    this.position = new Point(data.positionX, data.positionY);
    this.applyType(data);
  }
}
