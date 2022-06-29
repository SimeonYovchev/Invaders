import { Position } from '../types/common';
import { getDistance, uuid } from './utils';

export class Projectile {
  public alive: boolean = true;
  public id: string = uuid();
  private _range: number = 400;
  private initialPosition: Position = {} as Position;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string,
    public velocity: { x: number; y: number },
  ) {
    this.initialPosition.x = x;
    this.initialPosition.y = y;
  }

  draw(ctx: CanvasRenderingContext2D | null | undefined) {
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx: CanvasRenderingContext2D | null | undefined) {
    if (!ctx) return;

    const distance = getDistance(this.initialPosition, { x: this.x, y: this.y });

    if (distance > this._range) {
      this.alive = false;
    }

    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x - this.radius >= ctx.canvas.width) {
      this.alive = false;
    }

    if (this.x + this.radius <= 0) {
      this.alive = false;
    }

    if (this.y - this.radius >= ctx.canvas.height) {
      this.alive = false;
    }

    if (this.y + this.radius <= 0) {
      this.alive = false;
    }
  }
}
