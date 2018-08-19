const ENTER = 13,
      KEY_A = 65,
      // Actions
      FW = 1,
      BW = 2,
      TL = 3,
      TR = 4,
      // Directions
      LF = 0,
      RG = 1,
      UP = 2,
      DW = 3,
      GRID = 64;

debug = true;

$.init(); // init(['collisions', 'sound', 'astar', ...])
// Bind keyboard
$.input.bind([ENTER, KEY_A]);
$.input.bindMouse();
$.cam.setWorldSize(1024, 1024);

var scene = new GameScene();
scene.start();
