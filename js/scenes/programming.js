HEX_BASE = 32512;

class ProgrammingScene extends Scene {
  constructor() {
    super();
    this.instructions = [ACTIONS.FW, ACTIONS.FW, ACTIONS.TR, ACTIONS.FW, ACTIONS.FW, ACTIONS.TL, ACTIONS.RP];
    this.instPanel = new InstructionsPanel(240, 40);
    this.instPanel.enabled = false;
    this.addBtn = new AddButton(20, 0, () => { this.instPanel.enabled = true; });
    $.listen(this, 'addInstruction');
  }

  addInstruction(ev) {
    this.instructions.push(ev.detail.inst);
    this.instPanel.enabled = false;
  }

  update() {
    let yCoord = 50 + (20 * this.instructions.length);
    this.addBtn.setPos({y: yCoord});
    this.addBtn.update();
    this.instPanel.update();
  }

  render() {
    $.cam.clear('#444');

    $.ctx.save();
    $.ctx.fillStyle = '#ccc';
    $.ctx.fillRect(0, 0, 256, 576);
    $.ctx.restore();

    $.txt.render('Program Memory', 20, 10, '#fff', 10);

    for(let i = 0; i < this.instructions.length; i++) {
      let op = this.instructions[i];
      $.txt.render('0x' + (HEX_BASE + i).toString(16) + ': ' + op, 20, 40 + (20 * i), '#fff', 7);
    }

    $.cam.render(this.addBtn);
    $.cam.render(this.instPanel);
  }
}

class InstructionsPanel extends Sprite {
  constructor(x, y, cb) {
    super(x, y, 200, 400);
    this.fwBtn = new InstructionButton(x + 10, y + 10, ACTIONS.FW);
    this.bwBtn = new InstructionButton(x + 10, y + 40, ACTIONS.BW);
  }

  update() {
    this.fwBtn.update();
    this.bwBtn.update();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = '#999';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore();

    $.cam.render(this.fwBtn);
    $.cam.render(this.bwBtn);
  }
}

class InstructionButton extends UIButton {
  constructor(x, y, instruction) {
    super(x, y, 180, 25);
    this.instruction = instruction;
  }

  onClick() {
    $.emit('addInstruction', {inst: this.instruction});
  }

  update() {
    this.checkClick();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'green';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.txt.render(this.instruction, rect.x + 40, rect.y + 8, '#fff', 6);
    $.ctx.restore();
  }
}

class AddButton extends UIButton {
  constructor(x, y, cb) {
    super(x, y, 210, 25);
    this.cb = cb;
  }

  onClick() {
    this.cb();
  }

  update() {
    this.checkClick();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'red';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.txt.render('Add instruction', rect.x + 40, rect.y + 8, '#fff', 6);
    $.ctx.restore();
  }
}
