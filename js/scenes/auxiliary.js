class AuxiliaryScene extends Scene {
  constructor() {
    super();

    let i;
    this.buttons = [];
    this.colors = ['blue', 'red', 'purple', 'green'];
    for (i = 0; i < this.colors.length; i++) {
      this.buttons.push(new KeyButton(i, this.colors[i], this.addSeq.bind(this)));
    }
    this.realSeq = [0, 1, 2, 3];
    this.realSeq = this.realSeq.concat([rndi(0, this.buttons.length - 1)]);
    this.realSeq = this.realSeq.concat([rndi(0, this.buttons.length - 1)]);
    this.realSeq = shuffle(this.realSeq);

    this.indicators = new Group();
    for (i = 0; i < this.realSeq.length; i++) {
      this.indicators.add(new Indicator(i, this.realSeq[i], this.colors));
    }
    this.textFont = new TextRenderer('monospace', '#000', 18);
    this.titleFont = new TextRenderer('monospace', '#000', 30);

    this.userSeq = [];
    this.activated = false;
    this.delayTime = 1200;
  }

  addSeq(index) {
    this.userSeq.push(index);

    let i, valid = true;
    // Validate input
    for (i = 0; i < this.userSeq.length; i++) {
      if (this.userSeq[i] === this.realSeq[i]) {
        this.indicators.at(i).done = true;
      } else {
        this.userSeq = [];
        valid = false;
        break;
      }
    }

    if (valid) {
      if (this.userSeq.length === this.realSeq.length && !this.activated) {
        this.activated = true;
      }
    } else {
      for (i = 0; i < this.indicators.length; i++) {
        this.indicators.at(i).done = false;
      }
      $.cam.shake(4, 100);
    }
  }

  update() {
    $.cam.update(this.deltaTime);

    if (this.activated && this.deltaTime > 0) {
      this.delayTime -= this.deltaTime;
      if (this.delayTime <= 0) {
        $.data.level += 1;
        $.scenemng.load(TerminalScene)
      }
    }
  }

  render() {
    $.cam.clear('#999');

    this.textFont.render($.ctx, 'Validate that you are a human. Decipher the activation code', 160, 80);

    $.ctx.fillStyle = '#bbb';
    $.ctx.fillRect(120, 200, 750, 100);
    $.ctx.strokeStyle = '#666';
    $.ctx.strokeRect(120, 200, 750, 100);
    $.cam.render(this.indicators);

    if (this.activated) {
      $.ctx.fillStyle = '#0f0';
      $.ctx.fillRect(160, 400, 680, 80);
      this.titleFont.render($.ctx, 'AUXILIARY CONTROL ACTIVATED', 245, 450);
    } else {
      this.titleFont.render($.ctx, 'SEQUENCE:', 120, 180);
      for (let i = 0; i < this.buttons.length; i++) {
        $.cam.render(this.buttons[i]);
      }
    }
  }
}

class Indicator extends Sprite {
  constructor(index, value, colors) {
    let w = 80,
        y = 240,
        padding = 32,
        margin = floor(($.vw - (w + padding) * 6) / 2);
    super(margin + (index * padding) + (index * w), y, w, 20);
    this.index = index;
    this.value = value; // The real value within the sequence
    this.colors = colors;
    this.font = new TextRenderer('monospace', rnda(this.colors), 15);
    this.text = this.colors[this.value];
    this.done = false;
  }

  render(r) {
    let cx = (this.w - (this.text.length * 9)) / 2;
    $.ctx.save();

    if (this.done) {
      $.ctx.fillStyle = '#0f0';
      $.ctx.fillRect(r.x, r.y, this.w, this.h);
    } else {
      $.ctx.fillStyle = '#ddd';
      $.ctx.strokeStyle = '#666';
      $.ctx.fillRect(r.x, r.y, this.w, this.h);
      $.ctx.strokeRect(r.x, r.y, this.w, this.h);
      this.font.render($.ctx, this.text, r.x + cx, r.y + 14);
    }
    $.ctx.restore();
  }
}

class KeyButton extends UIButton {
  constructor(i, color, cb) {
    let w = 96,
        y = 380,
        padding = 60,
        margin = floor(($.vw - (w + padding) * 4) / 2);

    super(margin + (i * padding) + (i * w), y, w, w);

    this.index = i;
    this.cb = cb;
    this.color = color;
  }

  onClick() {
    this.cb(this.index);
  }

  render(r) {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    $.ctx.fillRect(r.x, r.y, this.w, this.h);
    $.ctx.restore();
  }
}
