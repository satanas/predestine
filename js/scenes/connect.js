class ConnectCables extends Scene {
  constructor() {
    super();

    this.num = 3;
    this.padding = 200;
    this.slot = ($.vw - this.padding) / this.num;
    this.colors = shuffle(['red', 'green', 'blue', 'orange', 'black']).slice(0, this.num);
    this.upper = shuffle(this.colors);
    this.lower = shuffle(this.colors);

    let i;
    this.upperCables = new Group();
    for (i = 0; i < this.upper.length; i++) {
      this.upperCables.add(new Cable(i, this.upper[i], this.padding, this.slot, true));
    }

    this.lowerCables = new Group();
    for (i = 0; i < this.lower.length; i++) {
      this.upperCables.add(new Cable(i, this.lower[i], this.padding, this.slot, false));
    }

    this.maxTimer = 5000;
    this.timer = this.maxTimer;

    console.log(this.upper, this.lower);
  }

  update() {
    this.timer -= this.deltaTime;
    if (this.timer <= 0) {
    }
  }

  render() {
    $.cam.clear('#ccc');

    // Render upper cables
    $.cam.render(this.upperCables);

    // Render lower cables
    $.cam.render(this.lowerCables);

    $.ctx.save();
    // Render progress bar bg
    $.ctx.fillStyle = 'rgba(55,255,0,0.2)';
    $.ctx.fillRect(0, 0, $.vw, 20);

    // Render progress bar fg
    let w = this.timer * $.vw / 5000;
    $.ctx.fillStyle = 'rgba(55,255,0,0.5)';
    $.ctx.fillRect(0, 0, w, 20);

    $.ctx.restore();
  }
}

class Sensor extends Sprite {
  constructor(x, y, color) {
    super(x, y, 16, 16);
  }

  render(rect) {
    $.ctx.save();

    $.ctx.fillStyle = 'green';
    $.ctx.fillRect(rect.x, rect.y, w, h);
    $.crx.restore();
  }

}

class Cable extends Sprite {
  constructor(i, color, padding, slot, upper) {
    let h = 180,
        w = 32,
        x = (padding / 2) + (slot * i) + (slot / 2) - (w / 2),
        y = (upper) ? 0 : $.vh - h;
    super(x, y, w, h);
    this.color = color;
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore()
  }
}
