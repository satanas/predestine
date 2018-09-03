class ConnectCables extends Scene {
  constructor() {
    super();

    D.body.addEventListener('mousedown', this.togglePaint.bind(this, true));
    D.body.addEventListener('mouseup', this.togglePaint.bind(this, false));
    D.body.addEventListener('mousemove', this.doPaint.bind(this));

    this.connect = false;
    this.connectingColor = 0;
    this.num = 3;
    this.colors = shuffle(['red', 'green', 'blue', 'orange', 'black']).slice(0, this.num);
    this.upper = shuffle(this.colors);
    this.lower = shuffle(this.colors);

    let i, color,
        padding = 200,
        slot = ($.vw - padding) / this.num;
    this.upperCables = {};
    this.lowerCables = {};
    this.sensors = {};
    this.startCable = 0;
    this.endCable = 0;
    this.colorCable = 0;

    for (i = 0; i < this.upper.length; i++) {
      color = this.upper[i];
      this.upperCables[color] = new Cable(i, color, padding, slot, true);
    }

    for (i = 0; i < this.lower.length; i++) {
      color = this.lower[i];
      this.lowerCables[color] = new Cable(i, color, padding, slot, false);
    }

    this.maxTimer = 5000;
    this.timer = this.maxTimer;

    for (color of this.colors) {
      let obj1, obj2, xs, ys, n = 3;
      let yOff;

      if (this.upperCables[color].x > this.lowerCables[color].x) {
        obj1 = this.lowerCables[color];
        obj2 = this.upperCables[color];
      } else {
        obj1 = this.upperCables[color];
        obj2 = this.lowerCables[color];
      }
      xs = floor((obj2.x - obj1.x) / n);

      if (obj1.y < obj2.y) {
        // Down
        ys = floor((obj2.y - 32 - obj1.bounds.bottom) / n);
        yOff = obj1.bounds.bottom;
      } else {
        // Up
        ys = -1 * floor((obj1.y - 32 - obj2.bounds.bottom) / n);
        yOff = obj1.y - 32;
      }

      this.sensors[color] = [];

      for (i = 0; i <= n; i++) {
        let sen = new Sensor(obj1.x + (xs * i), yOff + (ys * i), color);
        this.sensors[color].push(sen);
      }
    }
  }

  togglePaint(val) {
    if (val) {
      let color, start, end, sensors;
      for (color of this.colors) {
        sensors = this.sensors[color];
        start = $.collision.vector($.input.mousePos, sensors[0]);
        end = $.collision.vector($.input.mousePos, sensors[sensors.length - 1]);
        if (start || end) {
          this.startCable = $.input.mousePos;
          this.colorCable = color;
          this.connect = val;
          console.log('color', color, 'start', start, 'end', end);
        }
      }
    } else {
      this.connect = false;
      this.startCable = 0;
      this.endCable = 0;
    }
  }

  doPaint() {
    if (this.connect) {
      this.endCable = $.input.mousePos;
      console.log('painting', this.startCable, this.endCable);
    }
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

    $.ctx.save();

    // Render drawing line
    if (this.connect) {
      $.ctx.beginPath();
      $.ctx.strokeStyle = this.colorCable;
      $.ctx.lineWidth = 15;
      $.ctx.moveTo(this.startCable.x, this.startCable.y);
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
