const ENTER = 13,
      KEY_A = 65,
      // Actions
      ACTIONS = {
        FW: 'move forward',
        BW: 'move backward',
        TL: 'turn left',
        TR: 'turn right',
        RP: 'repair',
        EX: 'extinguish'
      },
      // Directions
      LF = 0, // Left
      RG = 1, // Right
      UP = 2, // Up
      DW = 3, // Down
      GRID = 64;

debug = true;

$.init(); // init(['collisions', 'sound', 'astar', ...])
// Bind keyboard
$.input.bind([ENTER, KEY_A]);
$.input.bindMouse();
$.cam.setWorldSize(1024, 1024);

//var scene = new ProgrammingScene();
var scene = new GameScene();
scene.start();
