//# sourceMappingURL=all.min.js.map
const ENTER = 13,
      GRID = 64;

debug = false;

$.init(); // init(['collisions', 'sound', 'astar', ...])
// Bind keyboard
$.input.bind([ENTER]);
$.input.bindMouse();
$.cam.setWorldSize(1024, 576);

$.data = {
  branch: 0,
  level: 0
};

$.scenemng.load(MenuScene);
