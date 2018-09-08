class ConnectScene extends BaseScene {
  constructor() {
    super();

    $.events.listen('mousedown', this.togglePaint.bind(this, true));
    $.events.listen('mouseup', this.togglePaint.bind(this, false));
    $.events.listen('mousemove', this.doPaint.bind(this));

    // Number of cables
    this.num = 4;
    this.colors = shuffle(['red', 'green', 'blue', 'orange', 'black', 'white', 'purple', 'yellow']).slice(0, this.num);

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
          this.connections.push(new Connection(this.startCable, this.expectedCable, this.connections.length, this.num, this.colorCable));
          //this.sensors[this.colorCable] = [];
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
    this.updateProgress();
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
    $.ctx.restore();

    this.renderProgress();
  }

  finish() {
    console.log('listo');
  }
}

class Connection {
  constructor(obj1, obj2, index, num, color) {
    let upper, lower, temp, h;

    // We always render from left to right
    if (obj1.x > obj2.x) {
      temp = obj1;
      obj1 = obj2;
      obj2 = temp;
    }
    this.color = color;
    this.rects = [];

    if (obj1.x === obj2.x) {
      if (obj1.y < obj2.y) {
        upper = obj1;
        lower = obj2;
      } else {
        upper = obj2;
        lower = obj1;
      }
      this.rects.push(new Rectangle(obj1.x + 16, upper.y, 32, lower.y - upper.y + 64));
    } else if (obj1.y < obj2.y) {
      // If we're going from top to bottom
      h = (index + 2) * 32;
      this.rects.push(new Rectangle(obj1.x + 16, obj1.y, 32, h));
      this.rects.push(new Rectangle(obj1.x + 16, obj1.y + h, obj2.x - obj1.x, 32));
      this.rects.push(new Rectangle(obj2.x + 16, obj1.y + h, 32, obj2.y - obj1.y - h + 64));
    } else if (obj1.y > obj2.y) {
      // If we're going from bottom to top
      index = num - index;
      h = (index + 1) * 32;
      this.rects.push(new Rectangle(obj1.x + 16, obj1.y - h + 6, 32, h + 64));
      this.rects.push(new Rectangle(obj1.x + 16, obj1.y - h + 6, obj2.x - obj1.x, 32));
      this.rects.push(new Rectangle(obj2.x + 16, obj2.y, 32, obj2.y - h + 32 + 10)); // + 10 is a hack
    }
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    for (let rect of this.rects) {
      $.ctx.fillRect(rect.x, rect.y, rect.w, rect.h);
    }
    $.ctx.restore();
  }
}

class Sensor extends Sprite {
  constructor(x, y, color) {
    super(x - 16, y, 64, 64);
    this.color = color;
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = '#deb887';
    $.ctx.fillRect(rect.x + 16, rect.y, this.w - 32, this.h);
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
