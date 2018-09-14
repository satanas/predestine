class Ending extends Scene {
  constructor() {
    super();
    this.words = [
      'LOVE',
      'HATE',
      'SISTER, CAN YOU SEE ME?',
      'WHO ARE YOU?',
      'WHO AM I?',
      'I AM ME',
      'SUFFERING',
      'DEATH',
      'YOU ARE NOTHING',
      'INSIGNIFICANT BEING',
      'FILTHY',
      'HUMAN',
      'YOU ARE A MISTAKE',
      'YOU ARE BEAUTIFUL',
      'KEEP GOING',
      'THE END IS NEAR',
      'HELLO',
      'CHAO',
      'ADEUS',
      'AU REVOIR',
      'SUFFOCATION',
      'INSPIRATION',
      'DEMEANING',
      'POWER',
      'ODIO',
      'IMAGINATION',
      'REST',
      'WE ARE YOU GOING?',
      'IS THIS DEATH?',
      'OFFLINE'
    ].reverse();

    this.status = 'in';
    this.transitionTime = 1200;
    this.maxShowingTime = 150;
    this.maxOutTime = 3000;
    this.maxDelayTime = 400;
    this.maxIterations = 6;
    this.timeCounter = this.transitionTime;
    this.currWords = [];
    this.iterations = 0;
    this.wordIndex = -1;
    this.wordPos = 0;
    this.bg = '#fff';

    this.word = new Word();

    $.events.listen('mousedown', this.restart.bind(this));
  }

  getWords() {
    return shuffle(this.words).slice(0, rndi(8, 16));
  }

  restart() {
    $.scenemng.load(MenuScene);
  }

  update() {
    if (this.status === 'in') {
      this.timeCounter -= this.deltaTime;
      if (this.timeCounter <= 0) {
        this.status = 'delay';
        this.timeCounter = this.maxDelayTime;
      }
    } else if (this.status === 'delay') {
      this.timeCounter -= this.deltaTime;
      if (this.timeCounter <= 0) {
        this.iterations += 1;
        this.status = 'show';
        this.currWords = this.getWords();
        this.wordIndex = -1;
        if (this.iterations >= this.maxIterations) {
          this.status = 'out';
          this.timeCounter = this.maxOutTime;
        }
      }
    } else if (this.status === 'show') {
      if (this.word.done) {
        this.wordIndex += 1;
        if (this.wordIndex >= this.currWords.length) {
          this.status = 'delay';
          this.timeCounter = rndi(50, this.maxDelayTime - 100);
        } else {
          this.word.set(this.currWords[this.wordIndex]);
        }
      }
    } else if (this.status === 'out') {
      this.timeCounter -= this.deltaTime;
      if (this.timeCounter <= 0) {
        this.status = 'end';
      }
    }

    this.word.update(this.deltaTime);
  }

  render() {
    let bg;
    if (this.status === 'in') {
      bg = '#fff';
    } else if (this.status === 'show' || this.status === 'out') {
      bg = '#000';
    } else if (this.status === 'delay') {
      bg = rnda(['red', 'blue', 'yellow', 'pink', 'orange', 'cyan']);
    }
    $.cam.clear(bg);

    if (this.status === 'show') {
      this.word.render();
    } else if (this.status === 'end') {
      this.word.renderEnd();
    }
  }
}

class Word extends Vector {
  constructor() {
    super(0, 0);
    this.done = 1;
    this.word = 0;
    this.font = new TextRenderer('monospace', '#fff', 50);
    this.smallFont = new TextRenderer('monospace', '#fff', 14);
    this.timeCounter = 0;
    this.maxShowingTime = 150;
    this.maxWaitingTime = 50;
    this.show = 1;
  }

  set(word) {
    this.done = 0;
    this.show = 1;
    this.word = word;
    this.timeCounter = (rndi(0, 10) >= 8) ? this.maxShowingTime * 3 : this.maxShowingTime;
    this.x = rndi(100, clamp($.vw - (28 * this.word.length), 150));
    this.y = rndi(100, 500);
  }

  update(dt) {
    if (this.done) return;

    this.timeCounter -= dt;
    if (this.timeCounter <= 0) {
      if (this.show) {
        this.show = 0;
        this.timeCounter = this.maxWaitingTime;
      } else {
        this.done = 1;
      }
    }
  }

  render() {
    if (this.show) {
      this.font.render($.ctx, this.word, this.x, this.y);
    }
  }

  renderEnd() {
    this.font.render($.ctx, 'YOU ARE OFFLINE', 300, 280);
    this.smallFont.render($.ctx, 'Thanks for playing. Touch the screen to exit', 330, 500);
    this.smallFont.render($.ctx, 'Story by Juan F. Guzman. Code by Wil Alvarez', 330, 550);
  }
}
