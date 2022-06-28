import { Projectile } from './Projectile';
import { removeElementFromArray } from './utils';

export class Enemy {
  public alive: boolean = true;
  private _projectiles: Projectile[] = [];
  // private _health = 100;
  // public damage = 50;

  constructor(
    public x: number,
    public y: number,
    public radius: number,
    public color: string,
    private _health: number,
    public damage: number,
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
    // console.log(this.x);

    // console.log(this.x + this.radius * 2);

    if (this.x + this.radius >= ctx.canvas.width + this.radius * 2) {
      this.alive = false;
    }

    if (this.x <= -(this.radius * 2)) {
      this.alive = false;
    }

    // if (this.y + this.radius >= ctx.canvas.height) {
    //   this.alive = false;
    // }

    // if (this.y <= -this.radius) {
    //   this.alive = false;
    // }
  }
  get health() {
    return this._health;
  }

  set health(newHealth: number) {
    this._health = newHealth;
  }

  getProjectiles() {
    return this._projectiles;
  }

  addProjectile(projectile: Projectile) {
    const newProjectiles = [...this._projectiles, projectile];
    this._projectiles = newProjectiles;
  }

  removeProjectile(index: number) {
    this._projectiles = removeElementFromArray(this._projectiles, index);
  }

  showHealthLabel() {
    const scoreLabel = document.createElement('label');
    scoreLabel.innerHTML = Math.floor(this.health) + '';
    scoreLabel.style.color = 'white';
    scoreLabel.style.position = 'absolute';
    scoreLabel.style.left = this.x + 'px';
    scoreLabel.style.top = this.y + 'px';
    scoreLabel.style.userSelect = 'none';
    scoreLabel.style.pointerEvents = 'none';
    document.body.appendChild(scoreLabel);

    let newValue = 0;

    scoreLabel.style.display = 'block';
    scoreLabel.style.opacity = '1';
    scoreLabel.style.color = this.color;

    let fadeOutInterval = setInterval(function () {
      if (newValue > 0) {
        newValue -= 0.01;
      } else if (newValue < 0) {
        scoreLabel.style.opacity = '0';
        scoreLabel.style.display = 'none';
        clearInterval(fadeOutInterval);
        scoreLabel.remove();
      }

      scoreLabel.style.opacity = newValue + '';
    }, 750);
  }
}
