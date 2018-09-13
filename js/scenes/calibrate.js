class CalibrateScene extends BaseScene {
  constructor() {
    let title, speed = 1200;
    if ($.data.branch === 1) {
      title = 'Calibrate Ultracomm';
    } else if ($.data.branch === 2) {
      title = 'Calibrate Engine';
    }
    super(title, 'Press button when bar reaches maximum', 6000, 330);
    this.meter = new Meter(speed, 80);
    this.button = new TurnOnButton(() => { this.meter.turnOn(); });
  }

  update() {
    this.updateProgress();
    this.meter.update(this.deltaTime);
    $.cam.update(this.deltaTime);

    if (this.meter.isOk() && !this.processed) {
      this.processed = true;
      this.finish();
    }
  }

  render() {
    $.cam.clear('#deb887');
    $.cam.render(this.meter);
    $.cam.render(this.button);

    this.renderProgress();
  }

  finish() {
    if (this.meter.isOk()) {
      this.endingMessage(0);
    } else {
      this.endingMessage(1);
    }
  }

  ended() {
    if (this.meter.isOk()) {
      if ($.data.branch === 1) {
        $.scenemng.load(TightenScene);
      } else {
        $.scenemng.load(FillingScene);
      }
    } else {
      $.scenemng.load(CalibrateScene);
    }
  }
}

class Meter extends Sprite {
  constructor(speed, perc, successRate) {
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
    this.successRate = 60;

    this.num = 5;
  }

  turnOn() {
    if (this.isEnabled() && !this.count) {
      this.count = true;
      this.successes += 1;
    } else {
      $.cam.shake(4, 100);
    }
  }

  isOk() {
    return this.successes >= this.num;
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

  render(r) {
    $.ctx.save();

    // Draw meter indicators
    let i, color, box = 200, w = 30, margin = (box - w) / 2;
    for (i = 0; i < this.num; i++) {
      color = (this.successes >= i + 1) ? '#0f0' : '#555';
      $.ctx.fillStyle = color;
      $.ctx.fillRect(r.x + (i * 160) + margin, r.y + 160, w, 20);
    }

    $.ctx.fillStyle = '#ccc';
    $.ctx.fillRect(r.x, r.y, this.w, this.h);
    $.ctx.fillStyle = '#666';
    $.ctx.fillRect(r.x + this.bar.x, r.y + this.bar.y, this.maxWidth, this.bar.h);
    $.ctx.fillStyle = 'rgba(9, 179, 0, 0.4)';
    $.ctx.fillRect(r.x + this.bar.x + this.successWidth, r.y + this.bar.y, this.maxWidth - this.successWidth, this.bar.h);

    // Draw moving bar
    $.ctx.fillStyle = 'red';
    $.ctx.fillRect(r.x + this.bar.x, r.y + this.bar.y, this.bar.w, this.bar.h);
    $.ctx.restore();
  }
}

class TurnOnButton extends UIButton {
  constructor(cb) {
    let w = 96;
    super(($.vw - w) / 2, $.vh - (w * 2), w, w);
    this.cb = cb;
  }

  onClick() {
    this.cb();
  }

  render(r) {
    let cx = r.x + this.w / 2,
        cy = r.y + this.h / 2,
        radius1 = this.w / 2,
        radius2 = floor(this.w / 1.5);

    $.ctx.save();

    $.ctx.fillStyle = '#666';
    $.ctx.fillArc($.ctx, cx, cy + 55, radius2, 0, PI * 2);

    $.ctx.fillStyle = '#888';
    $.ctx.fillArc($.ctx, cx, cy + 45, radius2, 0, PI * 2);

    $.ctx.fillStyle = 'darkgreen';
    $.ctx.fillRect(r.x, r.y + 55, this.w, 45);
    $.ctx.fillArc($.ctx, cx, cy + 45, radius1, 0, PI * 2);

    $.ctx.fillStyle = 'green';
    $.ctx.fillArc($.ctx, cx, cy, radius1, 0, PI * 2);
    $.ctx.restore();
  }
}
