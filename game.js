import { removeDead, lastElementInArray } from "./utilities.js";
import { clearContext } from "./graphics.js";
import SoundManager from "./sound.js";
import InputManager from "./input.js";
import ContentManager from "./content.js";
import LoadingScreen from "./loadingScreen.js";

export default class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.scaleCanvas();
    this.content = new ContentManager();
    this.sound = new SoundManager();
    this.input = new InputManager(canvas);
    this.gameStates = new Array();
    this.isRunning = false;
  }
  scaleCanvas() {
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const aspectRatio = 3 / 4;

    if (windowWidth * aspectRatio < windowHeight) {
      this.canvas.width = window.innerWidth;
      this.canvas.height = this.canvas.width * aspectRatio;
    } else {
      this.canvas.height = windowHeight;
      this.canvas.width = this.canvas.height / aspectRatio;
    }

    this.context.imageSmoothingEnabled = false;
  }
  initialize() {
    this.input.addEvents();
    this.input.addKeys();
    this.gameStates.push(
      new LoadingScreen(
        this.gameStates,
        this.canvas,
        this.input,
        this.content,
        this.sound
      )
    );
    this.isRunning = true;
    var self = this;
    requestAnimationFrame(() => self.gameLoop(self));
  }
  update() {
    this.input.update();
    removeDead(this.gameStates);
    if (this.gameStates.length <= 0) {
      throw new Error("no game state to process");
    }
    lastElementInArray(this.gameStates).update(this.input);
  }
  draw() {
    clearContext(this.context, this.canvas);
    lastElementInArray(this.gameStates).draw(this.context, this.canvas);
  }
  gameLoop(self) {
    self.update();
    self.draw();
    if (self.isRunning) {
      requestAnimationFrame(() => self.gameLoop(self));
    }
  }
}
