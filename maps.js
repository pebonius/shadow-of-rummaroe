import Tilemap from "./tilemap.js";

export default class Maps {
  constructor(gameScreen, data) {
    this.gameScreen = gameScreen;
    this.data = data;
  }
  getMapById(mapId) {
    const mapData = this.data.maps[mapId];
    const map = new Tilemap(this.gameScreen, mapData);
    return map;
  }
}
