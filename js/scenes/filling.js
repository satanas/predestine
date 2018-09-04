class FillingScene extends BaseScene {
  constructor() {
    super();

    D.body.addEventListener('mousedown', this.togglePaint.bind(this, true));
    D.body.addEventListener('mouseup', this.togglePaint.bind(this, false));
    D.body.addEventListener('mousemove', this.doPaint.bind(this));

    this.painting = false;
    this.percSuccess = 80;
    this.color = [255, 0, 0, 255];

    this.pad = new Pad(this.percSuccess, this.color);

    $.ctx.lineWidth = 20;

    // Render everything only once to allow painting over
    $.cam.clear('#444');
    $.cam.render(this.pad);
  }

  togglePaint(val) {
    this.painting = val;
    this.lastPos = $.input.mousePos;
  }

  doPaint() {
    if (this.painting) {
      let mousePos = $.input.mousePos;
      $.ctx.save();
      $.ctx.fillStyle = 'red';
      $.ctx.strokeStyle = 'red';
      $.ctx.beginPath();
      $.ctx.moveTo(this.lastPos.x, this.lastPos.y);
      $.ctx.lineTo(mousePos.x, mousePos.y);
      $.ctx.stroke();
      $.ctx.arc(mousePos.x, mousePos.y, 10, 0, 2 * PI, false);
      $.ctx.fill();
      $.ctx.restore();
      this.lastPos = mousePos;
    }
  }

  update() {
    this.updateProgress();
  }

  render() {
    this.renderProgress();
  }

  finish() {
    this.pad.isCovered();
  }
}

class Pad extends Sprite {
  constructor(percSuccess, color) {
    let x = rndi(100, 900),
        y = rndi(100, 400);
    super(x, y, 120, 120);
    this.percSuccess = percSuccess;
    this.color = color;
  }

  isCovered() {
    let i, r, g, b, a, perc,
        totalPx = 0,
        totalCovered = 0,
        imgData = $.ctx.getImageData(this.x, this.y, this.w, this.h),
        data = imgData.data;
    for (i = 0; i < data.length; i += 4) {
      r = data[i];
      g = data[i + 1];
      b = data[i + 2];
      a = data[i + 3];
      totalPx += 1;
      if (r === this.color[0] && g === this.color[1] && b === this.color[2] && a === this.color[3]) {
        totalCovered += 1;
      }
    }
    perc = totalCovered * 100 / totalPx;
    console.log(perc, perc >= this.percSuccess);
    return perc >= this.percSuccess;
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = '#deb887';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore();
  }
}
