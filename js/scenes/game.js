class GameScene extends Scene {
  constructor() {
    super();
    this.drone = new Drone(0, 0);
    this.radius1 = 100;
    this.radius2 = 300;
    this.canvas = D.createElement('canvas');
    this.canvas.width = $.vw;
    this.canvas.height = $.vh;
    this.ctx = this.canvas.getContext('2d');
    $.groups.actions = new Group();
    $.groups.actions.add(new Actionable(320, 320, 'repair', '12345'));

    //D.body.appendChild(this.canvas);
    W.addEventListener('rsize', this.resize.bind(this));

    this.noiseCanvas = D.createElement('canvas');
    this.noiseCanvas.width = $.vw;
    this.noiseCanvas.height = $.vh;
    let context = this.noiseCanvas.getContext("2d");

    for(let i=0; i<$.vw; i=i+4) {
      for(let j=0; j<$.vh; j=j+4) {
        var num = floor(rnd()*120)
        context.fillStyle = "rgb(" + num + "," + num + "," + num + ")";
        context.fillRect(i, j, 4, 4);
    }
}
  }

  resize(e) {
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
    //$.cam.clear('#9396A4');
    $.cam.clear('#444');

    //$.ctx.drawImage(this.noiseCanvas, 0, 0);

    // Render floor
    $.ctx.save();
    $.ctx.strokeStyle = 'hsla(0,0%,80%,0.5)';
    $.ctx.fillStyle = 'hsla(0,0%,80%,0.5)';
    $.ctx.beginPath();
    for(let x = 0; x < $.vw / GRID; x++) {
      for(let y = 0; y < $.vh / GRID; y++) {
        //$.ctx.moveTo(x * GRID, 0);
        //$.ctx.lineTo(x * GRID, y * 2 * GRID);
        //
        $.ctx.fillRect(x * GRID - 4, 0, 8, $.vh);

        //this.renderNoiseLine($.ctx, x * GRID - 4, 0, 8, $.vh);
      }
    }
    for(let y = 0; y < $.vh / GRID; y++) {
      for(let x = 0; x < $.vw / GRID; x++) {
        //$.ctx.moveTo(0, y * GRID);
        //$.ctx.lineTo(x * 2 * GRID, y * GRID);
        $.ctx.fillRect(0, y * GRID - 4, $.vw, 8);
      }
    }
    $.ctx.stroke();
    $.ctx.restore();


    // Update stuff
    $.groups.actions.update(this.deltaTime);
    this.drone.update(this.deltaTime);
    $.cam.update(this.deltaTime);

    $.txt.render('ABCDEFGHIJKLMNOPQRSTUVWXYZ', 10, 40, '#fff', 15);
    $.txt.render('0123456789.:@', 10, 70, '#fff', 15);

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
    $.cam.render($.groups.actions);
    $.cam.render(this.drone);
    $.cam.render($.groups.particles);

    $.ctx.drawImage(this.canvas, 0, 0);
  }
}
