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
      ],
      [
        'This is a second line of text',
        'And thid is a third?'
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
    super(x, 600, w, h);

    this.canvas = $.canvas.create(w, h);
    this.ctx = this.canvas.getContext('2d');

    this.titleFont = new TextRenderer('monospace', '#fff', 20);
    this.textFont = new TextRenderer('monospace', '#fff', 16);
    this.anim = new Animator([0, 1], 200);

    // Transition stuff
    this.showed = false;
    this.movingIn = false;
    this.movingOut = false;
    this.destY = 420;
    this.origY = 600;
    this.elapsed = 0;
    this.transitionDelay = 400;

    this.dialog = [];
    this.currLine = 0;
    this.lineIndex = 0;
    this.printing = false;
    this.printTime = 100;
    this.printCounter = 0;

    $.listen(this, 'mousedown');
  }

  mousedown(e) {
    if (this.showed) {
      if (this.dialog.length > 0) {
        this.printing = true;
        this.lineIndex = 0;
        this.printCounter = 0;
        this.currLine = this.dialog.pop();
      } else {
        this.elapsed = 0;
        this.movingOut = true;
      }
    }
  }

  speak(d) {
    if (!this.showed) {
      this.movingIn = true;
      this.elapsed = 0;
    }
    this.dialog = d.reverse();
  }

  update(dt) {
    this.anim.update(dt);

    if (this.movingIn) {
      this.elapsed += dt;
      let y = easeInQuad(this.elapsed, this.origY, this.destY, this.transitionDelay);
      console.log(y);
      if (y <= this.destY) {
        y = this.destY;
        this.movingIn = false;
        this.showed = true;
      }
      this.y = y;
    } else if (this.movingOut) {
      this.elapsed += dt;
      let y = easeInQuad(this.elapsed, this.destY, this.origY, this.transitionDelay);
      console.log(y);
      if (y >= this.origY) {
        y = this.origY;
        this.movingOut = false;
        this.showed = false;
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

function easeInQuad(elapsed, begin, end, duration) {
  elapsed = elapsed / duration;
  return (end - begin) * pow(elapsed, 2) + begin;
}

function easeOutQuad(elapsed, begin, end, duration) {
  elapsed = elapsed / duration;
  return (end + begin) * elapsed * (elapsed - 2) + begin;
}

