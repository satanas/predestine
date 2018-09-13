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

$.scenemng.load(AuxiliaryScene);

// create a new Web Audio API context
//var ac = new AudioContext();
//
//// set the playback tempo (120 beats per minute)
//var tempo = 120;
//
//// create a new sequence
//var sequence = new Sequence( ac, tempo, [
//  'G3 q',
//  'E4 q',
//  'C4 h'
//]);
//
//// disable looping
//sequence.loop = false;
//
//// play it
//sequence.play();
