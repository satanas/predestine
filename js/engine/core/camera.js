class Camera {
  constructor(width, height, worldWidth, worldHeight) {
    this.width = width;
    this.height = height;
    this.offsetX = 0;
    this.offsetY = 0;

    this.setWorldSize(worldWidth, worldHeight);
  }

  // Set world size
  setWorldSize(w, h) {
    this.worldWidth = w;
    this.worldHeight = h;
  }

  // Set target. This target will be followed by the Camera
  setTarget(t) {
    this.target = t;
  }

  // Transform point coordinates
  transformVector(v) {
    return new Vector(v.x - this.offsetX, v.y - this.offsetY);
  }

  // Indicates if the object is inside the viewport.
  // Used to avoid rendering objects outside the view
  inView(obj) {
    let r = Rectangle.offset(obj, this.offsetX, this.offsetY);

    return ((r.bounds.right >= 0 && r.bounds.right <= this.width) || (r.x >= 0 && r.x <= this.width)) &&
           ((r.bounds.bottom >= 0 && r.bounds.bottom <= this.height) || (r.y >= 0 && r.y <= this.height));
  }

  update(deltaTime) {
    let tx = 0,
        ty = 0,
        midWidth = this.width / 2,
        midHeight = this.height / 2;

    this.offsetX = 0;
    this.offsetY = 0;
    // Update offset according the target.
    if (this.target) {
      // If world width is smaller than viewport width, then tx = target.x so offset x is zero
      if (this.worldWidth <= this.width) {
        tx = this.target.x;
      // If target.x is before the middle of the viewport, offset x is zero
      } else if (this.target.x <= midWidth) {
        tx = this.target.x;
      // If target x is after the middle of the viewport and still not in the end of the world,
      // offset x is the middle viewport
      } else if ((this.target.x > midWidth) && (this.target.x + midWidth <= this.worldWidth)) {
        tx = midWidth;
      // If target x is after the middle of the viewport and reached the end of the world,
      // offset x is the difference between the world width and the target.x
      } else if ((this.target.x > midWidth) && (this.target.x + midWidth > this.worldWidth)) {
        tx = this.width - (this.worldWidth - this.target.x);
      }

      if (this.worldHeight <= this.height) {
        ty = this.target.y;
      } else if (this.target.y <= midHeight) {
        ty = this.target.y;
      } else if ((this.target.y > midHeight) && (this.target.y + midHeight <= this.worldHeight)) {
        ty = midHeight;
      } else if ((this.target.y > midHeight) && (this.target.y + midHeight > this.worldHeight)) {
        ty = this.height - (this.worldHeight - this.target.y);
      }

      this.offsetX = this.target.x - tx;
      this.offsetY = this.target.y - ty;
    }

    // Screen shake update
    if (this.duration && this.elapsed < this.duration) {
      this.elapsed += deltaTime;
      let perc = this.elapsed / this.duration,
          damper = 1 - clamp(4 * perc - 3, 0, 0.1),
          x = (rnd() % 32768) * rnda([-1, 1]),
          y = (rnd() % 32768) * rnda([-1, 1]);

      x *= this.magnitude * damper;
      y *= this.magnitude * damper;
      this.offsetX += x;
      this.offsetY += y;
      if (this.elapsed >= this.duration) this.duration = 0;
    }
  }

  shake(m, d) {
    this.elapsed = 0;
    this.perc = 0; // percentage completed
    this.duration = d;
    this.magnitude = m;
  }

  render(elem) {
    let objs;

    if (!elem) return;
    if (elem instanceof Group) {
      objs = elem.all();
    } else if (!(elem instanceof Array)) {
      objs = [elem];
    }

    objs.forEach((o) => {
      if (this.inView(o) && o.enabled) {
        o.render(Rectangle.offset(o, this.offsetX, this.offsetY));
      }
    });
  }

  // Clear screen
  clear(c) {
    $.ctx.clearRect(0, 0, $.vw, $.vh);
    $.ctx.fillStyle = c || "#000";
    $.ctx.fillRect(0, 0, $.vw, $.vh);
  }
}
