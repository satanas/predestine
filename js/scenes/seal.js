class SealScene extends BaseScene {
  constructor() {
    super(8000);

    this.holes = new Group();
    this.showingIndex = 0;
    this.secureTime = 3000;

    let arr = [],
        curr = 0,
        maxHoriz = 18,
        maxElem = 180;

    while (arr.length < 10) {
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
    this.holes.update();
    this.updateProgress();
    this.showCounter -= this.deltaTime;
    if (this.showCounter <= 0 && this.showingIndex < this.holes.length) {
      this.showCounter = this.stepTime;
      this.holes.at(this.showingIndex).enabled = true;
      this.showingIndex += 1;
    }
  }

  render() {
    $.cam.clear('#345');
    $.cam.render(this.holes);
    this.renderProgress();
  }

  finish() {
    let success = true,
        hole;
    for (hole of this.holes.all()) {
      if (!hole.sealed) {
        success = false;
        break;
      }
    }
    console.log('done', success);
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

  update() {
    this.checkClick();
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
