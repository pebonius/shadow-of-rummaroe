import { removeDead, lastElementInArray } from "./utilities.js";
import { clearContext, drawText } from "./graphics.js";
import SoundManager from "./sound.js";
import InputManager from "./input.js";
import ContentManager from "./content.js";
import LoadingScreen from "./loadingScreen.js";

export default class Game {
  constructor() {
    this.canvas = document.getElementById("canvas");
    this.context = this.canvas.getContext("2d");
    this.context.imageSmoothingEnabled = false;
    this.canvasZoom = 2;
    this.context.scale(this.canvasZoom, this.canvasZoom);
    this.content = new ContentManager();
    this.sound = new SoundManager();
    this.input = new InputManager(canvas);
    this.gameStates = new Array();
    this.isRunning = false;
    this.lastUpdateTime = null;
    this.updateRate = 15;
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
    this.lastLoop = Date.now();
    this.fps = 0;
    this.fpsTimer = 0;
    this.fpsDelay = 10;
    this.fpsString = "";
    requestAnimationFrame(() => self.gameLoop(self));
  }
  update() {
    if (Date.now() < this.lastUpdateTime + this.updateRate) {
      return;
    }

    this.input.update();
    removeDead(this.gameStates);
    if (this.gameStates.length <= 0) {
      throw new Error("no game state to process");
    }
    lastElementInArray(this.gameStates).update(this.input);

    this.lastUpdateTime = Date.now();
  }
  draw() {
    clearContext(this.context, this.canvas);
    lastElementInArray(this.gameStates).draw(this.context, this.canvas);
    this.drawFps();
  }
  drawFps() {
    drawText(this.context, Math.round(this.fpsString), 10, "lime", 140, 5);
  }
  gameLoop(self) {
    this.measureFps();
    self.update();
    self.draw();
    if (self.isRunning) {
      requestAnimationFrame(() => self.gameLoop(self));
    }
  }
  measureFps() {
    const thisLoop = Date.now();
    this.fps = 1000 / (thisLoop - this.lastLoop);
    this.lastLoop = thisLoop;
    if (this.fpsTimer >= this.fpsDelay) {
      this.fpsTimer = 0;
      this.fpsString = this.fps.toFixed(0);
    } else this.fpsTimer++;
  }
}
