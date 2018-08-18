/**
 * A class that implements asteroid's font using vectors
 * https://www.dafont.com/hyperspace.font
 */
class TextRenderer {
  constructor() {
    // Individual segments
    let lv = [0,0,0,1], // left vertical
        rv = [1,0,1,1], // right vertical
        th = [0,0,1,0], // top horizontal
        mh = [0,1/2,1,1/2], // middle horizontal
        bh = [0,1,1,1], // bottom horizontal
        // Common base for letters
        f = [lv, th, [0,1/2,3/4,1/2]],
        l = [lv, bh],
        c = l.concat([th]),
        t = [th, [1/2,0,1/2,1]],
        p = [lv, th, [1,0,1,1/2], [1,1/2,0,1/2]],
        h3 = [th, bh, mh],
        s = h3.concat([[0,0,0,1/2], [1,1/2,1,1]]),
        dot = [[1/3,1,1/2,1]];

    this.font = {
      'A': [[0,1/3,0,1], [0,1/3,1/2,0], [1/2,0,1,1/3], [1,1/3,1,1], [0,2/3,1,2/3]],
      'B': [lv, [0,0,2/3,0], [2/3,0,1,1/6], [1,1/6,1,2/6], [1,2/6,2/3,1/2], [2/3,1/2,1,2/3], [1,2/3,1,5/6], [1,5/6,2/3,1], [2/3,1,0,1], [0,1/2,2/3,1/2]],
      'C': c,
      'D': [lv, [0,0,1/2,0], [0,1,1/2,1], [1/2,0,1,1/3], [1/2,1,1,2/3], [1,1/3,1,2/3]],
      'E': f.concat([bh]),
      'F': f,
      'G': c.concat([[1,0,1,1/3], [1,1,1,2/3], [1,2/3,1/2,2/3]]),
      'H': [lv, rv, mh],
      'I': t.concat([bh]),
      'J': [[0,2/3,1/2,1], [1/2,1,1,1], [1,1,1,0]],
      'K': [lv, [0,1/2,1,0], [0,1/2,1,1]],
      'L': l,
      'M': [lv, [0,0,1/2,1/3], [1/2,1/3,1,0], rv],
      'N': [lv, [0,0,1,1], [1,1,1,0]],
      'O': c.concat([rv]),
      'P': p,
      'Q': [lv, th, [1,0,1,2/3], [1,2/3,1/2,1], [1/2,1,0,1], [1/2,2/3,1,1]],
      'R': p.concat([[0,1/2,1,1]]),
      'S': s,
      'T': t,
      'U': l.concat([[1,1,1,0]]),
      'V': [[0,0,1/2,1], [1/2,1,1,0]],
      'W': [lv, [0,1,1/2,2/3], [1/2,2/3,1,1], [1,1,1,0]],
      'X': [[0,0,1,1], [1,0,0,1]],
      'Y': [[0,0,1/2,1/3], [1/2,1/3,1,0], [1/2,1/3,1/2,1]],
      'Z': [th, [1,0,0,1], bh],
      '0': c.concat([rv, [1,0,0,1]]),
      '1': [[1/2,0,1/2,1]],
      '2': h3.concat([[1,0,1,1/2], [0,1/2,0,1]]),
      '3': h3.concat([[1,0,1,1/2], [1,1/2,1,1]]),
      '4': [[0,0,0,1/2], mh, rv],
      '5': s,
      '6': [lv, mh, bh, [1,1/2,1,1]],
      '7': [th, rv],
      '8': s.concat([[1,0,1,1/2], [0,1/2,0,1]]),
      '9': [th, rv, mh, [0,0,0,1/2]],
      '.': dot,
      ':': dot.concat([[1/3,1/3,1/2,1/3]]),
      '@': c.concat([[1,0,1,2/3], [1,2/3,1/3,2/3], [1/3,2/3,1/3,1/3], [1/3,1/3,1,1/3]]),
      ' ': []
    };
  }

  render(text, x, y, color, fontWidth) {
    // Render single-line words
    let i, m, n, letter, seg, fontHeight, offset, spacing;
    fontHeight = floor(fontWidth * 3 / 2);
    offset = 0;
    spacing = floor(fontWidth / 3);

    $.ctx.save();
    $.ctx.strokeStyle = color;
    $.ctx.lineWidth = 2;
    $.ctx.beginPath();
    // Render each letter
    for (i = 0; i < text.length; i++) {
      letter = this.font[text.charAt(i)];
      // Render each segment of a letter
      for (m = 0; m < letter.length; m++) {
        seg = letter[m];
        $.ctx.moveTo(floor(x + offset + (seg[0] * fontWidth)), floor(y + (seg[1] * fontHeight)));
        $.ctx.lineTo(floor(x + offset + (seg[2] * fontWidth)), floor(y + (seg[3] * fontHeight)));
      }
      offset += fontWidth + spacing;
    }
    $.ctx.stroke();
    $.ctx.restore();
  }
}
