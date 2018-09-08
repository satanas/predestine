class LevelSelectionScene extends Scene {
  constructor() {
    super();

    this.padding = 5;
    this.topMargin = 30;

    this.aeros = new Aeros();
    this.aeros.speak([
      [
        'Hello, Captain. The crash damaged 85% of our systems',
        'I\'m AEROS 9000',
      ]
    ]);
  }

  update() {
    this.aeros.update(this.deltaTime);
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

    // Transition stuff
    this.movingIn = true;
    this.destY = 420;
    this.origY = 600;
    this.elapsed = 0;
    this.titleFont = new TextRenderer('monospace', '#fff', 20);
    this.textFont = new TextRenderer('monospace', '#fff', 16);
    this.anim = new Animator([0, 1], 200);

    this.dialog = [];
    this.currLine = 0;
    this.lineIndex = 0;
    this.printing = false;
    this.printTime = 100;
    this.printCounter = 0;
  }

  speak(d) {
    this.dialog = d.reverse();
  }

  update(dt) {
    this.anim.update(dt);

    if (this.movingIn) {
      this.elapsed += dt;
      let y = easeInQuad(this.elapsed, this.origY, this.destY, 600);
      if (y <= this.destY) {
        y = this.destY;
        this.movingIn = false;
      }
      this.y = y;
    } else {
      if (!this.currLine && this.dialog.length > 0) {
        this.currLine = this.dialog.pop();
        this.printing = true;
      }

      if (this.currLine && this.printing) {
        this.printCounter += dt;
        if (this.printCounter >= this.printTime) {
          this.printCounter = 0;
          this.lineIndex += 1;
          if (this.lineIndex === this.currLine.length - 1) {
            this.printing = false;
          }
        }
      }
    }
  }

  render(r) {
    this.ctx.fillStyle = '#11478d';
    this.ctx.fillRect(0, 0, this.w, this.h);

    // Draw Aeros
    this.ctx.fillStyle = '#ccc';
    this.ctx.fillRect(10, 10, 100, 100);
    this.ctx.fillStyle = 'purple';
    this.ctx.beginPath();
    this.ctx.arc(60, 50, 20, 0, 2 * PI);
    this.ctx.fill();

    if (this.currLine) {
      this.titleFont.render(this.ctx, 'AEROS', 125, 25);
      for (let i = 0; i <= this.lineIndex; i++) {
        this.textFont.render(this.ctx, this.currLine[i], 125, 55 + (20 * i));
      }
    }

    if (this.anim.get()) {
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.moveTo(this.w - 30, this.h - 30);
      this.ctx.lineTo(this.w - 10, this.h - 30);
      this.ctx.lineTo(this.w - 20, this.h - 10);
      this.ctx.lineTo(this.w - 30, this.h - 30);
      this.ctx.fill();
    }
  }
}

function easeIn(elapsed, begin, end, duration) {
  return pow(t, 3) - (t * 0.3 * sin(t * PI));
}

function easeInQuad(elapsed, begin, end, duration) {
  elapsed = elapsed / duration;
  return (end - begin) * pow(elapsed, 2) + begin;
}

function easeOutQuad(elapsed, begin, end, duration) {
  elapsed = elapsed / duration;
  return -(end - begin) * elapsed * (elapsed - 2) + begin;
}

