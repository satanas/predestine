class RechargeScene extends BaseScene {
  constructor() {
    super('Recharge Oxypack', 'Click rapidly to recharge');
    let barWidth = 700,
        x = ($.vw - barWidth) / 2,
        dragStep = ($.data.level === 1) ? 18 : 25,
        incrStep = 30;
    console.log('dragStep', dragStep, 'incrStep', incrStep);
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
