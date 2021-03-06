class Scene {
  static onExit() {
    $.events.emit('sceneexit');
  }

  reset() {
    this.exitFlag = false;
    this.startTime = 0;
    this.deltaTime = 0;
    // FPS calculation
    this.fps = 0;
    this.frames = 0;
    this.fpsStartTime = now();
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

    // Update scene
    this.update();
    // Render scene
    this.render();

    this.startTime = now();

    //-- DEBUG_START --
    if (debug) {
      this.frames += 1;
      if (this.frames >= 30) {
        let elapsed = now() - this.fpsStartTime;
        this.fps = 1000 * this.frames / elapsed;
        this.frames = 0;
        this.fpsStartTime = now();
      }
      $.ctx.save();
      $.ctx.fillStyle = 'red';
      $.ctx.fillText('FPS: ' + floor(this.fps), 10, 10);
      $.ctx.restore();
    }
    //-- DEBUG_END --

    if (!this.exitFlag) {
      raf(this.loop.bind(this));
    } else {
      Scene.onExit();
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

  // To be override by child class
  render() {
  }

  // To be override by child class
  // Here, the fade out (and stuff like that) can be activated
  unload() {
    this.exit();
  }
}
