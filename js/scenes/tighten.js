class TightenScene extends BaseScene {
  constructor() {
    super('Adjust nuts', 'Click rapidly to move the wrench', 12000, 335);
    this.wrench = new Wrench();
    let barWidth = 700,
        x = ($.vw - barWidth) / 2,
        dragStep,
        incrStep;
    if ($.data.level === 3 && $.data.branch === 1) {
      incrStep = 20;
      dragStep = 10;
    } else {
      incrStep = 20;
      dragStep = 10;
    }
    this.gauge = new Gauge(x, 500, barWidth, dragStep, incrStep, 80, 30);

    $.events.listen('mousedown', this.tighten.bind(this));
  }

  tighten() {
    if (this.processed) return;

    this.gauge.incr();
    this.wrench.tighten();
  }

  update() {
    this.updateProgress();
    this.wrench.update(this.deltaTime);

    if (!this.processed) {
      this.gauge.update(this.deltaTime);
    }

    if (this.gauge.isComplete() && !this.processed) {
      this.processed = true;
      this.finish();
    }
  }

  render() {
    $.cam.clear('#a3ffed');
    this.wrench.render();
    $.cam.render(this.gauge);

    this.renderProgress();
  }

  finish() {
    if (this.gauge.isOk()) {
      this.endingMessage(0);
    } else {
      this.endingMessage(1);
    }
  }

  ended() {
    if (this.gauge.isOk()) {
      if ($.data.branch === 1) {
        $.scenemng.load(FillingScene);
      } else {
        $.scenemng.load(CalibrateScene);
      }
    } else {
      $.scenemng.load(TightenScene);
    }
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
    this.factor = PI / 25;

    this.dir = 1;
    this.canvas = $.canvas.create(this.w, this.h);
    this.ctx = this.canvas.getContext('2d');
    this.renderWrench(this.ctx, nutSize);

    this.maxSpeed = PI;
    this.speed = 0;
    this.maxCoolDown = 600;
    this.coolDown = 99999;
  }

  update(dt) {
    this.angle += this.speed * dt * this.dir / 1000;
    this.coolDown -= dt;
    if (this.coolDown <= 0) {
      this.speed = clamp(this.speed - this.factor / 2, 0);
    }

    if (this.angle >= this.maxAngle) {
      this.angle = this.maxAngle;
      this.dir = -1;
    } else if (this.angle <= 0) {
      this.angle = 0;
      this.dir = 1;
    }
  }

  tighten() {
    this.speed += this.factor;
    this.coolDown = this.maxCoolDown;
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
