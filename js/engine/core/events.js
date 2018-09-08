class Events {
  constructor() {
    this.listeners = {};

    for (let evt of ['mousedown']) {
      this.listeners[evt] = [];
      D.body.addEventListener(evt, this[evt].bind(this));
    }
  }

  mousedown() {
    if (this.listeners.mousedown.length > 0) {
      for (let cb of this.listeners.mousedown) {
        cb();
      }
    }
  }

  clear() {
    for (let evt in this.listeners) {
      this.listeners[evt] = [];
    }
  }

  // Register lets you add listeners to a DOM event
  //register(evt) {
  //  this.events[evt] = [];
  //}

  listen(evt, cb) {
    this.listeners[evt].push(cb);
  }

  emit(evt, data) {
    let ev = new CustomEvent(evt, {detail: data});
    W.dispatchEvent(ev);
  }
}
