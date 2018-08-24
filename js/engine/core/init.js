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
  $.collision = new Collision(); // Collision detection
  $.txt = new TextRenderer();
}

function resize() {
  let w = floor(W.innerWidth),
      h = floor(w * 9 / 16),
      t = floor((W.innerHeight - h) / 2),
      ev = new CustomEvent('rsize', {detail: {w:w, h:h, t:t}});

  console.log(w,h,t);
  resizeCanvas($.canvas, w, h);
  $.canvas.style.marginTop = t + 'px';
  W.dispatchEvent(ev);
}

function resizeCanvas(canvas, w, h, t) {
  canvas.style.width = w + 'px';
  canvas.style.height = h + 'px';
}

// Request Animation Frame
raf = W.requestAnimationFrame ||
  W.webkitRequestAnimationFrame ||
  W.mozRequestAnimationFrame ||
  function(a){ W.setTimeout(a,1E3/60); };

// Cancel Animation Frame
caf = W.cancelAnimationFrame ||
  W.mozCancelAnimationFrame;

W.addEventListener('load', resize, false);
W.addEventListener('resize', resize, false);
