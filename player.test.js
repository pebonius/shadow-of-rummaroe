import { playerStates, isValidPlayerState } from "./player.js";
import { areOutputs } from "./tests.js";

function isValidPlayerStateTest() {
  areOutputs(
    [playerStates.normal, playerStates.dying],
    isValidPlayerState,
    true
  );

  areOutputs(
    ["some string", 0, undefined, null],
    isValidPlayerState,
    false
  );
}

export const playerTests = [isValidPlayerStateTest];
