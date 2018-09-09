class LevelSelectionScene extends Scene {
  constructor() {
    super();

    this.padding = 5;
    this.topMargin = 30;

    this.map = new ShipMap(600, 350);
    this.auxCtrlBtn = new AuxCtrlBtn();
    this.aeros = new Aeros();

    if ($.data.level === 0) {
      this.auxCtrlBtn.active = true;
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
      this.aeros.speak([
        [
          'The status of the spaceship is critical and survival',
          'chances are minimal with 10% of power remaining.',
        ],
        [
          'Two courses of action possible: repair the ultracomm',
          'to request a rescue operation and wait or repair the',
          'escape pod and try to reach Andromeda.',
        ],
        [
          'Choose the course of action by selecting the blinking',
          'area on the screen.'
        ]
      ]);
    }
  }

  update() {
    this.aeros.update(this.deltaTime);
    this.auxCtrlBtn.update(this.deltaTime);
  }

  render() {
    $.cam.clear('#00405c');

    $.ctx.save();
    $.ctx.fillStyle = 'black';
    $.ctx.fillRect(this.padding, this.topMargin, $.vw - (this.padding * 2), $.vh - (this.topMargin + this.padding));
    $.ctx.restore();

    // Start rendering objects here

    $.cam.render(this.auxCtrlBtn);
    this.aeros.render();

    $.ctx.drawImage(this.map.canvas, this.map.x, this.map.y, this.map.w, this.map.h);
    $.ctx.drawImage(this.aeros.canvas, this.aeros.x, this.aeros.y, this.aeros.w, this.aeros.h);
  }
}

class AuxCtrlBtn extends UIButton {
  constructor() {
    super(60, 60, 64, 48);
    this.anim = new Animator([0, 1], 200);
    this.active = false;
  }

  onClick() {
    $.scenemng.load(AuxiliaryScene);
  }

  update(dt) {
    this.anim.update(dt);
  }

  render() {
    if (this.active) {
      if (this.anim.get()) {
        $.ctx.fillStyle = 'white';
        $.ctx.fillRect(this.x, this.y, this.w, this.h);
      }
    } else {
      $.ctx.fillStyle = 'gray';
      $.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
  }
}

class UltraCommBtn extends UIButton {
  constructor() {
    super(60, 60, 64, 48);
    this.anim = new Animator([0, 1], 200);
    this.active = false;
  }

  onClick() {
    $.scenemng.load(AuxiliaryScene);
  }

  update(dt) {
    this.anim.update(dt);
  }

  render() {
    if (this.active) {
      if (this.anim.get()) {
        $.ctx.fillStyle = 'white';
        $.ctx.fillRect(this.x, this.y, this.w, this.h);
      }
    } else {
      $.ctx.fillStyle = 'gray';
      $.ctx.fillRect(this.x, this.y, this.w, this.h);
    }
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
