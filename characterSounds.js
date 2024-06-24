export default class CharacterSounds {
  constructor(parentObject) {
    this.parentObject = parentObject;
    this.walkTimer = 0;
    this.stepDelay = 16;
  }
  get stepSound() {
    return this.parentObject.gameScreen.content.getAssetByName(
      this.parentObject.stepSound
    );
  }
  get damageSound() {
    return this.parentObject.gameScreen.content.getAssetByName(
      this.parentObject.damageSound
    );
  }
  get jumpSound() {
    return this.parentObject.gameScreen.content.getAssetByName(
      this.parentObject.jumpSound
    );
  }
  playStep() {
    this.parentObject.gameScreen.sound.playSoundEffect(this.stepSound);
  }
  playDamage() {
    this.parentObject.gameScreen.sound.playSoundEffect(this.damageSound);
  }
  playJump() {
    this.parentObject.gameScreen.sound.playSoundEffect(this.jumpSound);
  }
  walk() {
    if (!this.parentObject.physics.isStandingOnGround()) {
      this.walkTimer = 0;
      return;
    }

    if (this.walkTimer <= 0) {
      this.walkTimer = this.stepDelay;
      this.playStep();
    } else this.walkTimer--;
  }
}
