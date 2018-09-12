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
  $.events = new Events();
  $.scenemng = new SceneManager();

  $.ctx.fillRoundRect = function(x, y, w, h, r) {
    r = r || 5;
    $.ctx.beginPath();
    $.ctx.moveTo(x + r, y);
    $.ctx.lineTo(x + w - r, y);
    $.ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    $.ctx.lineTo(x + w, y + h - r);
    $.ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    $.ctx.lineTo(x + r, y + h);
    $.ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    $.ctx.lineTo(x, y + r);
    $.ctx.quadraticCurveTo(x, y, x + r, y);
    $.ctx.closePath();
    $.ctx.fill();
  }

  $.ctx.fillArc = function(ctx, x, y, radius, start, end) {
    ctx.beginPath();
    ctx.arc(x, y, radius, start, end);
    ctx.closePath();
    ctx.fill();
  }
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
  let h = floor(W.innerHeight),
      w = floor(h * 16 / 9);

  if (w > W.innerWidth) {
    w = floor(W.innerWidth);
    h = floor(w * 9 / 16);
  }

  resizeCanvas($.canvas, w, h);
  //$.canvas.style.marginTop = t + 'px';
  $.events.emit('resizeCanvas', {w:w, h:h});
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
