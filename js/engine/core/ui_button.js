class UIButton extends Sprite {
  constructor(x, y, w, h) {
    super(x, y, w, h);
    this.pressed = false;
    this.active = true;
    $.events.listen('mouseup', this.onMouseUp.bind(this));
    $.events.listen('mousedown', this.onMouseDown.bind(this));
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

  onMouseUp() {
    //console.log('releaseClick', this.index);
    this.pressed = false;
    this.active = true;
    this.leftClick = false;
  }

  onMouseDown(ev) {
    if (ev.button === 0) {
      if ($.collision.vector($.input.mousePos, this)) {
        this.pressed = true;
        this.onClick();
        //$.emit('btnClicked');
      }
    }
  }

  //btnClicked() {
  //  //console.log('btnClicked', this.index);
  //  this.active = false;
  //}
}
