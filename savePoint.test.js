import { saveGame } from "./savePoint.js";
import { is } from "./tests.js";

function saveGameTest() {
  const player = {
    savePoint: null,
  };

  const positionX = 10;
  const positionY = 20;
  const map = { name: "testMap" };

  saveGame(player, { x: positionX, y: positionY }, map);

  is(player.savePoint.position.x, positionX);
  is(player.savePoint.position.y, positionY);
  is(player.savePoint.map.name, "testMap");
}

export const savePointTests = [saveGameTest];
