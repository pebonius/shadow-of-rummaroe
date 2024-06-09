import GameState from "./gameState.js";

export default class ActionScreen extends GameState {
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
    this.playStartingEvent();
  }
  playStartingEvent() {}
  loadPlayer() {}
  endGame() {
    this.gameStates.push(
      new ActionScreen(
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
