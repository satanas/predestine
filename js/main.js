const ENTER = 13,
      KEY_A = 65,
      // Actions
      FW = 1, // Move forward
      BW = 2, // Move backward
      TL = 3, // Turn left
      TR = 4, // Turn right
      RP = 5, // Repair
      EX = 6, // Extinguish
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

var scene = new ProgrammingScene();
scene.start();
