class UIButton extends Sprite {
  constructor(x, y, w, h, cb) {
    super(x, y, w, h);
    this.cb = cb;
    this.pressed = false;
    D.body.addEventListener('mouseup', this.releaseClick.bind(this));
  }

  checkClick() {
    if (!this.pressed) {
      if ($.input.isLeftClick() && $.collision.vector($.input.mousePos, this)) {
        this.pressed = true;
        this.onClick();
      }
    }
  }

  // To be implemented in child class
  onClick() {
    this.cb();
  }

  releaseClick() {
    this.pressed = false;
  }
}
