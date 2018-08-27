class Drone extends Sprite {
  constructor(x, y, dir, ops) {
    super(x, y, GRID, GRID);
    this.speed = 0.25;
    this.anim = new Animator(['#0f0', '#fff'], 100);
    this.program = ops;
    this.program.reverse();
    this.currOp = null;
    this.direction = dir;
    this.color = '#f00';
    this.delayTime = 800; // ms
  }

  nextPosition() {
    let x, y;
    if (this.direction === DIR.UP) {
      x = this.x;
      y = this.y - GRID;
    } else if (this.direction === DIR.LF) {
      x = this.x - GRID;
      y = this.y;
    } else if (this.direction === DIR.RG) {
      x = this.x + GRID;
      y = this.y;
    } else if (this.direction === DIR.DW) {
      x = this.x;
      y = this.y + GRID;
    }
    return new Vector(x, y);
  }

  scanWalls(walls) {
    let nextPos = this.nextPosition();

    for (let wall of walls) {
      if (nextPos.eq(wall)) return wall;
    }
    return null;
  }

  scanActionables(actionables, groupId) {
    let objs = $.collision.group(this, actionables);
    if (objs.length === 0) return false;
    for (let obj of objs) {
      if (obj.groupId === groupId) return true;
    }
    return false;
  }

  // Instructions are turned into actions after evaluating the conditions
  update(dt, walls, actionables) {
    let dx = 0, dy = 0, result, inst;

    if (this.delayTime > 0) {
      this.delayTime -= dt;
      return;
    }

    // Get next instruction
    if (!this.currOp && this.program.length > 0) {
      inst = this.program.pop();
      // Evaluate operation. Return NoOp if cannot perform operation
      // Check for movement instructions
      if ((inst === ACTIONS.FW || inst === ACTIONS.BW) && this.scanWalls(walls)) {
        this.currOp = new NoOp();
        console.log('cannot move, object blocking');
      } else if ((inst === ACTIONS.RP || inst === ACTIONS.EX) && !this.scanActionables(actionables, inst)) {
        this.currOp = new NoOp();
        console.log('no actionables near by');
      } else {
        this.currOp = Action.create(inst, this);
      }
      console.log('action', this.currOp);
    }

    // Execute instruction
    if (this.currOp) {
      result = this.currOp.inc(this, dt);
      if (this.currOp.done) this.currOp = null;

      // {direction:x, x:y, y:z}
      for (let prop in result) {
        this[prop] = result[prop];
      }
    }

    //this.bounds.update(this);
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.fillStyle = '#000';
    if (this.direction === DIR.RG) {
      $.ctx.fillRect(rect.bounds.right - 10, rect.y + (this.h / 2) - 4, 8, 8);
    } else if (this.direction === DIR.LF) {
      $.ctx.fillRect(rect.bounds.left + 2, rect.y + (this.h / 2) - 4, 8, 8);
    } else if (this.direction === DIR.UP) {
      $.ctx.fillRect(rect.x + (this.w / 2), rect.y + 2, 8, 8);
    } else if (this.direction === DIR.DW) {
      $.ctx.fillRect(rect.x + (this.w / 2), rect.bounds.bottom - 10, 8, 8);
    }
    $.ctx.restore();
  }
}

class Action {
  constructor() {
    this.done = false;
    this.pauseTime = 500;
  }

  static create(op, obj) {
    if (op === ACTIONS.FW) {
      return new Move(obj.x, obj.y, obj.direction, obj.speed);
    } else if (op === ACTIONS.TR || op === ACTIONS.TL) {
      return new Turn(obj.direction, op);
    } else if (op === ACTIONS.RP) {
      return new Operation('repair');
    }
  }

  tick(dt) {
    this.pauseTime -= dt;
    if (this.pauseTime <= 0) this.done = true;
  }
}
class Operation extends Action {
  constructor(groupId) {
    super();
    this.opTime = 1500;
    this.groupId = groupId;
  }

  inc(obj, dt) {
    if (this.opTime > 0) {
      this.opTime -= dt;
      console.log('doing operation');
      if (this.opTime <= 0) {
        // Send signal
        console.log('operation done');
      }
    } else {
      this.tick(dt);
    }
    return {};
  }
}

class Turn extends Action {
  constructor(origDir, inst) {
    super();

    if (inst === ACTIONS.TR) {
      if (origDir === DIR.RG) this.dst = DIR.DW;
      if (origDir === DIR.DW) this.dst = DIR.LF;
      if (origDir === DIR.LF) this.dst = DIR.UP;
      if (origDir === DIR.UP) this.dst = DIR.RG;
    } else {
      if (origDir === DIR.RG) this.dst = DIR.UP;
      if (origDir === DIR.UP) this.dst = DIR.LF;
      if (origDir === DIR.LF) this.dst = DIR.DW;
      if (origDir === DIR.DW) this.dst = DIR.RG;
    }
  }

  inc(obj, dt) {
    this.tick(dt);
    return {
      direction: this.dst
    };
  }
}

class Move extends Action {
  constructor(x, y, dir, speed) {
    super();
    this.dir = dir;
    this.xspeed = this.yspeed = 0;

    // Move left-right
    if (this.dir === DIR.LF) {
      this.xspeed = -speed;
      this.dst = new Vector(x - GRID, y);
    } else if (this.dir === DIR.RG) {
      this.xspeed = speed;
      this.dst = new Vector(x + GRID, y);
    }

    // Move up-down
    if (this.dir === DIR.UP) {
      this.yspeed = -speed;
      this.dst = new Vector(x, y - GRID);
    } else if (this.dir === DIR.DW) {
      this.yspeed= speed;
      this.dst = new Vector(x, y + GRID);
    }
  }

  inc(obj, dt) {
    let curr = new Vector(obj.x, obj.y);

    // If we haven't reached the destination
    if (!curr.gte(this.dst)) {
      curr.x += this.xspeed * dt;
      curr.y += this.yspeed * dt;
      // Check if we passed the destination
      if (curr.gte(this.dst)) {
        curr.x = this.dst.x;
        curr.y = this.dst.y;
      }
    } else {
      this.tick(dt);
    }

    return {
      x: curr.x,
      y: curr.y
    };
  }
}

class NoOp extends Action {
  constructor() {
    super();
    this.pauseTime = 1000;
  }

  inc(obj, dt) {
    this.tick(dt);
    return {};
  }
}
