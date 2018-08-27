class GameScene extends Scene {
  constructor() {
    super();
    this.radius1 = 100;
    this.radius2 = 300;
    this.canvas = $.canvas.create($.vw, $.vh);
    this.ctx = this.canvas.getContext('2d');
    this.walls = new Group();

    $.groups.actionables = new Group();
    $.groups.actionables.add(new Actionable(128, 192, ACTIONS.RP, '12345'));

    for (let w of $.data.level.walls) {
      this.walls.add(new Wall(w[0] * GRID, w[1] * GRID));
    }

    this.drone = new Drone($.data.level.dock[0] * GRID, $.data.level.dock[1] * GRID, DIR.DW,
      [ACTIONS.FW, ACTIONS.FW, ACTIONS.FW, ACTIONS.FW, ACTIONS.FW, ACTIONS.TL,
      ACTIONS.FW, ACTIONS.FW, ACTIONS.FW, ACTIONS.RP, ACTIONS.FW]);

    $.listen(this, 'rsize')

    this.noiseCanvas = $.canvas.create($.vw, $.vh);
  }

  rsize(e) {
    resizeCanvas(this.canvas, e.detail.w, e.detail.h);
    resizeCanvas(this.noiseCanvas, e.detail.w, e.detail.h);
  }

  renderNoiseLine(ctx, x, y, w, h) {
    for(let i=x; i<w; i=i+2) {
      for(let j=y; j<h; j=j+2) {
        var num = floor(rndi(1, 255))
        ctx.fillStyle = "rgb(" + num + "," + num + "," + num + ")";
        ctx.fillRect(i, j, 2, 2);
      }
    }
  }

  update() {
    // Update stuff
    $.groups.actionables.update(this.deltaTime);
    this.drone.update(this.deltaTime, this.walls.all(), $.groups.actionables);

    $.cam.update(this.deltaTime);
  }

  render() {
    $.cam.clear('#444');

    //$.ctx.drawImage(this.noiseCanvas, 0, 0);

    // Render floor
    $.ctx.save();
    $.ctx.strokeStyle = 'hsla(0,0%,80%,0.5)';
    $.ctx.fillStyle = 'hsla(0,0%,80%,0.5)';
    $.ctx.beginPath();
    for(let x = 0; x < $.vw / GRID; x++) {
      //for(let y = 0; y < $.vh / GRID; y++) {
        //$.ctx.moveTo(x * GRID, 0);
        //$.ctx.lineTo(x * GRID, y * 2 * GRID);
        //
        $.ctx.fillRect(x * GRID - 4, 0, 8, $.vh);

        //this.renderNoiseLine($.ctx, x * GRID - 4, 0, 8, $.vh);
      //}
    }
    for(let y = 0; y < $.vh / GRID; y++) {
      //for(let x = 0; x < $.vw / GRID; x++) {
        //$.ctx.moveTo(0, y * GRID);
        //$.ctx.lineTo(x * 2 * GRID, y * GRID);
        $.ctx.fillRect(0, y * GRID - 4, $.vw, 8);
      //}
    }
    $.ctx.stroke();
    $.ctx.restore();

    // partially hide the entire map and re-reval where we are now
    this.ctx.globalCompositeOperation = 'source-over';
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = 'rgba(0,0,0,0.8)';
    this.ctx.fillRect (0, 0, this.canvas.width, this.canvas.height);

    var radGrd = $.ctx.createRadialGradient(this.drone.x, this.drone.y, this.radius1, this.drone.x, this.drone.y, this.radius2);
    radGrd.addColorStop(0, 'rgba(0,0,0,1)');
    radGrd.addColorStop(0.8, 'rgba(0,0,0,.1)');
    radGrd.addColorStop(1, 'rgba(0,0,0,0)');

    this.ctx.globalCompositeOperation = 'destination-out';
    this.ctx.fillStyle = radGrd;
    this.ctx.fillRect(this.drone.x - this.radius2, this.drone.y - this.radius2, this.radius2*2, this.radius2*2);

    // Render stuff
    $.cam.render($.groups.actionables);
    $.cam.render(this.walls);
    $.cam.render(this.drone);

    $.ctx.drawImage(this.canvas, 0, 0);
  }
}
