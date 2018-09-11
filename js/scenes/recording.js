class RecordingScene extends Scene {
  constructor() {
    super();

    this.buttons = new Group();
    // Text length ----------------------------------|
    this.buttons.add(new RecordButton(80, [
      'This is Agatha Hope, captain of the spacecraft.',
      'Deliver the results of our investigation to Dr.',
      'Lenand in Sectarion.'
    ], this.finish.bind(this)));
    this.buttons.add(new RecordButton(220, [
      'I am Agatha Hope, and I didn\'t want to die',
      'this way. Tell my daughter Artemis that I love',
      'her very much, she knows.'
    ], this.finish.bind(this)));
    this.buttons.add(new RecordButton(360, [
      '',
      '-- NO MESSAGE --'
    ], this.finish.bind(this)));
  }

  render() {
    $.cam.clear('#ccc');

    for (let btn of this.buttons.all()) {
      $.ctx.drawImage(btn.canvas, btn.x, btn.y, btn.w, btn.h);
    }
  }

  finish(msg) {
    localStorage.setItem('AgathaMessage', msg);
    $.data.level += 1;
    $.scenemng.load(LevelSelectionScene);
  }
}

class RecordButton extends UIButton {
  constructor(y, text, cb) {
    let w = 600;
    super(($.vw - w) / 2, y, w, 90);
    this.cb = cb;
    this.text = text;
    this.font = new TextRenderer('monospace', '#333', 20);
    this.canvas = $.canvas.create(this.w, this.h);
    this.ctx = this.canvas.getContext('2d');

    this.ctx.fillStyle = '#66cdaa';
    this.ctx.fillRect(0, 0, this.w, this.h);
    this.ctx.strokeStyle = '#2f4f4f';
    this.ctx.lineWidth = 5;
    this.ctx.moveTo(0, 0 + this.h);
    this.ctx.lineTo(0 + this.w, 0 + this.h);
    this.ctx.lineTo(0 + this.w, 0);
    this.ctx.stroke();
    for (let i = 0; i < this.text.length; i++) {
      this.font.render(this.ctx, this.text[i], 10, 25 * (i + 1));
    }
  }

  onClick() {
    this.cb(this.text.join(' '));
  }
}
