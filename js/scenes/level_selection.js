class LevelSelectionScene extends Scene {
  constructor() {
    super();

    this.padding = 5;
    this.topMargin = 30;
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

    $.cam.render(this.auxCtrlBtn);
    $.cam.render(this.aeros);

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
