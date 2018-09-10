class BaseScene extends Scene {
  constructor(title, subtitle, maxTimer) {
    super();

    this.title = new Title(-600, 300, 120, title, 40);
    this.subtitle = new Title(-600, 300, 160, subtitle, 25);
    this.processed = false;
    this.maxTimer = (maxTimer) ? maxTimer : 5000;
    this.maxTimer += (this.title.delay * 2) + this.title.showTime / 2;
    this.timer = this.maxTimer;
  }

  updateProgress() {
    this.title.update(this.deltaTime);
    this.subtitle.update(this.deltaTime);
    if (this.ending) {
      this.ending.update(this.deltaTime);
      if (this.ending.status === 'done') {
        this.ended();
      }
    }

    if (!this.processed) {
      this.timer -= this.deltaTime;
      if (this.timer <= 0) {
        this.finish();
        this.processed = true;
      }
    }
  }

  renderProgress() {
    this.title.render();
    this.subtitle.render();

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

    if (this.ending) {
      this.ending.render();
    }
  }

  endingMessage(failed) {
    let msg, bg, posX;

    if (failed) {
      msg = 'REPAIR FAILED!';
      bg = 'red';
      posX = 160
    } else {
      msg = 'REPAIR SUCCESSFUL!';
      bg = 'green';
      posX = 100;
    }
    this.ending = new Title(-1200, posX, 260, msg, 80, '#fff', bg);
  }

  // To be overridden by child class
  finish() {
  }

  ended() {
  }
}

class Title extends Vector {
  constructor(origX, destX, y, text, size, color, bg) {
    super(origX, y);
    color = color || '#333';
    this.origX = origX;
    this.destX = destX;
    this.text = text;
    this.font = new TextRenderer('monospace', color, size);
    this.status = 'in';
    this.elapsed = 0;
    this.delay = 300;
    this.showTime = 1700;
    this.active = false;
    this.bg = bg;
  }

  update(dt) {
    this.elapsed += dt;

    let x;
    if (this.status === 'in') {
      x = $.easeInQuad(this.elapsed, this.origX, this.destX, this.delay);
      if (x >= this.destX) {
        this.elapsed = 0;
        x = this.destX;
        this.status = 'wait';
      }
      this.x = x;
    } else if (this.status === 'wait' && this.elapsed >= this.showTime) {
      this.elapsed = 0;
      this.status = 'out';
    } else if (this.status === 'out') {
      x = $.easeInQuad(this.elapsed, this.destX, this.origX, this.delay);
      if (x <= this.origX) {
        this.elapsed = 0;
        x = this.origX;
        this.status = 'done';
      }
      this.x = x;
    }
  }

  render() {
    if (this.bg) {
      $.ctx.save();
      $.ctx.fillStyle = this.bg;
      $.ctx.fillRect(this.x - this.destX, this.y - 100, $.vw, 160);
      $.ctx.restore();
    }
    this.font.render($.ctx, this.text, this.x, this.y);
  }
}
