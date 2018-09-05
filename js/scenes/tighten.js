class TightenScene extends BaseScene {
  constructor() {
    super();
    this.wrench = new Wrench();
    let barWidth = 700,
        x = ($.vw - barWidth) / 2,
        dragStep = 50,
        incrStep = 25;
    this.gauge = new Gauge(x, 500, barWidth, dragStep, incrStep, 80, 30);

    D.body.addEventListener('mousedown', this.tighten.bind(this));
  }

  tighten() {
    this.gauge.incr();
    this.wrench.tighten();
  }

  update() {
    this.updateProgress();
    this.gauge.update(this.deltaTime);
  }

  render() {
    $.cam.clear('#a3ffed');
    this.renderProgress();
    this.wrench.render();
    $.cam.render(this.gauge);
  }

  finish() {
    console.log(this.gauge.isDone());
  }
}

class Wrench {
  constructor() {
    let nutSize = 64;

    this.nut = new Rectangle(50, (150 - 64) / 2, nutSize, nutSize);
    this.y = 100;
    this.w = 400;
    this.h = 150;
    this.x = ($.vw - (nutSize * 2)) / 2;

    this.angle = 0;
    this.maxAngle = PI / 2;
    this.factor = PI / 24;
    this.dir = 1;
    this.canvas = $.canvas.create(this.w, this.h);
    this.ctx = this.canvas.getContext('2d');
    this.renderWrench(this.ctx, nutSize);
  }

  tighten() {
    this.angle += this.factor * this.dir;

    if (this.angle >= this.maxAngle) {
      this.angle = this.maxAngle;
      this.dir = -1;
    } else if (this.angle <= 0) {
      this.angle = 0;
      this.dir = 1;
    }
  }

  renderWrench(ctx, size) {
    ctx.fillStyle = '#333';
    ctx.arc(this.nut.center().x + 32, this.nut.center().y, 60, 0, 2 * PI, false);
    ctx.arc(360, this.nut.center().y, (size - 12) / 2, 0, 2 * PI, false);
    ctx.fill();
    ctx.fillRect(this.nut.center().x + 32, this.nut.y + 6, 250, this.nut.h - 12);
    ctx.fillStyle = '#ccc';
    ctx.fillRect(this.nut.x, this.nut.y, this.nut.w, this.nut.h);
  }

  render() {
    $.ctx.save()
    $.ctx.translate(this.x + this.nut.center().x, this.y + this.nut.center().y);
    $.ctx.rotate(this.angle);
    $.ctx.drawImage(this.canvas, -this.nut.center().x, -this.nut.center().y, this.w, this.h);
    $.ctx.setTransform(1, 0, 0, 1, 0, 0);
    $.ctx.restore();
  }
}

class Gauge extends Sprite {
  constructor(x, y, w, dragStep, incrStep, successPerc, start) {
    super(x, y, w, 40);

    start = start || 50;
    this.maxWidth = w;
    this.barWidth = start * w / 100;
    this.successWidth = this.maxWidth * successPerc / 100;
    this.incrStep = incrStep;
    this.dragStep = dragStep;
  }

  incr() {
    this.barWidth += rndi(this.incrStep - 10, this.incrStep + 10);
  }

  isDone() {
    return this.barWidth >= this.successWidth;
  }

  update(dt) {
    this.barWidth -= this.dragStep * dt / 1000;

    if (this.barWidth >= this.maxWidth) {
      this.barWidth = this.maxWidth;
    } else if (this.barWidth <= 0) {
      this.barWidth = 0;
    }
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = '#666';
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
    $.ctx.fillStyle = 'yellow';
    $.ctx.fillRect(this.x, this.y, this.barWidth, this.h);
    $.ctx.restore();
  }
}
