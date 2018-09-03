class Rectangle {
  constructor(x, y, w, h) {
    this._x = x;
    this._y = y;
    this.w = w;
    this.h = h;
    this.bounds = Bounds.fromRect(this);
  }

  center() {
    return new Vector(this.x + (this.w / 2), this.y + (this.h / 2));
  }

  //setPos(props) {
  //  for(let p in props) {
  //    this[p] = props[p];
  //  }
  //  this.bounds.update(this);
  //}

  set x(value) {
    this._x = value;
    this.bounds.update(this);
  }

  get x() {
    return this._x;
  }

  set y(value) {
    this._y = value;
    this.bounds.update(this);
  }

  get y() {
    return this._y;
  }

  // Returns a new rect, offset by offsetX and offsetY
  static offset(rect, offsetX, offsetY) {
    return new Rectangle(rect.x - offsetX, rect.y - offsetY, rect.w, rect.h);
  }

  // TODO
  // fromGrid

  // TODO
  // toGrid
}

class Bounds {
  constructor(top, bottom, left, right) {
    this.top = top;
    this.bottom = bottom;
    this.left = left;
    this.right = right;
  }

  update(rect) {
    this.bottom = rect.y + rect.h;
    this.top = rect.y;
    this.left = rect.x;
    this.right = rect.x + rect.w;
  }

  static fromRect(rect) {
    return new Bounds(rect.y, rect.y + rect.h, rect.x, rect.x + rect.w);
  }
}
