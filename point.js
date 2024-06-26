import { checkForTypeErrorNum } from "./utilities.js";

export default class Point {
  constructor(x, y) {
    checkForTypeErrorNum(x, "x");
    checkForTypeErrorNum(y, "y");
    this.x = Math.floor(x);
    this.y = Math.floor(y);
  }
  static distance(a, b) {
    if (!(a instanceof Point) || !(b instanceof Point)) {
      throw TypeError("Provided a and b must be Points.");
    }
    const distance = Math.hypot(a.x - b.x, a.y - b.y);
    return distance;
  }
}
