class ConnectCables extends Scene {
  constructor() {
    super();

    D.body.addEventListener('mousedown', this.togglePaint.bind(this, true));
    D.body.addEventListener('mouseup', this.togglePaint.bind(this, false));
    D.body.addEventListener('mousemove', this.doPaint.bind(this));

    // Number of cables
    this.num = 3;
    this.colors = shuffle(['red', 'green', 'blue', 'orange', 'black']).slice(0, this.num);

    let i, color,
        padding = 200,
        slot = ($.vw - padding) / this.num,
        upper = shuffle(this.colors),
        lower = shuffle(this.colors);
    this.upperCables = {};
    this.lowerCables = {};
    this.sensors = {};
    this.connections = [];

    // Connection variables
    this.resetConnection();

    for (i = 0; i < upper.length; i++) {
      color = upper[i];
      this.upperCables[color] = new Cable(i, color, padding, slot, true);
    }

    for (i = 0; i < lower.length; i++) {
      color = lower[i];
      this.lowerCables[color] = new Cable(i, color, padding, slot, false);
    }

    for (color of this.colors) {
      this.sensors[color] = [
        new Sensor(this.upperCables[color].x, this.upperCables[color].bounds.bottom, color),
        new Sensor(this.lowerCables[color].x, this.lowerCables[color].y - 32, color)
      ];
    }

    this.maxTimer = 5000;
    this.timer = this.maxTimer;
  }

  togglePaint(val) {
    let color, start, end, sensors;

    if (val) {
      // Start connecting
      for (color of this.colors) {
        sensors = this.sensors[color];
        start = $.collision.vector($.input.mousePos, sensors[0]);
        end = $.collision.vector($.input.mousePos, sensors[1]);
        if (start || end) {
          if (start) {
            this.startCable = sensors[0];
            this.expectedCable =sensors[1];
          } else {
            this.startCable = sensors[1];
            this.expectedCable = sensors[0]
          }
          this.colorCable = color;
          this.connecting = val;
        }
      }
    } else {
      if (!val && this.connecting) {
        let connected = $.collision.vector($.input.mousePos, this.expectedCable);
        if (connected) {
          this.connections.push(new Connection(this.startCable, this.expectedCable, this.connections.length, this.colorCable));
          //this.sensors[this.colorCable] = [];
          console.log('CONNECTED');
        }
      }
      this.resetConnection();
    }
  }

  doPaint() {
    if (this.connecting) {
      this.endCable = $.input.mousePos;
    }
  }

  resetConnection() {
    this.connecting = false;
    this.startCable = 0;
    this.endCable = 0;
    this.expectedCable = 0;
    this.colorCable = 0;
  }

  update() {
    this.timer -= this.deltaTime;
    if (this.timer <= 0) {
    }
  }

  render() {
    $.cam.clear('#ccc');

    let obj, color;
    // Render upper cables
    for (color in this.upperCables) {
      $.cam.render(this.upperCables[color]);
    }
    // Render lower cables
    for (color in this.lowerCables) {
      $.cam.render(this.lowerCables[color]);
    }
    // Render sensors
    for (color in this.sensors) {
      for (obj of this.sensors[color]) {
        $.cam.render(obj);
      }
    }
    // Render connections
    for (obj of this.connections) {
      obj.render();
    }

    $.ctx.save();

    // Render drawing line
    if (this.connecting) {
      $.ctx.beginPath();
      $.ctx.strokeStyle = this.colorCable;
      $.ctx.lineWidth = 5;
      $.ctx.moveTo(this.startCable.x + 16, this.startCable.y + 16);
      $.ctx.lineTo(this.endCable.x, this.endCable.y);
      $.ctx.stroke();
    }
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

class Connection {
  constructor(obj1, obj2, index, color) {
    this.orig = new Vector(obj1.x, obj1.y);
    this.dst = new Vector(obj2.x, obj2.y);
    this.index = index;
    this.color = color;
    console.log(index);
  }

  render(rect) {
    $.ctx.save();
    $.ctx.beginPath();
    $.ctx.lineWidth = 32;
    $.ctx.strokeStyle = this.color;
    $.ctx.moveTo(this.orig.x + 16, this.orig.y);
    $.ctx.lineTo(this.dst.x + 16, this.dst.y);
    $.ctx.stroke();
    $.ctx.restore();
  }
}

class Sensor extends Sprite {
  constructor(x, y, color) {
    super(x, y, 32, 32);
    this.color = color;
  }

  render(rect) {
    $.ctx.save();

    $.ctx.strokeStyle = this.color;
    $.ctx.strokeRect(rect.x, rect.y, this.w, this.h);
    $.ctx.restore();
  }
}

class Cable extends Sprite {
  constructor(i, color, padding, slot, upper) {
    let h = 180,
        w = 32,
        x = floor((padding / 2) + (slot * i) + (slot / 2) - (w / 2)),
        y = floor((upper) ? 0 : $.vh - h);
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
