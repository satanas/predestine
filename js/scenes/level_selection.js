class LevelSelectionScene extends Scene {
  constructor() {
    super();

    this.padding = 5;
    this.topMargin = 30;

    this.aeros = new Aeros();
  }

  render() {
    $.cam.clear('#00405c');

    $.ctx.save();
    $.ctx.fillStyle = 'black';
    $.ctx.fillRect(this.padding, this.topMargin, $.vw - (this.padding * 2), $.vh - (this.topMargin + this.padding));
    $.ctx.restore();

    $.cam.render(this.aeros);
    $.ctx.drawImage(this.aeros.canvas, this.aeros.x, this.aeros.y, this.aeros.w, this.aeros.h);
  }
}

class Aeros extends Sprite {
  constructor() {
    let w = 700,
        h = 120,
        x = ($.vw - w) / 2;
    super(x, 400, w, h);

    this.canvas = $.canvas.create(w, h);
    this.ctx = this.canvas.getContext('2d');
  }

  render(r) {
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    this.ctx.fillRect(r.x, r.y, this.w, this.h);
  }
}
