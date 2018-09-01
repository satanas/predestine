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

    this.programPanel = new ProgramPanel();
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
    $.cam.clear('#000');

    // Program memory panel
    $.ctx.drawImage(this.programPanel.canvas, 0, 0, this.programPanel.w, this.programPanel.h);
    // Level preview
    $.ctx.drawImage(this.levelPreview.canvas, this.levelPreview.x, this.levelPreview.y, this.levelPreview.w, this.levelPreview.h);

    $.ctx.save();
    $.ctx.strokeStyle = '#fff';
    for (let j = 0; j < 25; j++) {
      $.ctx.strokeRect(5, 32 + (j * 20), 144, 20);
      $.ctx.strokeRect(152, 32 + (j * 20), 144, 20);
    }
    $.ctx.restore();

    //for(let x = 0; x <= w / scaledGrid; x++) {
    //  ctx.fillRect(130 + floor(x * scaledGrid), 50, 1, h);
    //}
    //for(let y = 0; y <= h / scaledGrid; y++) {
    //  ctx.fillRect(130, 50 + (y * scaledGrid), w, 1);
    //}
    //--------
    for(let i = 0; i < this.program.length; i++) {
      let op = this.program[i];
      $.txt.render($.ctx, '0x' + (HEX_BASE + i).toString(16) + ': ' + op, 8, 47 + (20 * i), '#fff', 12);
    }

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
    super(offset, 5, w, h);

    this.canvas = $.canvas.create(w, h);

    ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(410, 370);
    ctx.lineTo(210, 370);
    ctx.lineTo(202, 378);
    ctx.lineTo(25, 378);
    ctx.lineTo(10, 365);
    ctx.lineTo(10, 120);
    ctx.lineTo(1, 110);
    ctx.lineTo(1, 10);
    ctx.lineTo(10, 1);
    ctx.lineTo(250, 1);
    ctx.lineTo(250, 30);
    ctx.lineTo(550, 30);
    ctx.lineTo(550, 1);
    ctx.lineTo(660, 1);
    ctx.lineTo(670, 10);
    ctx.lineTo(670, 180);
    ctx.lineTo(660, 190);
    ctx.lineTo(660, 355);
    ctx.lineTo(652, 366);
    ctx.lineTo(510, 366);

    ctx.moveTo(670, 220);
    ctx.lineTo(670, 368);
    ctx.lineTo(660, 378);
    ctx.lineTo(500, 378);
    ctx.lineTo(480, 358);
    ctx.lineTo(360, 358);

    ctx.stroke();

    // Rendering level preview (radar mode)
    w = 510;
    h = 288;

    ctx.fillStyle = 'hsla(125,100%,53%,0.16)';
    ctx.fillRect(130, 50, w, h);

    scaledGrid = w / ($.vw / GRID);
    ctx.fillStyle = '#fff';
    for(let x = 0; x <= w / scaledGrid; x++) {
      ctx.fillRect(130 + floor(x * scaledGrid), 50, 1, h);
    }
    for(let y = 0; y <= h / scaledGrid; y++) {
      ctx.fillRect(130, 50 + (y * scaledGrid), w, 1);
    }

    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    for (w of level.walls) {
      ctx.fillRect(130 + w[0] * scaledGrid, 50 + w[1] * scaledGrid, scaledGrid, scaledGrid);
    }
    ctx.fillStyle = '#00f';
    for (w of level.repair) {
      ctx.fillRect(130 + w[0] * scaledGrid, 50 + w[1] * scaledGrid, scaledGrid, scaledGrid);
    }
    ctx.fillStyle = 'red';
    ctx.fillRect(130 + level.dock[0] * scaledGrid, 50 + level.dock[1] * scaledGrid, scaledGrid, scaledGrid);
    ctx.fillStyle = 'green';
    ctx.fillRect(130 + level.exit[0] * scaledGrid, 50 + level.exit[1] * scaledGrid, scaledGrid, scaledGrid);
  }
}

class ProgramPanel extends Sprite {
  constructor() {
    let ctx;
    super(0, 0, 300, 576);

    this.canvas = $.canvas.create(this.w, this.h);

    ctx = this.canvas.getContext('2d');
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, this.w, this.h);

    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(2, 30);
    ctx.lineTo(2, 564);
    ctx.lineTo(10, 572);
    ctx.lineTo(290, 572);
    ctx.lineTo(300, 562);
    ctx.lineTo(300, 30);
    ctx.lineTo(220, 30);
    ctx.stroke();

    ctx.fillStyle = '#0f0';
    ctx.beginPath();
    ctx.moveTo(221, 31);
    ctx.lineTo(201, 1);
    ctx.lineTo(1, 1);
    ctx.lineTo(1, 31);
    ctx.lineTo(221, 31);
    ctx.fill();

    $.txt.render(ctx, 'Program Memory', 10, 20, '#fff', 20);
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
    $.ctx.restore();

    $.txt.render($.ctx, this.instruction, rect.x + 40, rect.y + 8, '#fff', 6);
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
    $.txt.render($.ctx, 'X', rect.x + 4, rect.y + 4, '#fff', 6);
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
    $.txt.render($.ctx, 'Add instruction', rect.x + 40, rect.y + 8, '#fff', 6);
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
    $.txt.render($.ctx, 'RUN', rect.x + 12, rect.y + 16, '#fff', 6);
    $.ctx.restore();
  }
}
