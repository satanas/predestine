class Drone extends Sprite {
  constructor(x, y) {
    super(x, y, GRID, GRID);
    this.speed = 0.25;
    this.anim = new Animator(['#0f0', '#fff'], 100);
    //this.emitter = new Emitter(Vector.fromAngle(0, 2));
    this.ops = [FW, FW, FW, FW, FW, TR, FW, FW, FW, FW, FW, TL, FW, FW];
    this.ops.reverse();
    this.op = null;
    this.direction = RG;
  }

  update(dt) {
    let dx = 0, dy = 0, result;

    if (!this.op && this.ops.length > 0) {
      let op = this.ops.pop();
      if (op === FW) {
        this.op = new Move(this.x, this.y, this.direction, this.speed);
      } else if (op === TR || op === TL) {
        this.op = new Turn(this.direction, op);
      }
      console.log('Operation', this.op);
    }

    if (this.op) {
      result = this.op.inc(this.x, this.y, dt);
      if (this.op.done) {
        this.op = null;
      }

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

    // Check collisions
    $.coll.betweenGroup(this, $.groups.actions, (player, enemy) => {
      this.anim.update(dt);
      this.color = this.anim.get();
    });
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


class Turn {
  constructor(origDir, chgDir) {
    this.done = false;
    this.pauseTime = 500;
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

  inc(x, y, dt) {
    this.pauseTime -= dt;
    if (this.pauseTime <= 0) {
      this.done = true;
    }
    return {
      direction: this.dst
    };
  }
}

class Move {
  constructor(x, y, dir, speed) {
    this.dir = dir;
    this.done = false;
    this.pauseTime = 500;
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

  inc(x, y, dt) {
    let curr = new Vector(x, y);

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
      this.pauseTime -= dt;
      if (this.pauseTime <= 0) {
        this.done = true;
      }
    }

    return {
      x: curr.x,
      y: curr.y
    };
  }
}
