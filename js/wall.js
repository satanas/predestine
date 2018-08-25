class Wall extends Sprite {
  constructor(x, y) {
    super(x,y, GRID, GRID);
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = "#fff";
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore();
  }
}
