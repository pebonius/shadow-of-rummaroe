import Player from "./player.js";
import GameScreen from "./gameScreen.js";

function is(a, b) {
  if (a === b) {
    console.log(`${a} is ${b} OK`);
    return;
  }
  throw new Error(`expected ${a} to be ${b} NOK`);
}

function testPlayer() {
  const mockedPlayer = new Player(null, null);

  is(mockedPlayer.isValidPlayerState(mockedPlayer.playerStates.normal), true);
  is(mockedPlayer.isValidPlayerState(mockedPlayer.playerStates.dying), true);
  is(mockedPlayer.isValidPlayerState("some random strin"), false);
}

function runTests() {
  testPlayer();
}

runTests();
