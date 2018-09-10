class LevelSelectionScene extends Scene {
  constructor() {
    super();

    this.padding = 5;
    this.topMargin = 30;

    this.layoutFont = new TextRenderer('monospace', '#aaa', 14);
    this.map = new ShipMap(600, 350);
    // Zone buttons
    this.zoneButtons = new Group();
    this.zoneButtons.add(new AuxCtrlBtn(this.layoutFont));
    this.zoneButtons.add(new UltraCommBtn(this.layoutFont, this.selectBranch1.bind(this)));
    this.zoneButtons.add(new EscapePodBtn(this.layoutFont));
    this.zoneButtons.add(new OxygenBtn(this.layoutFont));
    this.zoneButtons.add(new EngineBtn(this.layoutFont));
    this.zoneButtons.add(new CryoBtn(this.layoutFont));
    this.zoneButtons.add(new FuelBtn(this.layoutFont));

    this.aeros = new Aeros();

    if ($.data.level === 0) {
      this.zoneButtons.at(0).highlight = true;
      this.aeros.speak([
        //'Text length ---------------------------------------',
        [
          'Hello, Captain. The crash damaged most of our ship',
          'and 90% of the systems are offline.',
        ],
        [
          'We can attempt a reparation but I need you to activate',
          'the auxiliary control sequence, so I can run an overall',
          'diagnostic report.',
        ],
        [
          'Select the blinking area on the screen to start.'
        ]
      ]);
    } else if ($.data.level === 1) {
      this.zoneButtons.at(0).done = true;
      this.zoneButtons.at(1).highlight = true;
      this.zoneButtons.at(2).highlight = true;
      this.aeros.speak([
        [
          'The status of the spaceship is critical and survival',
          'chances are minimal with 10% of power remaining.',
        ],
        [
          'Two courses of action possible: repair the ultracomm',
          'to request a rescue operation or repair the escape',
          'pod and try to reach the Andromeda Space Station.',
        ],
        [
          'Choose the course of action by selecting the blinking',
          'area on the screen.'
        ]
      ]);
    }
  }

  selectBranch1() {
    $.data.branch = 1;
    this.zoneButtons.at(1).highlight = false;
    this.zoneButtons.at(2).highlight = false;
    this.zoneButtons.at(3).highlight = true;
    this.aeros.speak([
        [
          'Ok, you selected repairing the Ultracomm. First thing',
          'you need to do, is to recharge the Oxypack System to',
          're-establish the oxygen flow in the comm room'
        ],
        [
          'Select the OXY module on the screen to start.',
        ]
    ]);
  }

  update() {
    this.aeros.update(this.deltaTime);
    this.zoneButtons.update(this.deltaTime);
  }

  render() {
    $.cam.clear('#00405c');

    $.ctx.save();
    $.ctx.fillStyle = 'black';
    $.ctx.fillRect(this.padding, this.topMargin, $.vw - (this.padding * 2), $.vh - (this.topMargin + this.padding));
    $.ctx.restore();

    // Start rendering objects here

    this.aeros.render();

    $.ctx.drawImage(this.map.canvas, this.map.x, this.map.y, this.map.w, this.map.h);
    $.ctx.drawImage(this.aeros.canvas, this.aeros.x, this.aeros.y, this.aeros.w, this.aeros.h);

    $.cam.render(this.zoneButtons);
  }
}

class ZoneButton extends UIButton {
  constructor(x, y, w, h, text, font) {
    super(x, y, w, h);
    this.anim = new Animator([0, 1], 200);
    this.highlight = false;
    this.font = font;
    this.text = text;
    this.offset = new Vector((w - (this.font.width / 1.6 * this.text.length)) / 2, (h / 2) + 3);
  }

  update(dt) {
    this.anim.update(dt);
  }

  render() {
    $.ctx.save();
    if (this.highlight) {
      if (this.anim.get()) {
        $.ctx.fillStyle = 'white';
        $.ctx.fillRect(this.x, this.y, this.w, this.h);
      } else {
        $.ctx.strokeStyle = '#999';
        $.ctx.strokeRect(this.x, this.y, this.w, this.h);
      }
    } else if (!this.highlight && !this.done) {
      $.ctx.fillStyle = '#383838';
      $.ctx.fillRect(this.x, this.y, this.w, this.h);
    } else if (this.done) {
      $.ctx.fillStyle = '#187000';
      $.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
    $.ctx.restore();
    this.font.render($.ctx, this.text, this.x + this.offset.x, this.y + this.offset.y);
  }
}

class AuxCtrlBtn extends ZoneButton {
  constructor(font) {
    super(655, 200, 64, 48, 'AUX', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(AuxiliaryScene);
  }
}

class UltraCommBtn extends ZoneButton {
  constructor(font, cb) {
    super(410, 280, 90, 30, 'ULTRACOMM', font);
    this.cb = cb;
  }

  onClick() {
    if (!this.highlight) return;

    if ($.data.branch === 0) {
      this.cb();
    }
    //$.scenemng.load(ConnectScene);
  }
}

class EscapePodBtn extends ZoneButton {
  constructor(font) {
    super(500, 200, 48, 48, 'POD', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(AuxiliaryScene);
  }
}

class OxygenBtn extends ZoneButton {
  constructor(font) {
    super(430, 140, 64, 30, 'OXY', font);
  }

  onClick() {
    if (!this.highlight) return;

    if ($.data.level === 1 && $.data.branch === 1) {
      $.scenemng.load(RechargeScene);
    }
  }
}

class EngineBtn extends ZoneButton {
  constructor(font) {
    super(340, 193, 90, 64, 'ENGINE', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(AuxiliaryScene);
  }
}

class CryoBtn extends ZoneButton {
  constructor(font) {
    super(550, 192, 64, 64, 'CRYO', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(AuxiliaryScene);
  }
}

class FuelBtn extends ZoneButton {
  constructor(font) {
    super(280, 206, 50, 38, 'FUEL', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(AuxiliaryScene);
  }
}

class ShipMap extends Rectangle {
  constructor(w, h) {
    let x = ($.vw - w) / 2,
        y = 50;
    super(x, y, w, h);

    this.canvas = $.canvas.create(w, h);
    this.ctx = this.canvas.getContext('2d');

    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.w, this.h);

    this.ctx.strokeStyle = '#fff';
    this.ctx.beginPath();
    this.ctx.moveTo(505, 215);
    this.ctx.lineTo(310, 238);
    this.ctx.lineTo(285, 270);
    this.ctx.lineTo(250, 270);
    this.ctx.lineTo(130, 345);
    this.ctx.lineTo(44, 345);
    this.ctx.lineTo(88, 326);
    this.ctx.lineTo(121, 261);
    this.ctx.lineTo(94, 261);
    this.ctx.lineTo(94, 230);
    this.ctx.lineTo(140, 230);
    this.ctx.lineTo(148, 215);
    this.ctx.lineTo(123, 214);
    this.ctx.lineTo(123, 195);
    this.ctx.lineTo(65, 195);
    this.ctx.lineTo(65, 155);
    this.ctx.lineTo(123, 155);
    this.ctx.lineTo(123, 135);
    this.ctx.lineTo(148, 135);
    this.ctx.lineTo(140, 121);
    this.ctx.lineTo(94, 121);
    this.ctx.lineTo(94, 88);
    this.ctx.lineTo(122, 88);
    this.ctx.lineTo(88, 24);
    this.ctx.lineTo(44, 6);
    this.ctx.lineTo(132, 6);
    this.ctx.lineTo(250, 80);
    this.ctx.lineTo(284, 80);
    this.ctx.lineTo(310, 111);
    this.ctx.lineTo(505, 135);
    this.ctx.lineTo(540, 155);
    this.ctx.lineTo(540, 195);
    this.ctx.lineTo(505, 215);
    this.ctx.stroke();
  }
}
