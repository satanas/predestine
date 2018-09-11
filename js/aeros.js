class Aeros extends UIButton {
  constructor() {
    let w = 700,
        h = 120,
        x = ($.vw - w) / 2;
    super(x, 600, w, h);

    this.canvas = $.canvas.create(w, h);
    this.ctx = this.canvas.getContext('2d');

    this.titleFont = new TextRenderer('monospace', '#fff', 20);
    this.textFont = new TextRenderer('monospace', '#fff', 16);
    this.subFont = new TextRenderer('monospace', '#fff', 9);
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
    this.lineIndex = -1;
    this.printing = false;
    this.printTime = 300;
    this.printCounter = 0;
  }

  onClick() {
    if (this.showed) {
      if (this.dialog.length > 0) {
        this.printing = true;
        this.lineIndex = -1;
        this.printCounter = 0;
        this.currLine = this.dialog.pop();
      }
    }
  }

  speak(d) {
    if (!this.showed) {
      this.movingIn = true;
      this.elapsed = 0;
    }
    this.dialog = d.reverse();
    this.currLine = 0;
    this.lineIndex = -1;
  }

  update(dt) {
    this.anim.update(dt);

    if (this.movingIn) {
      this.elapsed += dt;
      let y = $.easeInQuad(this.elapsed, this.origY, this.destY, this.transitionDelay);
      if (y <= this.destY) {
        y = this.destY;
        this.movingIn = false;
        this.showed = true;
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

    if (this.dialog.length > 0) {
      this.subFont.render(this.ctx, 'CLICK', this.w - 33, this.h - 35);
    }

    if (this.anim.get() && this.dialog.length > 0) {
      this.ctx.fillStyle = '#fff';
      this.ctx.beginPath();
      this.ctx.moveTo(this.w - 30, this.h - 30);
      this.ctx.lineTo(this.w - 10, this.h - 30);
      this.ctx.lineTo(this.w - 20, this.h - 10);
      this.ctx.lineTo(this.w - 30, this.h - 30);
      this.ctx.fill();
    } else if (this.dialog.length === 0) {
      this.ctx.fillStyle = '#fff';
      this.ctx.fillRect(this.w - 30, this.h - 30, 20, 20);
    }
  }
}
