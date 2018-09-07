/**
 * Basic renderer for default fonts
 */
class TextRenderer {
  constructor(font, color, width) {
    this.color = color;
    this.font = String(width) + "px " + (font || "serif");
  }

  render(ctx, text, x, y) {
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.font = this.font;
    ctx.fillText(text, x, y);
    ctx.restore();
  }
}
