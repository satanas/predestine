class Sprite extends Rectangle {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.alive = true;
    this.enabled = true;
  }

  _render(rect) {
    this.render(rect);

    //-- DEBUG_START --
    if (debug) {
      $.ctx.save();
      $.ctx.strokeStyle = '#0f0';
      $.ctx.fillStyle = '#0f0';
      $.ctx.strokeRect(rect.x, rect.y, this.bounds.right - this.x, this.bounds.bottom - this.y);
      $.ctx.fillText('(' + floor(this.x) + "," + floor(this.y) + ")", rect.x, rect.y + 10);
      $.ctx.restore();
    }
    //-- DEBUG_END --
  }

  render(rect) {
    throw "Not Implemented";
  }

  kill() {
    this.alive = false;
  }
}
