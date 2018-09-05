class TightenScene extends BaseScene {
  constructor() {
    super();
    this.wrench = new Wrench();
  }

  update() {
    this.updateProgress();
  }

  render() {
    $.cam.clear('#a3ffed');
    this.renderProgress();
    this.wrench.render();
  }
}

class Wrench {
  constructor() {
    let nutSize = 64;

    this.nut = new Rectangle(50, (150 - 64) / 2, nutSize, nutSize);
    this.y = 100;
    this.w = 400;
    this.h = 150;
    this.x = ($.vw - this.w) / 2;

    this.canvas = $.canvas.create(this.w, this.h);
    this.ctx = this.canvas.getContext('2d');
    this.renderWrench(this.ctx, nutSize);
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
    //$.ctx.translate(this.x + this.nut.center().x, this.y + this.nut.center().y);
    $.ctx.translate(this.x + this.nut.center().x, this.y + this.nut.center().y);
    $.ctx.rotate(PI / 6);
    $.ctx.drawImage(this.canvas, -this.nut.center().x, -this.nut.center().y, this.w, this.h);
    $.ctx.setTransform(1, 0, 0, 1, 0, 0);
    $.ctx.restore();
  }
}
