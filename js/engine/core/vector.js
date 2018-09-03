/**
 * A class to represent a 2D vector.
 **/
const GRID_SIZE = 32;

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  // TODO: configure grid size
  toGrid() {
    return new Vector(Math.floor(this.x / GRID_SIZE), Math.floor(this.y / GRID_SIZE));
  }

  add(v) {
    this.x += v.x;
    this.y += v.y;
  }

  angle() {
    return atan2(this.y / this.x);
  }

  mag() {
  }

  eq(v) {
    return this.x === v.x && this.y === v.y;
  }

  gte(v) {
    return this.x >= v.x && this.y >= v.y;
  }

  static dist(r1, r2) {
    return sqrt(pow(r2.x - r1.x, 2) + pow(r2.y - r1.y, 2));
  }
}
