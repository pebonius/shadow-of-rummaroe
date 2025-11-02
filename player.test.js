import {
  playerStates,
  isValidPlayerState,
  isValidSavePoint,
} from "./player.js";
import { areOutputs, throws } from "./tests.js";

function isValidPlayerStateTest() {
  areOutputs(
    [playerStates.normal, playerStates.dying],
    isValidPlayerState,
    true
  );

  areOutputs(["some string", 0, undefined, null], isValidPlayerState, false);
}

function isValidSavePointTest() {
  const validSavePoints = [
    {
      position: { x: 10, y: 20 },
      map: { name: "testMap" },
    },
    {
      position: { x: 0, y: 0 },
      map: { name: "anotherTestMap" },
    },
  ];

  areOutputs(validSavePoints, isValidSavePoint, true);

  const invalidSavePoints = [
    {
      position: { x: null, y: 20 },
      map: { name: "testMap" },
    },
    {
      position: { x: 10, y: null },
      map: { name: "testMap" },
    },
    {
      position: { x: 10, y: 20 },
      map: "some string",
    },
    {
      position: "some string",
      map: { name: "testMap" },
    },
    {
      map: { name: "testMap" },
    },
    {
      position: { x: 10, y: null },
    },
    "some string",
    0,
  ];

  areOutputs(invalidSavePoints, isValidSavePoint, false);
  throws(() => {
    isValidSavePoint(undefined);
  });
  throws(() => {
    isValidSavePoint(null);
  });
}

export const playerTests = [isValidPlayerStateTest, isValidSavePointTest];
