class GameScene extends Scene {
  constructor() {
    super();
    this.drone = new Drone(0, 0);
    this.radius1 = 100;
    this.radius2 = 300;
    this.canvas = D.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    $.groups.actions = new Group();
    $.groups.actions.add(new Actionable(320, 320));

    //D.body.appendChild(this.canvas);
    W.addEventListener('rsize', this.resize.bind(this));
  }

  resize(e) {
    resizeCanvas(this.canvas, e.detail.w, e.detail.h);
  }

  update() {
    $.cam.clear('#666');

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
