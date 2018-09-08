class SceneManager {
  constructor() {
    this.goTo = 0;
    this.scene = 0;
    $.listen(this, 'sceneExit');
  }

  sceneExit() {
    this.scene = this.goTo;
    this.goTo = 0;
    this.scene.start();
  }

  unload() {
    if (this.scene) {
      this.scene.unload();
    } else {
      Scene.onExit();
    }
  }

  load(sceneCls) {
    $.events.clear();
    let scene = new (Function.prototype.bind.apply(sceneCls));
    // Intent. What do we want to load?
    this.goTo = scene;
    // Unload previous scene (if loaded) and then load the intent
    this.unload();
  }
}
