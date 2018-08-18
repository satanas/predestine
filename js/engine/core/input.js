class Input {
  constructor() {
    this.pressed = {};
    this.events = {};
    this.mousePos = null;

    D.body.addEventListener('keydown', (e) => {
      if (e.keyCode in this.events) {
        this.updateEvent(e, -1, 1);
      }
    });

    D.body.addEventListener('keyup', (e) => {
      if (e.keyCode in this.events) {
        this.updateEvent(e, 1, 0);
      }
    });

    D.body.addEventListener('mousedown', (e) => {
      let key = e.button + 1;
      if (key in this.events) {
        this.updateEvent(e, -1, 1, key);
      }
    });

    D.body.addEventListener('mouseup', (e) => {
      let key = e.button + 1;
      if (key in this.events) {
        this.updateEvent(e, 1, 0, key);
      }
    });
  }

  isPressed(c) {
    if (c instanceof Array) {
      for(let i = 0; i < c.length; i++) {
        if (!!this.pressed[c[i]]) return true;
      }
      return false;
    } else {
      return !!this.pressed[c];
    }
  }

  isLeftClick() {
    // event.button (0) + 1
    return this.isPressed(1);
  }

  isRightClick() {
    // event.button (2) + 1
    return this.isPressed(3);
  }

  // TODO: Unbind
  bind(keys) {
    keys.forEach((k) => {
      this.pressed[k] = 0;
      this.events[k] = 0;
    });
  }

  // We use event.button + 1 to bind mouse input for left and right clicks
  // to use the ones coming from js and avoid defining new variables. Plus,
  // 1 and 3 are codes for non-printable characters, so there is no chance
  // of key collision.
  // 1: left click
  // 3: right click
  bindMouse() {
    this.bind([1, 3]);
    D.body.addEventListener('mousemove', (e) => {
      this.mousePos = new Vector(e.clientX, e.clientY);
    });
  }

  updateEvent(e, m, n, key) {
    key = key || e.keyCode;
    e.preventDefault();
    this.events[key] = m;
    this.pressed[key] = n;
  }
}
