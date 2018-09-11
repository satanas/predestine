class Gauge extends Sprite {
  constructor(x, y, w, dragStep, incrStep, successPerc, start) {
    super(x, y, w, 40);

    start = start || 50;
    this.maxWidth = w;
    this.barWidth = start * w / 100;
    this.successWidth = this.maxWidth * successPerc / 100;
    this.dragStep = dragStep;
    this.bgColor = '#666';
    this.fgColor = 'yellow';
    this.active = true;
    this.lowStep = incrStep - (incrStep * 0.2);
    this.highStep = incrStep = (incrStep * 0.2);
  }

  incr() {
    this.barWidth = clamp(this.barWidth + rndi(this.lowStep, this.highStep), 0, this.maxWidth);
  }

  isOk() {
    return this.barWidth >= this.successWidth;
  }

  isComplete() {
    return this.barWidth >= 98 * this.maxWidth / 100;
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

  render(r) {
    $.ctx.save();
    $.ctx.fillStyle = '#333';
    $.ctx.fillRoundRect(r.x - 20, r.y - 20, this.w + 40, this.h + 40, 30);

    $.ctx.save();
    $.ctx.fillStyle = this.bgColor;
    $.ctx.fillRect(r.x, r.y, this.maxWidth, this.h);
    $.ctx.fillStyle = 'rgba(9, 179, 0, 0.4)';
    $.ctx.fillRect(r.x + this.successWidth, r.y, this.maxWidth - this.successWidth, this.h);

    // Draw mark
    //$.ctx.strokeStyle = '#000';
    //$.ctx.lineWidth = 4;
    //$.ctx.moveTo(r.x + this.successWidth, r.y);
    //$.ctx.lineTo(r.x + this.successWidth, r.y + this.h);
    //$.ctx.stroke();

    // Draw moving bar
    $.ctx.fillStyle = this.fgColor;
    $.ctx.fillRect(r.x, r.y, this.barWidth, this.h);
    $.ctx.restore();
  }
}
