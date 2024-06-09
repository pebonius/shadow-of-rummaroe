import GameState from "./gameState.js";
import GameScreen from "./actionScreen.js";
import { drawText } from "./graphics.js";

export default class LoadingScreen extends GameState {
  constructor(gameStates, canvas, input, content, sound) {
    super(gameStates);
    this.canvas = canvas;
    this.context = canvas.getContext("2d");
    this.input = input;
    this.content = content;
    this.sound = sound;
    this.fontSize = this.canvas.width * 0.04;
    this.loadingFinished = false;
    this.loadingText = "Loading...";
    this.loadedText = "Press ENTER to start";
    this.textPosY = (this.canvas.height / 4) * 3;

    this.loadContent();
  }
  get text() {
    if (this.loadingFinished) {
      return this.loadedText;
    }
    return this.loadingText;
  }
  get textPosX() {
    if (this.loadingFinished) {
      return (
        this.canvas.width / 2 -
        this.context.measureText(this.loadedText).width / 2
      );
    }
    return (
      this.canvas.width / 2 -
      this.context.measureText(this.loadingText).width / 2
    );
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
    drawText(
      context,
      this.text,
      this.fontSize,
      "white",
      this.textPosX,
      this.textPosY
    );
  }
}
