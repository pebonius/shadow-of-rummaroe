import Debug from "./debug.js";
import ItemAnimations from "./itemAnimations.js";
import Point from "./point.js";
import { arrayContains, isDefined } from "./utilities.js";

export default class Item {
  constructor(gameScreen, data, id, map) {
    this.gameScreen = gameScreen;
    this.map = map;
    this.load(data);
    this.animations = new ItemAnimations(this);
  }
  set positionX(value) {
    this.position.x = Math.round(value);
  }
  set positionY(value) {
    this.position.y = Math.round(value);
  }
  get itemTypes() {
    return [
      { name: "diamond", sprite: 27, sound: "puroring", price: 10 },
      { name: "gem", sprite: 28, sound: "puroring", price: 5 },
      { name: "coin", sprite: 30, sound: "ring", price: 1 },
    ];
  }
  get itemType() {
    const itemType = this.itemTypes.find((x) => {
      return x.name === this.type;
    });

    return itemType;
  }
  get baseSprite() {
    if (!isDefined(this.itemType)) {
      return 229;
    }

    return this.itemType.sprite;
  }
  get sound() {
    if (!isDefined(this.itemType)) {
      return "damage";
    }

    return this.itemType.sound;
  }
  get price() {
    if (!isDefined(this.itemType)) {
      return 0;
    }

    return this.itemType.price;
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
    if (arrayContains(this.gameScreen.deadItemIds, this.id)) {
      Debug.log(`id ${this.id} is assigned to more than one item!!!!!!!!`);
    }
    this.gameScreen.deadItemIds.push(this.id);
  }
  draw(context) {
    this.animations.draw(context);
  }
  load(data) {
    this.position = new Point(data.positionX, data.positionY);
    this.type = data.type;
  }
}
