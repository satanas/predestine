const ENTER = 13,
      KEY_A = 65,
      GRID = 64;

debug = false;

$.init(); // init(['collisions', 'sound', 'astar', ...])
// Bind keyboard
$.input.bind([ENTER, KEY_A]);
$.input.bindMouse();
$.cam.setWorldSize(1024, 576);

$.data = {
  branch: 0,
  level: 0
};

$.scenemng.load(LevelSelectionScene);
