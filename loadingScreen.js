import GameState from "./gameState.js";
import GameScreen from "./gameScreen.js";
import { drawText } from "./graphics.js";

export default class LoadingScreen extends GameState {
  constructor(gameStates, canvas, input, content, sound) {
    super(gameStates);
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.input = input;
    this.content = content;
    this.sound = sound;
    this.fontSize = 8;
    this.loadingFinished = false;
    this.loadingText = "Loading...";
    this.loadedText = "Press ENTER to start";
    this.loadContent();
  }
  get text() {
    if (this.loadingFinished) {
      return this.loadedText;
    }
    return this.loadingText;
  }
  loadContent() {
    this.content.onFinishedLoading = () => {
      this.loadingFinished = true;
    };
    this.content.loadContent();
  }
  goToNextScreen() {
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
  update(input) {
    if (this.loadingFinished && input.isKeyPressed(input.keys.ENTER)) {
      this.goToNextScreen();
    }
  }
  draw(context, canvas) {
    super.draw(context, canvas);
    drawText(context, this.text, this.fontSize, "white", 10, 10);
  }
}
