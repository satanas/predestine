class MenuScene extends Scene {
  constructor() {
    super();
    this.speed = 300;
    this.titleY = 100;
    this.transition = false;
    this.intro = 0;
    this.startBtn = new StartButton(0, 400, this.goTo.bind(this));
    this.font = new TextRenderer('monospace', '#fff', 50);
  }

  startTransition() {
    this.transition = true;
  }

  goTo() {
    $.scenemng.load(LevelSelectionScene);
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
    }
  }

  render() {
    $.cam.clear('#060608');


    if (this.intro) {
      this.intro.render();
    } else {
      this.font.render($.ctx, 'PLANETARY MISSION', 240, this.titleY);
      $.cam.render(this.startBtn);
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
    //$.txt.render($.ctx, 'START', rect.x + 58, rect.y + 16, '#fff', 16);
    $.ctx.restore();
  }
}

class Mountains {
  constructor(points) {
    this.points = points

    this.canvas = $.canvas.create($.vw, $.vh);
    this.ctx = this.canvas.getContext('2d');

    //181715
    this.ctx.fillStyle = '#473a41';

  }
}
