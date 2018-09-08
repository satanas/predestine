class Events {
  constructor() {
    this.listeners = {};

    for (let evt of ['mousedown', 'mouseup', 'mousemove']) {
      this.listeners[evt] = [];
      D.body.addEventListener(evt, this[evt].bind(this));
    }
  }

  mousedown(ev) {
    if (this.listeners.mousedown.length > 0) {
      for (let cb of this.listeners.mousedown) {
        cb(ev);
      }
    }
  }

  mouseup(ev) {
    if (this.listeners.mouseup.length > 0) {
      for (let cb of this.listeners.mouseup) {
        cb(ev);
      }
    }
  }

  mousemove(ev) {
    if (this.listeners.mousemove.length > 0) {
      for (let cb of this.listeners.mousemove) {
        cb(ev);
      }
    }
  }

  clear() {
    for (let evt in this.listeners) {
      this.listeners[evt] = [];
    }
  }

  listen(evt, cb) {
    this.listeners[evt].push(cb);
  }

  emit(evt, data) {
    let ev = new CustomEvent(evt, {detail: data});
    W.dispatchEvent(ev);
  }
}
