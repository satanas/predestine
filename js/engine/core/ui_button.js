class UIButton extends Sprite {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.pressed = false;
    this.active = true;
    //D.body.addEventListener('mouseup', this.releaseClick.bind(this));
    //$.listen(this, 'btnClicked');
  }

  checkClick() {
    if(!this.active) return;

    //if (!this.pressed) {
    //  if ($.input.isLeftClick() && $.collision.vector($.input.mousePos, this)) {
    //    this.pressed = true;
    //    this.onClick();
    //    $.emit('btnClicked');
    //  }
    //}
  }

  // To be implemented in child class
  onClick() {
  }

  releaseClick() {
    //console.log('releaseClick', this.index);
    this.pressed = false;
    this.active = true;
  }

  btnClicked() {
    //console.log('btnClicked', this.index);
    this.active = false;
  }
}
