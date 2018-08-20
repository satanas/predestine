class Actionable extends Sprite {
  constructor(x, y, groupId, id) {
    super(x, y, GRID, GRID);
    this.groupId = groupId
    this.id = id;
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = "#00F";
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore();
  }
}
