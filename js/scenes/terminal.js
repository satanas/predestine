class TerminalScene extends Scene {
  constructor() {
    super();
    this.output = [
      ['Emergency power source', 0],
      ['Auxiliary control panel', 0],
      ['Power generator', 0],
      ['Oxypack system', 0],
      ['Nuclear engines', 0],
      ['Fuel tanks', 0],
      ['Ultracomm emitter', 0],
      ['Navigation system', 0],
      ['Cryotex chambers', 0],
      ['Escape pods', 0],
    ];
    if ($.data.level === 1) {
      this.output[0][1] = 1;
      this.output[1][1] = 1;
    }
    if ($.data.branch === 1) {
      if ($.data.level === 2) {
        this.output[3][1] = 1;
      }
    } else if ($.data.branch === 2) {
    }
    this.booting = [
      ['AEROS ROM Operating System', 0],
      ['Copyright 2412 by Hyper-Tec', 0],
      ['', 0],
      ['Exec Version 23.93', 0],
      ['', 0],
      ['Initializing...', 0],
      ['Loading neural network', 100],
      ['Loading FxD-6 module', 0],
      ['Loading quantic matrix', 0],
      ['Loading hyperspacial sensors', 0],
      ['', 0],
      ['Analyzing ship status...', 400],
      ['', 0],
    ];
    this.padding = 5;
    this.topMargin = 30;
    this.prompt = new Prompt(10, this.topMargin + this.padding);
    this.maxCharTime = 15;
    this.charTime = 0;
    this.lineHeight = 18;
    this.charWidth = 10;
    this.lineIndex = 0;
    this.charIndex = 0;
    this.font = new TextRenderer("monospace", "#0f0", 16);
    this.rFont = new TextRenderer("monospace", "#f00", 16);
    this.booted = false;
    this.analyzed = false;

    $.events.listen('mousedown', this.next.bind(this));
  }

  next() {
    if (this.analyzed) {
      $.scenemng.load(LevelSelectionScene);
    } else {
      this.booted = true;
      this.analyzed = true;
    }
  }

  update() {
    let i, text;
    if (!this.booted) {
      this.charTime -= this.deltaTime;

      if (this.charTime <= 0) {
        this.charIndex += 1;
        this.charTime = this.getCharDelay();

        if (this.charIndex > this.booting[this.lineIndex][0].length) {
          this.charIndex = 0
          this.lineIndex += 1;
          if (this.lineIndex > this.booting.length - 1) {
            this.booted = true;
            this.lineIndex = 0;
            // Delay during analyzing phase
            this.charTime = 1000;
          }
        }
      }
    }

    if (this.booted && !this.analyzed) {
      this.charTime -= this.deltaTime;

      if (this.charTime <= 0) {
        this.lineIndex += 1;
        this.charTime = 200;
        if (this.lineIndex > this.output.length - 1) {
          this.analyzed = true;
        }
      }
    }

    this.prompt.update(this.deltaTime);
  }

  getCharDelay() {
    if (this.charIndex === this.booting[this.lineIndex][0].length) {
      let delay = this.booting[this.lineIndex][1];
      return (delay) ? delay : this.maxCharTime;
    }
    return this.maxCharTime;
  }

  getPartialText(index) {
    let i, text = '';
    for (i = 0; i < this.charIndex; i++) {
      text += this.booting[index][0].charAt(i);
    }
    return text;
  }

  render() {
    $.cam.clear('#00405c');

    $.ctx.save();
    $.ctx.fillStyle = 'black';
    $.ctx.fillRect(this.padding, this.topMargin, $.vw - (this.padding * 2), $.vh - (this.topMargin + this.padding));
    $.ctx.restore();

    let i, lineY, lineX, txt;
    for (i = 0; i < this.booting.length; i++) {
      lineY = this.topMargin + this.padding + (this.lineHeight * (i + 1));
      if (i < this.lineIndex || this.booted) {
        this.font.render($.ctx, this.booting[i][0], this.padding * 2, lineY);
      } else if (i === this.lineIndex) {
        this.prompt.x = this.padding + (this.charIndex * this.charWidth) + 5;
        this.prompt.y = lineY - 14;
        this.font.render($.ctx, this.getPartialText(i), this.padding * 2, lineY);
      }
    }

    if (this.booted) {
      lineX = 300;
      for (i = 0; i < this.output.length; i++) {
        if (i < this.lineIndex || this.analyzed) {
          txt = this.output[i][0];
          lineY = this.topMargin + this.padding + (this.lineHeight * (this.booting.length + i + 1));
          this.prompt.x = this.padding * 2; //lineX + 90;
          this.prompt.y = lineY + this.lineHeight - 14;
          this.font.render($.ctx, txt, this.padding * 2, lineY);

          if (this.output[i][1]) {
            this.font.render($.ctx, '[ONLINE]', lineX, lineY);
          } else {
            this.rFont.render($.ctx, '[OFFLINE]', lineX, lineY);
          }
        }
      }
    }

    if (this.analyzed) {
      lineY = this.topMargin + this.padding + (this.lineHeight * (this.booting.length + this.output.length + 4));
      this.prompt.x = 245;
      this.prompt.y = lineY - 14;
      this.font.render($.ctx, 'Touch screen to continue', this.padding * 2, lineY);
    }

    $.cam.render(this.prompt);
  }
}

class Prompt extends Sprite {
  constructor(x, y) {
    super(x, y, 8, 14);
    this.blinkTime = 250;
    this.blinkCounter = 0;
  }

  update(dt) {
    this.blinkCounter -= dt;
    if (this.blinkCounter <= 0) {
      this.blinkCounter = this.blinkTime;
      this.enabled = !this.enabled;
    }
  }

  render(r) {
    $.ctx.save();
    $.ctx.fillStyle = '#0f0';
    $.ctx.fillRect(r.x, r.y, this.w, this.h);
    $.ctx.restore();
  }
}
