export default class CharacterSounds {
  constructor(parentObject) {
    this.parentObject = parentObject;
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
  playStep() {
    this.parentObject.gameScreen.sound.playSoundEffect(this.stepSound);
  }
  playDamage() {
    this.parentObject.gameScreen.sound.playSoundEffect(this.damageSound);
  }
}
