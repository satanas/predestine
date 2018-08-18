class Sprite extends Rectangle {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.alive = true;
    this.enabled = true;
  }

  render(rect) {
    throw "Not Implemented";
  }

  kill() {
    this.alive = false;
  }
}
