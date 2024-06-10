import GameState from "./gameState.js";
import Maps from "./maps.js";
import Player from "./player.js";
import Tileset from "./tileset.js";

export default class GameScreen extends GameState {
  constructor(gameStates, canvas, input, content, sound) {
    super(gameStates);
    this.canvas = canvas;
    this.input = input;
    this.content = content;
    this.sound = sound;
    this.load();
  }
  update(input) {
    this.player.update(input);
  }
  draw(context, canvas) {
    this.player.map.draw(context);
    this.player.draw(context);
  }
  load() {
    this.tileset = new Tileset(this);
    this.maps = new Maps(this, this.content.data);
    this.player = new Player(this, this.content.data);
  }
  endGame() {
    this.gameStates.push(
      new GameScreen(
        this.gameStates,
        this.canvas,
        this.input,
        this.content,
        this.sound
      )
    );
    this.kill();
  }
}
