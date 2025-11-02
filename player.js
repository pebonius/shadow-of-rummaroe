import CharacterAnimations from "./characterAnimations.js";
import CharacterSounds from "./characterSounds.js";
import Debug from "./debug.js";
import Physics from "./physics.js";
import PlayerCollisions from "./playerCollisions.js";
import Point from "./point.js";

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
    this.playerStates = {
      normal: "normal",
      dying: "dying",
    };
    Object.freeze(this.playerStates);
    this.currentState = this.playerStates.normal;
    this.currentSavePoint = null;
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
  setPosition(x, y) {
    if (!Number.isInteger(x)) {
      throw new RangeError(`${x} is not an integer`);
    }

    if (!Number.isInteger(y)) {
      throw new RangeError(`${y} is not an integer`);
    }

    this.positionX = x;
    this.positionY = y;
  }
  isValidPlayerState(value) {
    return Object.values(this.playerStates).includes(value);
  }
  setState(value) {
    if (!this.isValidPlayerState) {
      throw new RangeError(`<<${value}>> is not a valid playerState`);
    }
    this.currentState = value;
    this.gameScreen.debug.logInDebugMode(`player state set to <<${value}>>`);
  }
  set savePoint(value) {
    this.currentSavePoint = {
      position: value.position,
      map: value.map,
    };

    this.gameScreen.debug.logInDebugMode(
      `player saved at map: <<${value.map}>>, position: <<${value.position.x}, ${value.position.y}>>`
    );
  }
  enterMap(map) {
    this.map = map;
    map.onEnter(this);

    this.gameScreen.debug.logInDebugMode(`player entered map: <<${map}>>`);
  }
  onHurt() {
    this.setState(this.playerStates.dying);
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
    if (this.currentSavePoint === null) {
      this.gameScreen.endGame();
      return;
    }

    this.enterMap(this.currentSavePoint.map);
    this.setPosition(
      this.currentSavePoint.position.x,
      this.currentSavePoint.position.y
    );
    this.disableDeathState();
    this.gameScreen.debug.logInDebugMode(`player revived at save point`);
  }
  disableDeathState() {
    this.setState(this.playerStates.normal);
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
    switch (this.currentState) {
      case this.playerStates.normal:
        this.updateNormalState(input);
        break;
      case this.playerStates.dying:
        this.updateDyingState(input);
        break;
      default:
        this.updateUnrecognizedState(input);
    }
  }
  updateNormalState(input) {
    this.physics.update();
    this.collisions.update();
    this.handleInput(input);
    this.animations.update();
  }
  updateDyingState(input) {
    this.actDying();
    this.animations.update();
  }
  updateUnrecognizedState(input) {
    throw new Error(
      `player was put in unrecognized state <<${this.currentState}>>. set state using the <<setState>> setter.`
    );
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
