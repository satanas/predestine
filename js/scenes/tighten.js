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

    this.nut = new Rectangle(0, (150 - 64) / 2, nutSize, nutSize);

    this.canvas = $.canvas.create(150, 300);
    this.ctx = this.canvas.getContext('2d');
  }

  renderWrench() {
    this.ctx.fillStyle = '#ccc';
    this.ctx.fillRect(this.nut.x, this.nut.y, this.nut.w, this.nut.h);
  }

  render() {
    $.ctx.save()
    $.ctx.rotate(PI / 6);
    $.ctx.drawImage(this.canvas, 100, 100, 150, 300);
    $.ctx.setTransform(1, 0, 0, 1, 0, 0);
    $.ctx.restore();
  }
}
