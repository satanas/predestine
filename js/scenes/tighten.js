class TightenScene extends BaseScene {
  constructor() {
    super();
    this.pliers = new Pliers();
  }

  update() {
    this.updateProgress();
  }

  render() {
    $.cam.clear('#a3ffed');
    this.renderProgress();
    this.pliers.render();
  }
}

class Pliers {
  constructor() {
    let nutSize = 64;

    this.nut = new Rectangle(($.vw - nutSize) / 2, ($.vh - nutSize) / 2, nutSize, nutSize);
  }

  render() {
    $.ctx.save();
    $.ctx.fillStyle = '#ccc';
    $.ctx.fillRect(this.nut.x, this.nut.y, this.nut.w, this.nut.h);
    $.ctx.restore();
  }
}
