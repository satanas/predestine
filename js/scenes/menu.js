class MenuScene extends Scene {
  constructor() {
    super();
    this.speed = 300;
    this.titleY = 100;
    this.transition = false;
    this.intro = 0;
    this.startBtn = new MenuButton(0, 380, 'Start', 'purple', this.goTo.bind(this));
    this.fullScreenBtn = new MenuButton(0, 480, 'Fullscreen', 'blue', goFullscreen);
    this.font = new TextRenderer('monospace', '#fff', 70);
    this.mountains = new Mountains();
  }

  startTransition() {
    this.transition = true;
  }

  goTo() {
    //$.scenemng.load(LevelSelectionScene);
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

    $.ctx.drawImage(this.mountains.canvas, 0, 0, $.vw, $.vh);

    if (this.intro) {
      this.intro.render();
    } else {
      this.font.render($.ctx, 'PLANETARY MISSION', 145, this.titleY);
      $.cam.render(this.startBtn);
      $.cam.render(this.fullScreenBtn);
    }
  }
}

class MenuButton extends UIButton {
  constructor(x, y, text, color, cb) {
    super(x, y, 210, 60);
    this.x = ($.vw - this.w) / 2;
    this.cb = cb;
    this.color = color || 'purple';
    this.text = text;
    this.font = new TextRenderer('monospace', '#fff', 30);
  }

  onClick() {
    this.cb();
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    this.font.render($.ctx, this.text, rect.x + (this.w - (18 * this.text.length)) / 2, rect.y + 38);
    $.ctx.restore();
  }
}

class Mountains {
  constructor() {
    this.canvas = $.canvas.create($.vw, $.vh);
    this.ctx = this.canvas.getContext('2d');

    //181715
    //this.ctx.fillStyle = '#473a41';
    // TODO: drawPoints method that receives an array of points
    this.ctx.fillStyle = '#171518';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 576);
    this.ctx.lineTo(159, 284);
    this.ctx.lineTo(195, 276);
    this.ctx.lineTo(214, 262);
    this.ctx.lineTo(242, 276);
    this.ctx.lineTo(304, 290);
    this.ctx.lineTo(355, 320);
    this.ctx.lineTo(423, 305);
    this.ctx.lineTo(497, 300);
    this.ctx.lineTo(564, 284);
    this.ctx.lineTo(638, 306);
    this.ctx.lineTo(750, 290);
    this.ctx.lineTo(821, 310);
    this.ctx.lineTo(911, 280);
    this.ctx.lineTo(943, 244);
    this.ctx.lineTo(986, 248);
    this.ctx.lineTo(1024, 264);
    this.ctx.lineTo(1024, 576);
    this.ctx.lineTo(0, 576);
    this.ctx.fill();

    this.ctx.fillStyle = '#253326';
    this.ctx.beginPath();
    this.ctx.moveTo(0, 576);
    this.ctx.lineTo(0, 326);
    this.ctx.lineTo(24, 333);
    this.ctx.lineTo(56, 316);
    this.ctx.lineTo(82, 284);
    this.ctx.lineTo(126, 273);
    this.ctx.lineTo(185, 290);
    this.ctx.lineTo(245, 326);
    this.ctx.lineTo(382, 369);
    this.ctx.lineTo(466, 373);
    this.ctx.lineTo(523, 353);
    this.ctx.lineTo(584, 365);
    this.ctx.lineTo(616, 347);
    this.ctx.lineTo(655, 361);
    this.ctx.lineTo(723, 350);
    this.ctx.lineTo(788, 376);
    this.ctx.lineTo(902, 352);
    this.ctx.lineTo(944, 324);
    this.ctx.lineTo(987, 333);
    this.ctx.lineTo(1024, 357);
    this.ctx.lineTo(1024, 576);
    this.ctx.lineTo(0, 576);
    this.ctx.fill();

  }
}
