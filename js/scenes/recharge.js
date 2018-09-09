class RechargeScene extends BaseScene {
  constructor() {
    super('Recharge the Oxypack unit', TAP_FAST + 'recharge');
    let barWidth = 700,
        x = ($.vw - barWidth) / 2,
        dragStep = 50,
        incrStep = 25;
    this.gauge = new Gauge(x, 500, barWidth, dragStep, incrStep, 80, 30);
    this.gauge.fgColor = 'lightblue';

    $.events.listen('mousedown', this.recharge.bind(this));
  }

  recharge() {
    this.gauge.incr();
  }

  update() {
    this.updateProgress();
    this.gauge.update(this.deltaTime);
  }

  render() {
    $.cam.clear('#a3ffed');
    this.renderProgress();
    $.cam.render(this.gauge);
  }

  finish() {
    console.log(this.gauge.isDone());
  }
}
