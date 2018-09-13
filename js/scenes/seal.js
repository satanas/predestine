class SealScene extends BaseScene {
  constructor() {
    super('Fix the leak', 'Tap the holes to seal them', 12000);

    this.success = true;

    let holes;
    if ($.data.level === 4) {
      holes = 20;
    } else {
      holes = 10;
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
    $.cam.clear('#8fdfff');
    $.cam.render(this.holes);
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
    $.data.level += 1;
    $.scenemng.load(LevelSelectionScene);
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
    this.color = '#333';
  }

  render() {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    //$.ctx.fillRect(this.x, this.y, this.w, this.h);
    $.ctx.beginPath();
    $.ctx.arc(this.center().x, this.center().y, this.w / 2, 0, 2 * PI);
    $.ctx.fill();
    $.ctx.restore();
  }

  onClick() {
    this.sealed = true;
    this.color = '#00b7ff';
    //this.enabled = false;
  }
}
