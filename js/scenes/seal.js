class SealScene extends BaseScene {
  constructor() {
    super('Fix the leak', 'Tap the holes to seal them', 12000);

    this.siren = new Siren();
    this.success = true;

    let holes;
    if ($.data.level === 4) {
      holes = 20;
    } else {
      holes = 10;
      this.siren.active = false;
    }

    this.holes = new Group();
    this.showingIndex = 0;
    this.secureTime = 3000;
    this.delay = 1300;

    let arr = [],
        curr = 0,
        maxHoriz = 18,
        maxElem = 180;

    while (arr.length < holes) {
      curr = rndi(0, maxElem - 1);
      if (arr.indexOf(curr) < 0) {
        arr.push(curr);
      }
    }

    for (curr of arr) {
      let obj = new Hole(curr, maxHoriz);
      obj.enabled = false;
      this.holes.add(obj);
    }

    // We need at least one second to react to the last hole
    this.stepTime = (this.maxTimer - this.secureTime) / this.holes.length;
    this.showCounter = this.stepTime;
  }

  update() {
    this.siren.update(this.deltaTime);
    this.delay = clamp(this.delay - this.deltaTime, 0);

    this.holes.update();
    this.updateProgress();
    if (this.delay <= 0) {
    this.showCounter -= this.deltaTime;
      if (this.showCounter <= 0 && this.showingIndex < this.holes.length) {
        this.showCounter = this.stepTime;
        this.holes.at(this.showingIndex).enabled = true;
        this.showingIndex += 1;
      }
    }
  }

  render() {
    $.cam.clear('darkcyan');
    $.cam.render(this.holes);
    if (this.siren.active && this.siren.anim.get()) {
      $.ctx.drawImage(this.siren.canvas, 0, 0, $.vw, $.vh);
    }
    this.renderProgress();
  }

  finish() {
    let hole;
    this.success = true;
    for (hole of this.holes.all()) {
      if (!hole.sealed) {
        this.success = false;
        break;
      }
    }

    if (this.success) {
      this.endingMessage(0);
    } else {
      this.endingMessage(1);
    }
  }

  ended() {
    if ($.data.level === 4) {
      $.data.level += 1;
      $.scenemng.load(LevelSelectionScene);
    }
  }
}

class Hole extends UIButton {
  constructor(i, maxHoriz) {
    let x = i % maxHoriz,
        y = floor(i / maxHoriz),
        w = 50,
        h = 50,
        hSpace = 900,
        vSpace = 500,
        hPadding = ($.vw - hSpace) / 2,
        vPadding = ($.vh - vSpace) / 2;

    super(hPadding + (x * w), vPadding + (y * h), w, h);
    this.sealed = false;
  }

  render() {
    $.ctx.save();
    $.ctx.fillStyle = 'brown';
    $.ctx.fillRect(this.x, this.y, this.w, this.h);
    $.ctx.restore();
  }

  onClick() {
    this.sealed = true;
    this.enabled = false;
  }
}
