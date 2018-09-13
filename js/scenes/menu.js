class MenuScene extends Scene {
  constructor() {
    super();
    this.speed = 300;
    this.titleY = 100;
    this.transition = false;
    this.startBtn = new MenuButton(0, 380, 'Start', 'purple', this.startTransition.bind(this));
    this.fullScreenBtn = new MenuButton(0, 480, 'Fullscreen', 'blue', goFullscreen);
    this.font = new TextRenderer('monospace', '#fff', 70);
    this.mountains = new Mountains();
    this.timeCounter = 5000;
    this.done = 0;
    this.ship = 0;

    this.explosions = new Group();
  }

  startTransition() {
    this.status = 'in';
  }

  update() {
    $.cam.update(this.deltaTime);
    this.explosions.update(this.deltaTime);

    if (this.status === 'in') {
      this.startBtn.y += this.speed * this.deltaTime / 1000;
      this.fullScreenBtn.y += this.speed * this.deltaTime / 1000;
      this.titleY -= this.speed * this.deltaTime / 1000;
      if (this.startBtn.y > $.vh && this.titleY <= 0) {
        this.status = 'crash';
      }
    } else if (this.status === 'crash') {
      this.ship = new Ship(this.explosions);
      this.status = 'delay';
    } else if (this.status === 'delay') {
      this.ship.update(this.deltaTime);
      this.timeCounter -= this.deltaTime;
      if (this.timeCounter <= 0 && !this.done) {
        this.done = 1;
        $.scenemng.load(LevelSelectionScene);
      }
    }
  }

  render() {
    $.cam.clear('#060608');

    $.ctx.drawImage(this.mountains.canvas, $.cam.offsetX, $.cam.offsetY, $.vw, $.vh);

    this.font.render($.ctx, 'PLANETARY MISSION', 145, this.titleY);
    $.cam.render(this.startBtn);

    if (!isFullscreen()) {
      $.cam.render(this.fullScreenBtn);
    }

    if (this.status === 'delay') {
      $.cam.render(this.ship);
    }
    $.cam.render(this.explosions);
  }
}

class Ship extends Sprite {
  constructor(grp) {
    super(1100, 176, 16, 8);
    this.destX = 135;
    this.destY = 476;
    this.speed = 500;
    this.angle = atan2((this.destY - this.y), (this.x - this.destX))
    this.crashed = false;
    this.expGrp = grp;
  }

  update(dt) {
    if (this.crashed) return;

    this.x -= this.speed * cos(this.angle) * dt / 1000;
    this.y += this.speed * sin(this.angle) * dt / 1000;

    this.x = clamp(this.x, this.destX);
    this.y = clamp(this.y, 0, this.destY);

    if (this.x === this.destX && this.y === this.destY) {
      this.crashed = true;
      this.expGrp.add(new Explosion(this));
      $.cam.shake(6, 200);
    }
  }

  render(r) {
    $.ctx.save();
    $.ctx.fillStyle = '#fff';
    $.ctx.beginPath();
    $.ctx.moveTo(r.x + this.w, r.y);
    $.ctx.lineTo(r.x + this.w, r.y + this.h);
    $.ctx.lineTo(r.x, r.y + (this.h / 2));
    $.ctx.lineTo(r.x + this.w, r.y);
    $.ctx.fill();
    $.ctx.restore();
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

class Explosion extends Sprite {
  constructor(obj) {
    super(obj.center().x, obj.center().y, 64, 64);
    this.radius = 50;
    this.life = 100;
  }

  update(dt) {
    this.life -= dt;
    if (this.life < 0) this.alive = 0;
  }

  render(r) {
    $.ctx.save();
    $.ctx.fillStyle = rnda(['yellow', 'white', 'red', 'orange']);
    $.ctx.beginPath();
    $.ctx.arc(r.x, r.y, this.radius, 0, 2 * PI);
    $.ctx.fill();
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
    $.ctx.fillLines([
      [0, 576],
      [159, 284],
      [195, 276],
      [214, 262],
      [242, 276],
      [304, 290],
      [355, 320],
      [423, 305],
      [497, 300],
      [564, 284],
      [638, 306],
      [750, 290],
      [821, 310],
      [911, 280],
      [943, 244],
      [986, 248],
      [1024, 264],
      [1024, 576],
      [0, 576]
    ], this.ctx);

    this.ctx.fillStyle = '#253326';
    $.ctx.fillLines([
      [0, 576],
      [0, 326],
      [24, 333],
      [56, 316],
      [82, 284],
      [126, 273],
      [185, 290],
      [245, 326],
      [382, 369],
      [466, 373],
      [523, 353],
      [584, 365],
      [616, 347],
      [655, 361],
      [723, 350],
      [788, 376],
      [902, 352],
      [944, 324],
      [987, 333],
      [1024, 357],
      [1024, 576],
      [0, 576]
    ], this.ctx);
  }
}
