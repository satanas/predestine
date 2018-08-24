HEX_BASE = 32512;

class ProgrammingScene extends Scene {
  constructor() {
    super();
    this.instructions = [FW, FW, TR, FW, FW, TL, RP];
    this.addBtn = new AddButton(20, 10);
  }

  update() {
    this.addBtn.update();
  }

  render() {
    $.cam.clear('#444');

    $.ctx.save();
    $.ctx.fillStyle = '#ccc';
    $.ctx.fillRect(0, 0, 256, 576);
    $.ctx.restore();

    $.txt.render('Program Memory', 20, 10, '#fff', 10);

    for(let i = 0; i < this.instructions.length; i++) {
      let op = '';
      if (this.instructions[i] === FW) {
        op = 'Move forward';
      } else if (this.instructions[i] === TR) {
        op = 'Turn right';
      } else if (this.instructions[i] === TL) {
        op = 'Turn left';
      } else if (this.instructions[i] === RP) {
        op = 'Repair';
      }
      $.txt.render('0x' + (HEX_BASE + i).toString(16) + ': ' + op, 20, 40 + (20 * i), '#fff', 7);
    }
    let yCoord = 50 + (20 * this.instructions.length);
    this.addBtn.y = yCoord;

    $.cam.render(this.addBtn);
  }
}

class AddButton extends Sprite {
  constructor(x, y) {
    super(x, y, 210, 25);
    this.pressed = false;
    D.body.addEventListener('mouseup', this.releaseClick.bind(this));
  }

  update() {
    this.bounds.update(this);

    if (!this.pressed) {
      if ($.input.isLeftClick() && $.collision.vector($.input.mousePos, this)) {
        this.pressed = true;
      }
    }
  }

  releaseClick() {
    this.pressed = false;
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'red';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.txt.render('Add instruction', rect.x + 40, rect.y + 8, '#fff', 6);
    $.ctx.restore();
  }
}
