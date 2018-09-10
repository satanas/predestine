class RechargeScene extends BaseScene {
  constructor() {
    super('Recharge Oxypack', TAP_FAST + 'recharge');
    let barWidth = 700,
        x = ($.vw - barWidth) / 2,
        dragStep = ($.data.level === 2) ? 38 : 50,
        incrStep = 25;
    this.gauge = new Gauge(x, 300, barWidth, dragStep, incrStep, 80, 30);
    this.gauge.fgColor = 'lightblue';

    $.events.listen('mousedown', this.recharge.bind(this));
  }

  recharge() {
    if (!this.processed) {
      this.gauge.incr();
    }
  }

  update() {
    this.updateProgress();
    this.gauge.update(this.deltaTime);
    if (this.gauge.isComplete() && !this.processed) {
      this.processed = true;
      this.finish();
    }
  }

  render() {
    $.cam.clear('#a3ffed');
    $.ctx.save();
    $.ctx.fillStyle = '#333';
    $.ctx.fillRoundRect(this.gauge.x - 20, this. gauge.y - 20, this.gauge.w + 40, this.gauge.h + 40, 30);
    $.ctx.restore();
    $.cam.render(this.gauge);

    this.renderProgress();
  }

  finish() {
    this.gauge.active = false;
    if (this.gauge.isOk()) {
      this.endingMessage(0);
    } else {
      this.endingMessage(1);
    }
  }

  ended() {
    if (this.gauge.isOk()) {
      $.data.level += 1;
      $.scenemng.load(TerminalScene);
    } else {
      $.scenemng.load(RechargeScene);
    }
  }
}
