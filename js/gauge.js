class Gauge extends Sprite {
  constructor(x, y, w, dragStep, incrStep, successPerc, start) {
    super(x, y, w, 40);

    start = start || 50;
    this.maxWidth = w;
    this.barWidth = start * w / 100;
    this.successWidth = this.maxWidth * successPerc / 100;
    this.incrStep = incrStep;
    this.dragStep = dragStep;
    this.bgColor = '#666';
    this.fgColor = 'yellow';
    this.active = true;
  }

  incr() {
    this.barWidth += rndi(this.incrStep - 10, this.incrStep + 10);
  }

  isDone() {
    return this.barWidth >= this.successWidth;
  }

  update(dt) {
    if (!this.active) return;
    this.barWidth -= this.dragStep * dt / 1000;

    if (this.barWidth >= this.maxWidth) {
      this.barWidth = this.maxWidth;
    } else if (this.barWidth <= 0) {
      this.barWidth = 0;
    }
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = this.bgColor;
    $.ctx.fillRect(this.x, this.y, this.maxWidth, this.h);
    $.ctx.fillStyle = 'rgba(9, 179, 0, 0.4)';
    $.ctx.fillRect(this.x + this.successWidth, this.y, this.maxWidth - this.successWidth, this.h);

    // Draw mark
    $.ctx.strokeStyle = '#000';
    $.ctx.lineWidth = 4;
    $.ctx.moveTo(this.x + this.successWidth, this.y);
    $.ctx.lineTo(this.x + this.successWidth, this.y + this.h);
    $.ctx.stroke();

    // Draw moving bar
    $.ctx.fillStyle = this.fgColor;
    $.ctx.fillRect(this.x, this.y, this.barWidth, this.h);
    $.ctx.restore();
  }
}
