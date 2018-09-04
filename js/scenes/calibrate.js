class CalibrateScene extends Scene {
  constructor() {
    super();

    this.meter = new Meter(800, 80);
  }

  update() {
    this.meter.update(this.deltaTime);
  }

  render() {
    $.cam.clear('brown');
    $.cam.render(this.meter);
  }
}

class Meter extends Sprite {
  constructor(speed, perc) {
    super(112, 100, 800, 150);
    this.speed = speed;
    this.dir = 1;
    this.bar = new Rectangle(50, 35, 0, 80);
    this.maxWidth = 700;
    this.successWidth = this.maxWidth * perc / 100;
  }

  update(dt) {
    this.bar.w += this.speed * dt / 1000 * this.dir;
    if (this.bar.w >= this.maxWidth) {
      this.bar.w = this.maxWidth;
      this.dir = -1;
    } else if (this.bar.w <= 0) {
      this.bar.w = 0;
      this.dir = 1;
    }
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = '#ccc';
    $.ctx.fillRect(this.x, this.y, this.w, this.h);
    $.ctx.fillStyle = '#666';
    $.ctx.fillRect(this.x + this.bar.x, this.y + this.bar.y, this.maxWidth, this.bar.h);
    $.ctx.fillStyle = 'rgba(9, 179, 0, 0.4)';
    $.ctx.fillRect(this.x + this.bar.x + this.successWidth, this.y + this.bar.y, this.maxWidth - this.successWidth, this.bar.h);

    // Draw mark
    $.ctx.strokeStyle = '#000';
    $.ctx.lineWidth = 4;
    $.ctx.moveTo(this.x + this.bar.x + this.successWidth, this.y + 15);
    $.ctx.lineTo(this.x + this.bar.x + this.successWidth, this.y + 135);
    $.ctx.stroke();

    // Draw moving bar
    $.ctx.fillStyle = 'red';
    $.ctx.fillRect(this.x + this.bar.x, this.y + this.bar.y, this.bar.w, this.bar.h);
    $.ctx.restore();
  }
}
