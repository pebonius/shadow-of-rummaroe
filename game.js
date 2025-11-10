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

    // for FPS counter
    this.lastLoop = Date.now();
    this.fps = 0;
    this.fpsTimer = 0;
    this.fpsDelay = 10;
    this.fpsString = "";

    // for update rate throttle
    this.lastUpdateTime = Date.now();
    this.updateRate = 15;

    requestAnimationFrame(() => this.gameLoop());
  }
  update() {
    // throttle update rate
    if (Date.now() < this.lastUpdateTime + this.updateRate) {
      return;
    }

    if (this.gameStates.length <= 0) {
      throw new Error("no game state to process");
    }

    this.input.update();
    removeDead(this.gameStates);
    lastElementInArray(this.gameStates).update(this.input);

    // save current time for update rate throttle
    this.lastUpdateTime = Date.now();
  }
  draw() {
    clearContext(this.context, this.canvas);
    lastElementInArray(this.gameStates).draw(this.context, this.canvas);
    this.drawFpsCounter();
  }
  drawFpsCounter() {
    drawText(this.context, Math.round(this.fpsString), 10, "lime", 140, 5);
  }
  gameLoop() {
    this.measureFps();
    this.update();
    this.draw();
    if (this.isRunning) {
      requestAnimationFrame(() => this.gameLoop());
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
