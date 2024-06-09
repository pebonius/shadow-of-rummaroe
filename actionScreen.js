import GameState from "./gameState.js";
import Maps from "./maps.js";

export default class GameScreen extends GameState {
  constructor(gameStates, canvas, input, content, sound) {
    super(gameStates);
    this.canvas = canvas;
    this.input = input;
    this.content = content;
    this.sound = sound;
    this.load();
  }
  update(input) {}
  draw(context, canvas) {}
  load() {
    this.maps = new Maps(this, content.data);
    this.player = new Player(this, this.content.data.playerData);
    this.variables = new Variables(this, this.content.data.variables);
  }
  loadPlayer() {}
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
