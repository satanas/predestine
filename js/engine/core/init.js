$.init = function() {
  // Viewport height
  $.vh = $.canvas[0].height;
  // Viewport width
  $.vw = $.canvas[0].width;
  // Canvas context for drawing on-screen
  $.ctx = $.canvas[1].getContext('2d'); // World
  $.ctx2 = $.canvas[0].getContext('2d'); // Fog

  $.groups = {};
  $.input = new Input();
  $.cam = new Camera($.vw, $.vh);
  $.coll = new Collision(); // Collision detection
  $.txt = new TextRenderer();
}

function resize() {
  let w = floor(window.innerWidth),
      h = floor(w * 9 / 16),
      i;

  for(i = 0; i < $.canvas.length; i++) {
    $.canvas[i].style.width = w + 'px';
    $.canvas[i].style.height = h + 'px';
    $.canvas[i].style.marginTop = floor((window.innerHeight - h) / 2) + 'px';
  }
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
