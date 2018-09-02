class ConnectCables extends Scene {
  constructor() {
    super();

    this.num = 3;
    this.colors = shuffle(['red', 'green', 'blue', 'orange', 'black']).slice(0, this.num);
    this.upper = shuffle(this.colors);
    this.lower = shuffle(this.colors);

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
    $.ctx.save();

    let i, x,
        h = 180,
        w = 32,
        padding = 200,
        slot = ($.vw - padding) / this.num;

    // Render upper cables
    for (i = 0; i < this.upper.length; i++) {
      x = (padding / 2) + (slot * i) + (slot / 2) - (w / 2);

      $.ctx.fillStyle = this.upper[i];
      $.ctx.fillRect(x, 0, w, h);
    }

    // Render lower cables
    for (i = 0; i < this.lower.length; i++) {
      x = (padding / 2) + (slot * i) + (slot / 2) - (w / 2);

      $.ctx.fillStyle = this.lower[i];
      $.ctx.fillRect(x, $.vh - h, w, h);
    }

    // Render progress bar bg
    $.ctx.fillStyle = 'rgba(55,255,0,0.2)';
    $.ctx.fillRect(0, 0, $.vw, 20);

    // Render progress bar fg
    w = this.timer * $.vw / 5000;
    $.ctx.fillStyle = 'rgba(55,255,0,0.5)';
    $.ctx.fillRect(0, 0, w, 20);

    $.ctx.restore();
  }
}

//slot 206 x 184
//slot 206 x 287
//slot 206 x 390
//slot 206 x 493
