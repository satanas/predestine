class FillingScene extends Scene {
  constructor() {
    super();

    D.body.addEventListener('mousedown', this.togglePaint.bind(this, true));
    D.body.addEventListener('mouseup', this.togglePaint.bind(this, false));
    D.body.addEventListener('mousemove', this.doPaint.bind(this));

    this.painting = false;

    this.maxTimer = 5000;
    this.timer = this.maxTimer;

    $.ctx.lineWidth = 20;
    $.cam.clear('#444');
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
    this.timer -= this.deltaTime;
  }

  render() {
    $.ctx.save();
    // Render progress bar bg
    $.ctx.fillStyle = '#444';
    $.ctx.fillRect(0, 0, $.vw, 20);
    $.ctx.fillStyle = 'rgba(55,255,0,0.2)';
    $.ctx.fillRect(0, 0, $.vw, 20);

    // Render progress bar fg
    let w = this.timer * $.vw / this.maxTimer;
    $.ctx.fillStyle = 'rgba(55,255,0,0.5)';
    $.ctx.fillRect(0, 0, w, 20);

    $.ctx.restore();
  }
}
