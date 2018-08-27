class Level {
  constructor(strLvl) {
    this.walls = [];
    this.repair = [];
    this.extinguish = [];
    this.dock = this.exit = 0;

    let line, elem, x, y;
    for (y in strLvl) {
      line = strLvl[y];
      for (x in line) {
        elem = line.charAt(x);
        if (elem === 'W') {
          this.walls.push([x, y]);
        } else if (elem === 'D') {
          this.dock = [x, y];
        } else if (elem === 'R') {
          this.repair.push([x, y]);
        } else if (elem === 'F') {
          this.extinguish.push([x, y]);
        } else if (elem === 'X') {
          this.exit = [x, y];
        }
      }
    }
  }
}
