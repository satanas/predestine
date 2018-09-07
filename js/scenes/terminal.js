class TerminalScene extends Scene {
  constructor(output) {
    super();
    this.output = this.booting().concat(output || []);
    this.padding = 5;
    this.topMargin = 30;
    this.prompt = new Prompt(10, this.topMargin + this.padding);
    this.maxCharTime = 25;
    this.charTime = 0;
    this.lineHeight = 18;
    this.charWidth = 10;
    this.lineIndex = 0;
    this.charIndex = 0;
    this.font = new TextRenderer("monospace", "#0f0", 16);
    this.done = false;
  }

  booting() {
    return [
      ['AEROS ROM Operating System', 0],
      ['Copyright 2412 by Hyper-Tec', 0],
      ['', 0],
      ['Exec Version 23.93', 600],
      ['', 0],
      ['Loading FxD-6 module...', 0],
      ['', 0]
    ];
  }

  update() {
    let i, text;
    this.charTime -= this.deltaTime;
    if (this.charTime <= 0 && !this.done) {
      this.charTime = this.maxCharTime;
      this.charIndex += 1;
      if (this.charIndex > this.output[this.lineIndex][0].length) {
        this.charIndex = 0
        this.lineIndex += 1;
        if (this.lineIndex > this.output.length - 1) {
          //this.lineIndex = this.output.length - 1;
          this.done = true;
        }
      }
    }

    this.prompt.update(this.deltaTime);
  }

  getPartialText(index) {
    let i, text = '';
    for (i = 0; i < this.charIndex; i++) {
      text += this.output[index][0].charAt(i);
    }
    return text;
  }

  render() {
    //$.cam.clear('#382400');
    $.cam.clear('#00405c');

    $.ctx.save();
    $.ctx.fillStyle = 'black';
    $.ctx.fillRect(this.padding, this.topMargin, $.vw - (this.padding * 2), $.vh - (this.topMargin + this.padding));
    $.ctx.restore();

    let i, lineY;
    for (i = 0; i < this.output.length; i++) {
      lineY = this.topMargin + this.padding + (this.lineHeight * (i + 1));
      if (i < this.lineIndex || this.done) {
        this.font.render($.ctx, this.output[i][0], this.padding * 2, lineY);
      } else if (i === this.lineIndex) {
        this.prompt.x = this.padding + (this.charIndex * this.charWidth) + 5;
        this.prompt.y = lineY - 14;
        this.font.render($.ctx, this.getPartialText(i), this.padding * 2, lineY);
      }
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
