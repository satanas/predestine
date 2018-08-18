class Scene {
  reset() {
    this.exitFlag = false;
    this.startTime = 0;
    this.goTo = null;
    this.deltaTime = 0;
    this.elapsedTime = 0;
    this.frames = 0;
    this.fps = 0;
  }

  start() {
    this.reset();
    this.setup();
    this.loop();
  }

  // TODO: Implement fadeOut method

  loop() {
    // Calculate elapsed time
    this.deltaTime = (this.startTime !== 0) ? now() - this.startTime : 0;

    // Update Scene
    this.update();

    this.startTime = now();

    //-- DEBUG_START --
    if (debug) {
      this.frames += 1;
      this.elapsedTime += this.deltaTime;
      if (this.elapsedTime >= 1000) {
        this.fps = 1000 * this.frames / this.elapsedTime;
        this.frames = 0;
        this.elapsedTime = 0;
      }
      $.ctx.save();
      $.ctx.fillStyle = '#fff';
      $.ctx.fillText('FPS: ' + floor(this.fps), 10, 10);
      $.ctx.restore();
    }
    //-- DEBUG_END --

    if (!this.exitFlag) {
      raf(this.loop.bind(this));
    } else {
      return;
    }
  }

  exit() {
    this.exitFlag = true;
  }

  // To be override by child class
  setup() {
  }

  // To be override by child class
  update() {
  }
}
