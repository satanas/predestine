$.init = function() {
  // Viewport height
  $.vh = $.canvas.height;
  // Viewport width
  $.vw = $.canvas.width;
  // Canvas context for drawing on-screen
  $.ctx = $.canvas.getContext('2d');

  $.groups = {};
  $.input = new Input();
  $.cam = new Camera($.vw, $.vh);
  $.coll = new Collision(); // Collision detection
  $.txt = new TextRenderer();
}

function resize() {
  let w = floor(window.innerWidth),
      h = floor(w * 9 / 16);

  $.canvas.style.width = w + 'px';
  $.canvas.style.height = h + 'px';
  $.canvas.style.marginTop = floor((window.innerHeight - h) / 2) + 'px';
}

// Request Animation Frame
raf = window.requestAnimationFrame ||
  window.webkitRequestAnimationFrame ||
  window.mozRequestAnimationFrame ||
  function(a){ window.setTimeout(a,1E3/60); };

// Cancel Animation Frame
caf = window.cancelAnimationFrame ||
  window.mozCancelAnimationFrame;

window.addEventListener('load', resize, false);
window.addEventListener('resize', resize, false);
