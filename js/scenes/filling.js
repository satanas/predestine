class FillingScene extends BaseScene {
  constructor() {
    let title;
    if ($.data.branch === 1) {
      title = 'Weld the Ultracomm';
    } else {
      title = 'Weld the Engine';
    }
    super(title, 'Click and hold to draw on screen', 10000);

    $.events.listen('mousedown', this.togglePaint.bind(this, true));
    $.events.listen('mouseup', this.togglePaint.bind(this, false));
    $.events.listen('mousemove', this.doPaint.bind(this));

    this.painting = false;
    this.color = [255, 0, 0, 255];
    this.canvas = $.canvas.create($.vw, $.vh);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'red';
    this.ctx.strokeStyle = 'red';
    this.ctx.lineWidth = 20;

    this.pad = new Pad(94, this.color);
  }

  togglePaint(val) {
    if (this.processed) return;

    this.painting = val;
    this.lastPos = $.input.mousePos;
  }

  doPaint() {
    if (this.painting && !this.processed) {
      let mousePos = $.input.mousePos;
      this.ctx.beginPath();
      this.ctx.moveTo(this.lastPos.x, this.lastPos.y);
      this.ctx.lineTo(mousePos.x, mousePos.y);
      this.ctx.stroke();
      this.ctx.arc(mousePos.x, mousePos.y, 10, 0, 2 * PI, false);
      this.ctx.fill();
      this.lastPos = mousePos;
    }
  }

  update() {
    this.updateProgress();

    if (this.pad.isCovered(this.ctx) && !this.processed) {
      this.processed = true;
      this.finish();
    }
  }

  render() {
    $.cam.clear('#fff8dc');
    $.cam.render(this.pad);
    $.ctx.drawImage(this.canvas, 0, 0, $.vw, $.vh);
    this.renderProgress();
  }

  finish() {
    if (this.pad.isCovered(this.ctx)) {
      this.endingMessage(0);
    } else {
      this.endingMessage(1);
    }
  }

  ended() {
    if (this.pad.isCovered(this.ctx)) {
      $.data.level += 1;
      $.scenemng.load(TerminalScene);
    } else {
      $.scenemng.load(FillingScene);
    }
  }
}

class Pad extends Sprite {
  constructor(percSuccess, color) {
    let x = rndi(100, 900),
        y = rndi(100, 400);
    super(x, y, 160, 160);
    this.percSuccess = percSuccess;
    this.color = color;
  }

  isCovered(ctx) {
    let i, r, g, b, a, perc,
        totalPx = 0,
        totalCovered = 0,
        imgData = ctx.getImageData(this.x, this.y, this.w, this.h),
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
    return perc >= this.percSuccess;
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = '#deb887';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore();
  }
}
