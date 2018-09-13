class UIButton extends Sprite {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.pressed = false;
    this.active = true;
    $.events.listen('mouseup', this.onMouseUp.bind(this));
    $.events.listen('mousedown', this.onMouseDown.bind(this));
  }

  // To be implemented in child class
  onClick() {
  }

  onMouseUp() {
    this.pressed = false;
    this.active = true;
    this.leftClick = false;
  }

  onMouseDown(ev) {
    if (ev.button === 0 && !this.pressed) {
      if ($.collision.vector($.input.mousePos, this)) {
        this.pressed = true;
        this.onClick();
      }
    }
  }
}
