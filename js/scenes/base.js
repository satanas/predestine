class BaseScene extends Scene {
  constructor(maxTimer) {
    super();

    this.processed = false;
    this.maxTimer = maxTimer || 5000;
    this.timer = this.maxTimer;
  }

  updateProgress() {
    this.timer -= this.deltaTime;
    if (this.timer <= 0 && !this.processed) {
      this.finish();
      this.processed = true;
    }
  }

  renderProgress() {
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

  // To be overridden by child class
  finish() {
  }
}
