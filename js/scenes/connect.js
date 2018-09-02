class ConnectCables extends Scene {
  constructor() {
    super();

    this.num = 4;
    this.colors = shuffle(['red', 'green', 'blue', 'orange', 'black']).slice(0, this.num);
    this.upper = shuffle(this.colors);
    this.lower = shuffle(this.colors);

    console.log(this.upper, this.lower);
  }

  render() {
    $.cam.clear('#ccc');

    $.ctx.save();
    let i, x, y,
        w = 32,
        padding = 200,
        slot = ($.vw - padding) / this.num;

    for (i = 0; i < this.upper.length; i++) {
      x = padding + (slot * i / 2) - (w / 2);
      y = 0;
      console.log('slot', slot, 'x', x);

      $.ctx.fillStyle = this.upper[i];
      //$.ctx.fillRect(x, y, w, 200);
      $.ctx.fillRect(x, y, slot, 200);
    }
    $.ctx.restore();
  }
}
