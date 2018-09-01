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
      DIR = {
        LF: 0, // Left
        RG: 1, // Right
        UP: 2, // Up
        DW: 3 // Down
      },
      GRID = 64;

debug = false;

$.init(); // init(['collisions', 'sound', 'astar', ...])
// Bind keyboard
$.input.bind([ENTER, KEY_A]);
$.input.bindMouse();
$.cam.setWorldSize(1024, 1024);
$.txt = new TextRenderer('monospace');

// Use three hex to represent each object in the level
// 0-F = Element
// 0-F = Index of X
// 0-F = Index of Y
let level = [
  "................",
  "....WWWWW.......",
  "....W.D.W.......",
  "....W...WWW.....",
  "....W.....W.....",
  "....W.R..XW.....",
  "....W.....W.....",
  "....WWWWWWW.....",
  "................",
];
$.data = {
  program: 0,
  level: new Level(level)
};

$.scenemng.load(new ProgrammingScene());
