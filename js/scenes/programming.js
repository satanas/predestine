HEX_BASE = 32512;

class ProgrammingScene extends Scene {
  constructor() {
    super();
    this.program = [ACTIONS.FW, ACTIONS.FW, ACTIONS.FW, ACTIONS.RP, ACTIONS.TL, ACTIONS.FW, ACTIONS.FW, ACTIONS.FW];
    //this.program = [];
    this.instPanel = new InstructionsPanel(240, 40);
    this.instPanel.enabled = false;
    this.addBtn = new AddButton(20, 0, () => { this.instPanel.enabled = true; });
    this.runBtn = new RunButton(950, 500, () => { this.runProgram(); });
    this.btnGroup = new Group();

    this.levelPreview = new LevelPreview(350, $.data.level);

    $.listen(this, 'addInstruction');
    $.listen(this, 'remInstruction');
  }

  addInstruction(ev) {
    this.program.push(ev.detail.inst);
    this.instPanel.enabled = false;
    this.rebuildDeleteButtons();
  }

  remInstruction(ev) {
    this.program.splice(ev.detail.index, 1);
    this.rebuildDeleteButtons();
  }

  rebuildDeleteButtons() {
    this.btnGroup.clear();
    for(let i = 0; i < this.program.length; i++) {
      this.btnGroup.add(new DelButton(210, 16 + (20 * i), i));
    }
  }

  runProgram() {
    if (this.program.length === 0) {
      alert('You cannot run an empty program');
      return;
    }
    $.data.program = this.program;
    $.scenemng.load(new GameScene());
  }

  update() {
    let yCoord = 50 + (20 * this.program.length);
    this.addBtn.y = yCoord;
    this.addBtn.checkClick();
    this.runBtn.checkClick();

    this.btnGroup.all().map((btn, i) => {
      btn.y = 36 + (20 * i);
    });
    this.btnGroup.update();
    this.instPanel.update();
  }

  render() {
    $.cam.clear('#444');

    $.ctx.save();
    $.ctx.fillStyle = '#ccc';
    $.ctx.fillRect(0, 0, 256, 576);
    $.ctx.restore();

    $.txt.render('Program Memory', 20, 10, '#fff', 10);

    for(let i = 0; i < this.program.length; i++) {
      let op = this.program[i];
      $.txt.render('0x' + (HEX_BASE + i).toString(16) + ': ' + op, 20, 40 + (20 * i), '#fff', 7);
    }

    // Level preview
    $.ctx.drawImage(this.levelPreview.canvas, this.levelPreview.x, this.levelPreview.y, this.levelPreview.w, this.levelPreview.h);

    $.cam.render(this.addBtn);
    $.cam.render(this.runBtn);
    $.cam.render(this.btnGroup);
    $.cam.render(this.instPanel);
  }
}

class LevelPreview extends Rectangle {
  constructor(offset, level) {
    let ctx,
        w = $.vw - offset,
        h = w * $.vh / $.vw,
        scaledGrid = w / ($.vw / GRID);
    super(offset, 0, w, h);

    this.canvas = $.canvas.create(w, h);

    ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.w, this.h);
    ctx.fillStyle = '#fff';

    for(let x = 0; x < this.w / scaledGrid; x++) {
      if (x === 0) continue;
      ctx.fillRect(floor(x * scaledGrid), 0, 1, this.h);
    }
    for(let y = 0; y <= this.h / scaledGrid; y++) {
      if (y === 0) continue;
      ctx.fillRect(0, y * scaledGrid, this.w, 1);
    }

    ctx.fillStyle = '#fff';
    for (w of level.walls) {
      ctx.fillRect(w[0] * scaledGrid, w[1] * scaledGrid, scaledGrid, scaledGrid);
    }
    ctx.fillStyle = '#00f';
    for (w of level.repair) {
      ctx.fillRect(w[0] * scaledGrid, w[1] * scaledGrid, scaledGrid, scaledGrid);
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(level.dock[0] * scaledGrid, level.dock[1] * scaledGrid, scaledGrid, scaledGrid);
    ctx.fillStyle = 'green';
    ctx.fillRect(level.exit[0] * scaledGrid, level.exit[1] * scaledGrid, scaledGrid, scaledGrid);
  }
}

class InstructionsPanel extends Sprite {
  constructor(x, y, cb) {
    super(x, y, 200, 400);
    this.btnGroup = new Group();
    let i = 0, a;
    // TODO: Use map?
    for(let a in ACTIONS) {
      this.btnGroup.add(new InstructionButton(x + 10, y + 10 + (i * 30), ACTIONS[a]));
      i++;
    }
  }

  update() {
    this.btnGroup.update();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = '#999';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore();

    $.cam.render(this.btnGroup);
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

class DelButton extends UIButton {
  constructor(x, y, i) {
    super(x, y, 16, 16);
    this.index = i;
  }

  onClick() {
    //console.log('removing', this.index);
    $.emit('remInstruction', {index: this.index});
  }

  update() {
    this.checkClick();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'red';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.txt.render('X', rect.x + 4, rect.y + 4, '#fff', 6);
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

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'purple';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.txt.render('Add instruction', rect.x + 40, rect.y + 8, '#fff', 6);
    $.ctx.restore();
  }
}

class RunButton extends UIButton {
  constructor(x, y, cb) {
    super(x, y, 48, 48);
    this.cb = cb;
  }

  onClick() {
    this.cb();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'green';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.txt.render('RUN', rect.x + 12, rect.y + 16, '#fff', 6);
    $.ctx.restore();
  }
}
