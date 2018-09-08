class AuxiliaryScene extends Scene {
  constructor() {
    super();

    this.buttons = [
      new KeyButton(0, 'blue'),
      new KeyButton(1, 'red'),
      new KeyButton(2, 'green'),
      new KeyButton(3, 'yellow')
    ];
  }

  update() {
    for (let i = 0; i < this.buttons.length; i++) {
      this.buttons[i].checkClick();
    }
  }

  render() {
    $.cam.clear('#999');

    for (let i = 0; i < this.buttons.length; i++) {
      $.cam.render(this.buttons[i]);
    }
  }
}

class KeyButton extends UIButton {
  constructor(i, color) {
    let w = 96,
        x = 230 + (i * w) + (i * 60),
        y = 300;
    //if (i > 0) x += 20;

    super(x, y, w, w);

    this.color = color;
  }

  render() {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    $.ctx.fillRect(this.x, this.y, this.w, this.h);
    $.ctx.restore();
  }
}
