class LevelSelectionScene extends Scene {
  constructor() {
    super();

    this.padding = 5;
    this.topMargin = 30;

    this.aeros = new Aeros();

    this.aeros.speak([
      //'Text length ---------------------------------------',
      [
        'Hello, Captain. The crash damaged most of our systems',
        'and 90% of the ship if offline.',
      ],
      [
        'This is a second line of text',
        'And thid is a third?'
      ]
    ]);
  }

  update() {
    this.aeros.update(this.deltaTime);
  }

  render() {
    $.cam.clear('#00405c');

    $.ctx.save();
    $.ctx.fillStyle = 'black';
    $.ctx.fillRect(this.padding, this.topMargin, $.vw - (this.padding * 2), $.vh - (this.topMargin + this.padding));
    $.ctx.restore();

    $.cam.render(this.aeros);

    $.ctx.drawImage(this.aeros.canvas, this.aeros.x, this.aeros.y, this.aeros.w, this.aeros.h);
  }
}

