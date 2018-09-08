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
  $.scenemng = new SceneManager();
}

$.listen = function(ctx, evt) {
  W.addEventListener(evt, ctx[evt].bind(ctx));
}

$.emit = function(evt, data) {
  let ev = new CustomEvent(evt, {detail: data});
  W.dispatchEvent(ev);
}

$.easeInQuad = function(elapsed, begin, end, duration) {
  elapsed = elapsed / duration;
  return (end - begin) * pow(elapsed, 2) + begin;
}

$.easeOutQuad = function(elapsed, begin, end, duration) {
  elapsed = elapsed / duration;
  return (end + begin) * elapsed * (elapsed - 2) + begin;
}

$.canvas.create = function(w, h) {
  let canvas = D.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  return canvas;
}

function resize() {
  let w = floor(W.innerWidth),
      h = floor(w * 9 / 16),
      t = floor((W.innerHeight - h) / 2);

  console.log(w,h,t);
  resizeCanvas($.canvas, w, h);
  $.canvas.style.marginTop = t + 'px';
  $.emit('rsize', {w:w, h:h, t:t});
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
