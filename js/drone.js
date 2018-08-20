class Drone extends Sprite {
  constructor(x, y) {
    super(x, y, GRID, GRID);
    this.speed = 0.25;
    this.anim = new Animator(['#0f0', '#fff'], 100);
    //this.emitter = new Emitter(Vector.fromAngle(0, 2));
    this.ops = [FW, FW, FW, FW, FW, TR, FW, FW, FW, FW, RP, TL, FW, FW];
    this.ops.reverse();
    this.op = null;
    this.direction = RG;
  }

  update(dt) {
    let dx = 0, dy = 0, result;

    if (!this.op && this.ops.length > 0) {
      this.op = Action.create(this.ops.pop(), this);
      console.log('Operation', this.op);
    }

    if (this.op) {
      result = this.op.inc(this, dt);
      if (this.op.done) this.op = null;

      // {direction:x, x:y, y:z}
      for (let prop in result) {
        this[prop] = result[prop];
      }
    }

    //// Mouse down
    //if ($.input.isLeftClick()) {
    //  //console.log('hahaha', $.input.mousePos);
    //  //this.emitter.emit($.input.mousePos);
    //}
    this.color = '#f00';

    // TODO: How to call this automagically?
    this.bounds.update(this);
  }

  render(rect) {
    $.ctx.save();
    $.ctx.fillStyle = this.color;
    $.ctx.fillRect(rect.x, rect.y, this.w, this.h);
    $.ctx.fillStyle = '#000';
    if (this.direction === RG) {
      $.ctx.fillRect(rect.bounds.right - 10, rect.y + (this.h / 2) - 4, 8, 8);
    } else if (this.direction === LF) {
      $.ctx.fillRect(rect.bounds.left + 2, rect.y + (this.h / 2) - 4, 8, 8);
    } else if (this.direction === UP) {
      $.ctx.fillRect(rect.x + (this.w / 2), rect.y + 2, 8, 8);
    } else if (this.direction === DW) {
      $.ctx.fillRect(rect.x + (this.w / 2), rect.bounds.bottom - 10, 8, 8);
    }
    $.ctx.restore();
  }
}

class Action {
  constructor() {
    this.done = false;
    this.cancelled = false;
    this.pauseTime = 500;
  }

  static create(op, obj) {
    if (op === FW) {
      return new Move(obj.x, obj.y, obj.direction, obj.speed);
    } else if (op === TR || op === TL) {
      return new Turn(obj.direction, op);
    } else if (op === RP) {
      return new Operation('repair');
    }
  }

  tick(dt) {
    this.pauseTime -= dt;
    if (this.pauseTime <= 0) this.done = true;
  }

  cancel(groupId) {
    console.log('Nothing to ' + groupId + '. Operation cancelled');
    this.cancelled = true;
  }
}
class Operation extends Action {
  constructor(groupId) {
    super();
    this.opTime = 1500;
    this.groupId = groupId;

    // Check collisions
    let objs = $.coll.betweenGroup(this, $.groups.actions);
    if (objs.length === 0 || objs[0].groupId !== this.groupId) {
      // cancel operation
      this.pauseTime = 800;
      this.cancel(groupId);
    } else {
      this.actionId = objs[0].id;
    }
  }

  inc(obj, dt) {
    if (this.opTime > 0 && !this.cancelled) {
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
  constructor(origDir, chgDir) {
    super();
    this.dst = origDir;

    if (chgDir === TR) {
      if (origDir === RG) this.dst = DW;
      if (origDir === DW) this.dst = LF;
      if (origDir === LF) this.dst = UP;
      if (origDir === UP) this.dst = RG;
    } else {
      if (origDir === RG) this.dst = UP;
      if (origDir === UP) this.dst = LF;
      if (origDir === LF) this.dst = DW;
      if (origDir === DW) this.dst = RG;
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
    if (this.dir === LF) {
      this.xspeed = -speed;
      this.dst = new Vector(x - GRID, y);
    } else if (this.dir === RG) {
      this.xspeed = speed;
      this.dst = new Vector(x + GRID, y);
    }

    // Move up-down
    if (this.dir === UP) {
      this.yspeed = -speed;
      this.dst = new Vector(x, y - GRID);
    } else if (this.dir === DW) {
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
