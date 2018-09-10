class RechargeScene extends BaseScene {
  constructor() {
    super('Recharge Oxypacks', TAP_FAST + 'recharge');
    let barWidth = 700,
        x = ($.vw - barWidth) / 2,
        dragStep = 50,
        incrStep = 25;
    this.gauge = new Gauge(x, 500, barWidth, dragStep, incrStep, 80, 30);
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
    this.renderProgress();
    $.cam.render(this.gauge);
  }

  finish() {
    this.gauge.active = false;
    if (this.gauge.isOk()) {
      this.endingMessage(0);
    } else {
      this.endingMessage(1);
    }
  }
}
