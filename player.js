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
    this.physics = new Physics(this);
    this.collisions = new PlayerCollisions(this);
    this.sounds = new CharacterSounds(this);
    this.load(data);
    this.animations = new CharacterAnimations(this);
    this.deathAnimationTimer = 0;
    this.deathAnimationDuration = 60;
    this.currentState = "normal";
    this.currentSavePoint = null;
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
  get center() {
    const half = this.spriteSheet.tileSize * 0.5;
    return new Point(this.position.x + half, this.position.y + half);
  }
  set state(value) {
    this.currentState = value;
    if (this.gameScreen.debugMode) {
      Debug.log(`player state set to <<${value}>>`);
    }
  }
  set savePoint(value) {
    this.currentSavePoint = {
      position: value.position,
      map: value.map,
    };
  }
  enterMap(map) {
    this.map = map;
    map.onEnter(this);
  }
  onHurt() {
    this.state = "dying";
    this.sounds.playDamage();
  }
  actDying() {
    if (this.deathAnimationTimer <= this.deathAnimationDuration) {
      this.animations.playStunned();
      this.deathAnimationTimer++;
    } else {
      this.onDeath();
    }
  }
  onDeath() {
    if (this.currentSavePoint === null) {
      this.gameScreen.endGame();
    } else {
      this.enterMap(this.currentSavePoint.map);
      this.positionX = this.currentSavePoint.position.x;
      this.positionY = this.currentSavePoint.position.y;
      this.state = "normal";
    }
  }
  enemyJump() {
    this.physics.bounce();
    this.sounds.playJump();
  }
  handleInput(input) {
    if (input.isLeft()) {
      this.physics.moveLeft();
      this.animations.playWalkLeft();
      this.sounds.walk();
    } else if (input.isRight()) {
      this.physics.moveRight();
      this.animations.playWalkRight();
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
    switch (this.currentState) {
      case "normal":
        this.physics.update();
        this.collisions.update();
        this.handleInput(input);
        this.animations.update();
        break;
      case "dying":
        this.actDying();
        this.animations.update();
        break;
      default:
        throw new Error("player put in unrecognized state");
    }
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
