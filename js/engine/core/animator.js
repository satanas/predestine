/**
 * Calculates and return the frames of a given animation array according to the elapsed time.
 * @param imgArr array of images for the animation
 * @param duration duration (ms) of each frame
 * @param startFrame frame index where the animation will start the first time
 **/
class Animator {
  constructor(imgArr, duration, startFrame) {
    this.imgArr = imgArr;
    this.duration = duration || 150;
    this.frame = startFrame || 0;
    this.counter = 0;
  }

  update(dt) {
    this.counter += dt;
    if (this.counter > this.duration) {
      this.counter = 0;
      this.frame = (this.frame + 1 > this.imgArr.length - 1) ? 0 : this.frame + 1;
    }
  }

  get() {
    return this.imgArr[this.frame];
  }
}
