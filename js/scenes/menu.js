class MenuScene extends Scene {
  constructor() {
    super();
    this.speed = 300;
    this.titleY = 56;
    this.transition = false;
    this.intro = 0;
    this.startBtn = new StartButton(0, 400, () => { this.startTransition(); });
  }

  startTransition() {
    this.transition = true;
  }

  goTo() {
    $.scenemng.load(new ProgrammingScene());
  }

  update() {
    if (this.transition) {
      this.startBtn.y += this.speed * this.deltaTime / 1000;
      this.titleY -= this.speed * this.deltaTime / 1000;
      if (this.startBtn.y > $.vh && this.titleY <= 0) {
        this.transition = false;
        this.goTo();
        //this.intro = new IntroDialog();
      }
    } else if (this.intro) {
      this.intro.update(this.deltaTime);
    } else {
      this.startBtn.checkClick();
    }
  }

  render() {
    $.cam.clear('#000');

    if (this.intro) {
      this.intro.render();
    } else {
      $.txt.render($.ctx, 'Planetary Mission', 140, this.titleY, '#fff', 32);
      $.cam.render(this.startBtn);
    }
  }
}

class IntroDialog {
  constructor() {
    this.index = 0;
    this.alpha = 0;
    this.baseY = 30;
    this.dialog = new Animator([
      'Part 1 of the intro',
      'Part 2 of the intro',
      'Part 3 of the intro'
    ], 2000);
  }

  update(dt) {
    this.dialog.update(dt);
  }

  render() {
    let i;
    for (i = 0; i < this.dialog.frame; i++) {
      $.txt.render($.ctx, this.dialog.imgArr[i], 10, this.baseY * i, '#fff', 20);
    }
  }
}

class StartButton extends UIButton {
  constructor(x, y, cb) {
    super(x, y, 210, 60);
    this.x = ($.vw - this.w) / 2;
    this.cb = cb;
  }

  onClick() {
    this.cb();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = 'purple';
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.txt.render($.ctx, 'START', rect.x + 58, rect.y + 16, '#fff', 16);
    $.ctx.restore();
  }
}

class Mountains extends Sprite {
  constructor(points) {
    this.points = points
  }
}
