/**
 * Basic renderer for default fonts
 */
class TextRenderer {
  constructor(font) {
    this.font = font || "serif";
  }

  render(ctx, text, x, y, color, fontWidth) {
    ctx.save();
    ctx.fillStyle = color;
    ctx.font = String(fontWidth) + "px " + this.font;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
