class CalibrateScene extends BaseScene {
  constructor() {
    super();
    this.meter = new Meter(1250, 80);
    this.button = new TurnOnButton(() => { this.meter.turnOn(); });
  }

  update() {
    this.updateProgress();
    this.meter.update(this.deltaTime);
    this.button.checkClick();
  }

  render() {
    $.cam.clear('brown');
    $.cam.render(this.meter);
    $.cam.render(this.button);

    this.renderProgress();
  }

  finish() {
    this.meter.isOn();
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
    this.tries = 0;
    this.successes = 0;
    this.tick = false;
    this.count = false;
  }

  turnOn() {
    if (this.isEnabled() && !this.count) {
      this.count = true;
      this.successes += 1;
    }
    console.log(this.tries, 'vs', this.successes);
  }

  isOn() {
    console.log('result', this.successes * 100 / this.tries);
    return this.successes * 100 / this.tries > 0.9;
  }

  isEnabled() {
    return this.bar.w >= this.successWidth;
  }

  update(dt) {
    this.bar.w += this.speed * dt / 1000 * this.dir;
    if (this.isEnabled() && !this.tick) {
      this.tries += 1;
      this.tick = true;
    }

    if (this.bar.w >= this.maxWidth) {
      this.bar.w = this.maxWidth;
      this.dir = -1;
    } else if (this.bar.w <= 0) {
      this.bar.w = 0;
      this.dir = 1;
      this.tick = false;
      this.count = false;
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

class TurnOnButton extends UIButton {
  constructor(cb) {
    let w = 160,
        h = 80;
    super(($.vw - w) / 2, $.vh - (h * 2), w, h);
    this.cb = cb;
  }

  onClick() {
    this.cb();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'green';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    //$.txt.render($.ctx, 'RUN', rect.x + 12, rect.y + 16, '#fff', 6);
    $.ctx.restore();
  }
}
