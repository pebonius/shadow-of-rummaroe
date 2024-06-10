export default class Player {
  constructor(gameScreen) {
    this.gameScreen = gameScreen;
    this.map = gameScreen.maps.getMapById(0);
  }
  update(input) {}
  draw(context) {}
}
