import CharacterAnimations from "./characterAnimations.js";
import CharacterSounds from "./characterSounds.js";
import Debug from "./debug.js";
import { Physics } from "./physics.js";
import PlayerCollisions from "./playerCollisions.js";
import Point from "./point.js";

export default class Player {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.spriteSheet = gameScreen.tileset;
    this.physics = new Physics(this);
    this.collisions = new PlayerCollisions(this);
    this.sounds = new CharacterSounds(this);
    this.load(data);
    this.animations = new CharacterAnimations(this);
  }
  get width() {
    return this.spriteSheet.tileSize;
  }
  get height() {
    return this.spriteSheet.tileSize;
  }
  set positionX(value) {
    this.position.x = Math.round(value);
  }
  set positionY(value) {
    this.position.y = Math.round(value);
  }
  enterMap(map) {
    this.map = map;
    map.onEnter(this);
  }
  die() {
    this.sounds.playDamage();
    this.gameScreen.load();
  }
  handleInput(input) {
    if (input.isLeft()) {
      this.physics.walkLeft();
      this.animations.walkLeft();
      this.sounds.walk();
    } else if (input.isRight()) {
      this.physics.walkRight();
      this.animations.walkRight();
      this.sounds.walk();
    }
    if (this.physics.isStandingOnGround() && input.isJump()) {
      this.physics.jump();
      this.sounds.playJump();
    }
    if (this.physics.isStandingOnGround() && input.isDrop()) {
      this.physics.drop();
    }
  }
  update(input) {
    this.physics.update();
    this.collisions.update();
    this.handleInput(input);
    this.animations.update();
  }
  draw(context) {
    this.animations.draw(context);

    if (this.gameScreen.debugMode) {
      this.physics.draw(context);
    }
  }
  load(data) {
    const playerData = data.player;
    this.enterMap(this.gameScreen.maps.getMapById(playerData.startingMapId));
    this.position = new Point(playerData.startingPosX, playerData.startingPosY);
    this.maxSpeed = playerData.maxSpeed;
    this.jump = playerData.jump;
    this.baseSprite = data.player.baseSprite;
    this.stepSound = data.player.stepSound;
    this.damageSound = data.player.damageSound;
    this.jumpSound = data.player.jumpSound;
  }
}
