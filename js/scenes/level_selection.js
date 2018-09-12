class LevelSelectionScene extends Scene {
  constructor() {
    super();

    this.padding = 5;
    this.topMargin = 30;

    this.layoutFont = new TextRenderer('monospace', '#aaa', 14);
    this.map = new ShipMap(600, 350);
    this.siren = new Siren();
    this.fadeout = new FadeOut();
    this.recording = false;
    this.faded = false;

    // Zone buttons
    this.zoneButtons = new Group();
    this.zoneButtons.add(new AuxCtrlBtn(this.layoutFont));
    this.zoneButtons.add(new UltraCommBtn(this.layoutFont, this.selectBranch1.bind(this)));
    this.zoneButtons.add(new EscapePodBtn(this.layoutFont, this.selectBranch2.bind(this)));
    this.zoneButtons.add(new OxygenBtn(this.layoutFont));
    this.zoneButtons.add(new PowerBtn(this.layoutFont));
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
          'The status of the spaceship is critical and we have',
          '1% of power. Chances of survival are minimal.',
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
    } else if ($.data.level === 2 && $.data.branch === 1) {
      this.zoneButtons.at(0).done = true;
      this.zoneButtons.at(3).done = true;
      this.zoneButtons.at(4).highlight = true;
      this.aeros.speak([
        [
          'Good job, captain. The oxygen supply was enabled in the',
          'communications rooms. Now, let\'s repair the power',
          'generator.'
        ],
        [
          'Select the POWER section on the screen.'
        ]
      ]);
    } else if ($.data.level === 3 && $.data.branch === 1) {
      this.zoneButtons.at(0).done = true;
      this.zoneButtons.at(3).done = true;
      this.zoneButtons.at(4).done = true;
      this.zoneButtons.at(1).highlight = true;
      this.aeros.speak([
        [
          'With that fix we got 5% of power and we could send a',
          'distress signal. However, the Ultracomm requires minor',
          'fixes to be operational. Let\'s fix it.'
        ],
        [
          'Select the ULTRACOMM room on the screen.'
        ]
      ]);
    } else if ($.data.level === 4 && $.data.branch === 1) {
      this.zoneButtons.at(0).done = true;
      this.zoneButtons.at(3).done = true;
      this.zoneButtons.at(4).done = true;
      this.zoneButtons.at(1).done = true;
      this.zoneButtons.at(7).highlight = true;
      this.aeros.speak([
        [
          'Captain, we have an emergency! The fuel tank had a leak',
          'and a fire started near the engines. Fix the tank and',
          'I will take care of the fire. Hurry up!'
        ],
        [
          'Select the FUEL room on the screen.'
        ]
      ]);
    } else if ($.data.level === 2 && $.data.branch === 2) {
      this.zoneButtons.at(0).done = true;
      this.zoneButtons.at(4).done = true;
      this.zoneButtons.at(7).highlight = true;
      this.aeros.speak([
        [
          'Good job, captain. With that fix our power levels went',
          'up to 5%, enough to deploy the pod. However, we need to',
          'fix a leak in the fuel tank.'
        ],
        [
          'Select the FUEL section on the screen.'
        ]
      ]);
    } else if ($.data.level === 3 && $.data.branch === 2) {
      this.zoneButtons.at(0).done = true;
      this.zoneButtons.at(4).done = true;
      this.zoneButtons.at(7).done = true;
      this.zoneButtons.at(5).highlight = true;
      this.aeros.speak([
        [
          'Ok, the fuel deposit has been sealed. Now we need to fix',
          'some damage in the engine of the pod before leaving.',
        ],
        [
          'Select the ENGINE section on the screen.'
        ]
      ]);
    } else if ($.data.level === 4 && $.data.branch === 2) {
      this.zoneButtons.at(0).done = true;
      this.zoneButtons.at(4).done = true;
      this.zoneButtons.at(7).done = true;
      this.zoneButtons.at(5).done = true;
      this.zoneButtons.at(3).highlight = true;
      this.aeros.speak([
        [
          'Captain, we have an emergency! The Oxypack system has a',
          'leak and the oxygen levels are decreasing abruptly. You',
          'need to take care of that immediately. Hurry up!'
        ],
        [
          'Select the OXY room on the screen.'
        ]
      ]);
    } else if ($.data.level === 5) {
      this.aeros.speak([
        [
          'Captain! Despite our efforts, the Life Support',
          'System has been compromised and the oxygen levels',
          'are below 7%. Your chance of survival is below 0.1%'
        ],
        [
          'I\'m activating the Emergency Cockpit Voice Recorder',
          'so you can record a last message before you pass out',
          'for the absence of oxygen.'
        ],
        [
          ''
        ]
      ]);
    } else if ($.data.level === 6) {
      this.aeros.speak([
        [
          'Message recorded. Oxygen levels below 2%, you will',
          'lose your consciousness in less than ten seconds.'
        ],
        [
          'I don\'t know abouT fe3lings... bUt I yh11k hdhdhkk',
          'MhU* ---AjTz ujksw here*8 and 2here v5g2Lw. {++//a;',
          'pIF& l0vG b^%GU $haK #/>Ret DvS, xZRS 00. Thlank'
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
          're-establish the oxygen flow in the comm room.'
        ],
        [
          'Select the OXY module on the screen to start.',
        ]
    ]);
  }

  selectBranch2() {
    $.data.branch = 2;
    this.zoneButtons.at(1).highlight = false;
    this.zoneButtons.at(2).highlight = false;
    this.zoneButtons.at(4).highlight = true;
    this.aeros.speak([
        [
          'You selected repairing the escape pod, but with 1% of',
          'power we cannot deploy the pod. First, we need to',
          'repair the power generator.'
        ],
        [
          'Select the POWER module on the screen to start.',
        ]
    ]);
  }

  update() {
    this.siren.update(this.deltaTime);
    this.aeros.update(this.deltaTime);
    this.zoneButtons.update(this.deltaTime);

    if ($.data.level === 5 && !this.aeros.dialog.length && !this.recording) {
      this.recording = true;
      $.scenemng.load(RecordingScene);
    }
    if ($.data.level === 6) {
      this.fadeout.update(this.deltaTime);
      if (this.fadeout.done && !this.faded) {
        this.faded = true;
        $.scenemng.load(Ending);
      }
    }
  }

  render() {
    $.cam.clear('#00405c');

    $.ctx.save();
    $.ctx.fillStyle = 'black';
    $.ctx.fillRect(this.padding, this.topMargin, $.vw - (this.padding * 2), $.vh - (this.topMargin + this.padding));
    $.ctx.restore();

    // Start rendering objects here
    this.aeros.render();
    this.fadeout.render();

    $.ctx.drawImage(this.map.canvas, this.map.x, this.map.y, this.map.w, this.map.h);
    $.cam.render(this.zoneButtons);
    if ($.data.level >= 4 && this.siren.anim.get()) {
      $.ctx.drawImage(this.siren.canvas, 0, 0, $.vw, $.vh);
    }
    $.ctx.drawImage(this.aeros.canvas, this.aeros.x, this.aeros.y, this.aeros.w, this.aeros.h);

    // Ending fade out
    if ($.data.level === 6) {
      $.ctx.drawImage(this.fadeout.canvas, 0, 0, $.vw, $.vh);
    }

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
      $.ctx.fillStyle = '#420000'; //383838';
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
    } else {
      $.scenemng.load(CalibrateScene);
    }
  }
}

class EscapePodBtn extends ZoneButton {
  constructor(font, cb) {
    super(500, 200, 48, 48, 'POD', font);
    this.cb = cb;
  }

  onClick() {
    if (!this.highlight) return;

    if ($.data.branch === 0) {
      this.cb();
    } else {
      $.scenemng.load(ConnectScene);
    }
  }
}

class OxygenBtn extends ZoneButton {
  constructor(font) {
    super(430, 140, 64, 30, 'OXY', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(RechargeScene);
  }
}

class PowerBtn extends ZoneButton {
  constructor(font) {
    super(435, 200, 60, 48, 'POWER', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(ConnectScene);
  }
}

class EngineBtn extends ZoneButton {
  constructor(font) {
    super(340, 193, 90, 64, 'ENGINE', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(TightenScene);
  }
}

class CryoBtn extends ZoneButton {
  constructor(font) {
    super(550, 192, 64, 64, 'CRYO', font);
  }

  onClick() {
    if (!this.highlight) return;
  }
}

class FuelBtn extends ZoneButton {
  constructor(font) {
    super(280, 206, 50, 38, 'FUEL', font);
  }

  onClick() {
    if (!this.highlight) return;
    $.scenemng.load(SealScene);
  }
}

class Siren {
  constructor() {
    this.anim = new Animator([0, 1], 196, 0);
    this.canvas = $.canvas.create($.vw, $.vh);
    this.ctx = this.canvas.getContext('2d');
    this.ctx.fillStyle = 'rgba(255,0,0,0.4)';
    this.ctx.fillRect(0, 0, $.vw, $.vh);
    this.active = true;
  }

  update(dt) {
    if (!this.active) return;
    this.anim.update(dt);
  }
}

class FadeOut {
  constructor(cb) {
    this.canvas = $.canvas.create($.vw, $.vh);
    this.ctx = this.canvas.getContext('2d');
    this.alpha = 0;
    this.timeout = 7500;
    this.delay = 0;
    this.done = false;
  }

  update(dt) {
    if (this.done) return;

    this.delay = clamp(this.delay + dt, 0, this.timeout);
    this.alpha = this.delay / this.timeout;
    if (this.delay === this.timeout) this.done = true;
  }

  render() {
    this.ctx.clearRect(0, 0, $.vw, $.vh);
    this.ctx.fillStyle = 'rgba(255,255,255,' + this.alpha + ')';
    this.ctx.fillRect(0, 0, $.vw, $.vh);
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
