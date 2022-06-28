export class Star {
  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string,
    public velocity: { x: number; y: number },
  ) {}

  draw(ctx: CanvasRenderingContext2D | null | undefined) {
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx: CanvasRenderingContext2D | null | undefined) {
    if (!ctx) return;

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x + this.radius > ctx.canvas.width) {
      this.x = -this.radius;
      this.y = Math.random() * ctx.canvas.height;
    }
  }
}
