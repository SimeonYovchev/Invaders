import { Projectile } from './Projectile';
import razorRay from '../sounds/razor-ray.wav';

const gunSound = new Audio(razorRay);

export class Player {
  private _projectiles: Projectile[] = [];
  private _health = 100;
  public demage = 50;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string,
    public velocity: { x: number; y: number },
  ) {}

  draw(ctx: CanvasRenderingContext2D) {
    if (!ctx) return;

    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  update(ctx: CanvasRenderingContext2D) {
    this.x += this.velocity.x;
    this.y += this.velocity.y;

    if (this.x + this.radius > ctx.canvas.width) {
      this.x = ctx.canvas.width - this.radius;
    }

    if (this.x < this.radius) {
      this.x = this.radius;
    }

    if (this.y + this.radius > ctx.canvas.height) {
      this.y = ctx.canvas.height - this.radius;
    }

    if (this.y - this.radius < 0) {
      this.y = this.radius;
    }

    this._projectiles = this._projectiles.filter((projectile) => projectile.alive);
  }

  get health() {
    return this._health;
  }

  set health(newHealt: number) {
    this._health = newHealt;
  }

  getProjectiles() {
    return this._projectiles;
  }

  addProjectile(projectile: Projectile) {
    this._projectiles = [...this._projectiles, projectile];

    if (gunSound.paused) {
      gunSound.play();
    } else {
      gunSound.currentTime = 0;
    }
  }

  removeProjectile(id: string) {
    this._projectiles = this._projectiles.filter((projectile) => projectile.id !== id);
  }
}
