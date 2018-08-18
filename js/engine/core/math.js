let abs = Math.abs,
    cos = Math.cos,
    sin = Math.sin,
    tan = Math.tan,
    atan = Math.atan,
    atan2 = Math.atan2,
    ceil = Math.ceil,
    floor = Math.floor,
    max = Math.max,
    min = Math.min,
    pow = Math.pow,
    sqrt = Math.sqrt,
    round = Math.round,
    rnd = Math.random,
    now = Date.now,
    PI = Math.PI,
    // Limit number n to range [l, h] (both inclusives). h is optional
    clamp = function(n, l, h) {
      if (n < l) return l;
      if (h !== null && h !== undefined && n > h) return h;
      return n;
    },
    // Generate random integer between min (inclusive) and max (exclusive) range
    rndi = function(a, b) {
      return floor(rnd() * (b - a)) + a;
    },
    // Choose random element from array
    rnda = function(e) {
      return e[rndi(0, e.length)];
    };
