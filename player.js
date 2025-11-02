import CharacterAnimations from "./characterAnimations.js";
import CharacterSounds from "./characterSounds.js";
import Debug from "./debug.js";
import Physics from "./physics.js";
import PlayerCollisions from "./playerCollisions.js";
import Point from "./point.js";

export const playerStates = {
  normal: "normal",
  dying: "dying",
};

export const isValidPlayerState = (value) => {
  return Object.values(playerStates).includes(value);
};

export const isValidSavePoint = (value) => {
  if (!value.position) {
    return false;
  }
  if (!Number.isInteger(value.position.x)) {
    return false;
  }
  if (!Number.isInteger(value.position.y)) {
    return false;
  }
  if (!value.map) {
    return false;
  }
  if (!value.map.name) {
    return false;
  }
  return true;
};

export default class Player {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.spriteSheet = gameScreen.tileset;
    this.load(data);
    this.physics = new Physics(this);
    this.collisions = new PlayerCollisions(this);
    this.sounds = new CharacterSounds(this);
    this.animations = new CharacterAnimations(this);
    this.deathAnimationTimer = 0;
    this.deathAnimationDuration = 60;
    this._state = playerStates.normal;
    this._savePoint = null;
  }
  get width() {
    return this.spriteSheet.tileSize;
  }
  get height() {
    return this.spriteSheet.tileSize;
  }
  get center() {
    const half = this.spriteSheet.tileSize * 0.5;
    return new Point(this.position.x + half, this.position.y + half);
  }
  set positionX(value) {
    this.position.x = Math.round(value);
  }
  set positionY(value) {
    this.position.y = Math.round(value);
  }
  set state(value) {
    if (!isValidPlayerState(value)) {
      throw new RangeError(`<<${value}>> is not a valid player state`);
    }
    this._state = value;
  }
  get savePoint() {
    return this._savePoint;
  }
  set savePoint(value) {
    if (!isValidSavePoint(value)) {
      throw new RangeError(`<<${value}>> is not a valid save point`);
    }

    this._savePoint = {
      position: value.position,
      map: value.map,
    };
  }
  enterMap(map) {
    this.map = map;
    map.onEnter(this);
  }
  onHurt() {
    this.state = playerStates.dying;
    this.sounds.playDamage();
  }
  actDying() {
    if (this.deathAnimationTimer <= this.deathAnimationDuration) {
      this.animations.playStunned();
      this.deathAnimationTimer++;
      return;
    }

    this.onDeath();
  }
  onDeath() {
    if (this._savePoint === null) {
      this.gameScreen.endGame();
      return;
    }

    this.enterMap(this._savePoint.map);
    this.positionX = this._savePoint.position.x;
    this.positionY = this._savePoint.position.y;
    this.disableDeathState();
    this.gameScreen.debug.logInDebugMode(`player revived at save point`);
  }
  disableDeathState() {
    this.state = playerStates.normal;
    this.deathAnimationTimer = 0;
  }
  enemyJump() {
    this.physics.bounce();
    this.sounds.playJump();
  }
  handleInput(input) {
    if (input.isLeft()) {
      this.handleLeftInput();
    } else if (input.isRight()) {
      this.handleRightInput();
    }
    if (input.isJump()) {
      this.handleJumpInput();
    }
    if (input.isDrop()) {
      this.handleDropInput();
    }
  }
  handleLeftInput() {
    this.physics.moveLeft();
    this.animations.playWalkLeft();
    this.sounds.walk();
  }
  handleRightInput() {
    this.physics.moveRight();
    this.animations.playWalkRight();
    this.sounds.walk();
  }
  handleJumpInput() {
    if (!this.physics.isStandingOnGround()) {
      return;
    }
    this.physics.jump();
    this.sounds.playJump();
  }
  handleDropInput() {
    if (!this.physics.isStandingOnGround()) {
      return;
    }
    this.physics.drop();
  }
  update(input) {
    switch (this._state) {
      case playerStates.normal:
        this.updateNormalState(input);
        break;
      case playerStates.dying:
        this.updateDyingState();
        break;
      default:
        this.updateUnrecognizedState();
    }
  }
  updateNormalState(input) {
    this.physics.update();
    this.collisions.update();
    this.handleInput(input);
    this.animations.update();
  }
  updateDyingState() {
    this.actDying();
    this.animations.update();
  }
  updateUnrecognizedState() {
    throw new Error(`player was in unrecognized state <<${this._state}>>`);
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
