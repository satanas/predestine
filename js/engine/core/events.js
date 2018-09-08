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
      //if (this.systemEvents.indexOf(evt) >= 0) continue;
      this.listeners[evt] = [];
    }
  }

  register(evt) {
    if (!this.listeners[evt]) {
      this.listeners[evt] = [];
      W.addEventListener(evt, this.onCustom.bind(this, evt));
    }
  }

  listen(evt, cb) {
    this.listeners[evt].push(cb);
  }

  emit(evt, data) {
    let ev = new CustomEvent(evt, {detail: data});
    W.dispatchEvent(ev);
  }

  onCustom(evt, data) {
    let callbacks = this.listeners[evt];
    if (callbacks) {
      for (let cb of callbacks) {
        cb(data);
      }
    }
  }
}
