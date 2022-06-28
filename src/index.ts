import { getCanvasContext } from './canvasContext';
import { Player } from './Player';
import { Projectile } from './Projectile';
import { Enemy } from './Enemy';
import { getRandomNumberInRange, removeElementFromArray } from './utils';
import { Star } from './Star';

import impact2 from '../sounds/impact2.wav';
import impact4 from '../sounds/impact4.wav';
import bomb from '../sounds/boom.wav';

const impact2Sound = new Audio(impact2);
const impact4Sound = new Audio(impact4);
const bombSound = new Audio(bomb);

import './styles.scss';

(() => {
  const { canvas, ctx } = getCanvasContext();
  if (!canvas || !ctx) return;

  canvas.width = innerWidth;
  canvas.height = innerHeight;

  const player = new Player(canvas.width / 2, canvas.height / 2, 15, 'white', { x: 0, y: 0 });
  // let projectiles: Projectile[] = [];
  let enemies: Enemy[] = [];
  const stars: Star[] = [];

  let spawnEnemiesInterval: NodeJS.Timer;
  const keys = {
    left: { pressed: false },
    right: { pressed: false },
    up: { pressed: false },
    down: { pressed: false },
  };

  let lastKeyPressed: string;
  let requestAnimationFrameID: number;

  const createBackgroundStars = () => {
    for (let i = 0; i < 200; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const radius = Math.random() * 3;
      const star = new Star(x, y, radius, 'rgba(255,255,255,0.6)', { x: 0.5, y: 0 });
      stars.push(star);
    }
  };

  createBackgroundStars();

  const spawnEnemies = () => {
    spawnEnemiesInterval = setInterval(() => {
      const radius = getRandomNumberInRange(5, 30);
      let x;
      let y;

      if (Math.random() > 0.5) {
        x = Math.random() > 0.5 ? canvas.width + radius : 0 - radius;
        y = Math.random() * canvas.height;
      } else {
        x = Math.random() * canvas.width;
        y = Math.random() > 0.5 ? canvas.height + radius : 0 - radius;
      }

      const color = `hsl(${getRandomNumberInRange(0, 360)}, 50%, 50%)`;

      const angle = Math.atan2(player.y - y, player.x - x);
      const speed = getRandomNumberInRange(1, 1);
      const damage = getRandomNumberInRange(50, 300);
      const health = getRandomNumberInRange(100, 300);

      const velocity = {
        x: Math.cos(angle) * speed,
        y: Math.sin(angle) * speed,
      };
      const enemy = new Enemy(x, y, radius, color, health, damage, velocity);
      enemies.push(enemy);
    }, 3000);
  };

  spawnEnemies();

  const endGame = () => {
    cancelAnimationFrame(requestAnimationFrameID);
    clearInterval(spawnEnemiesInterval);
  };

  const animate = () => {
    requestAnimationFrameID = requestAnimationFrame(animate);
    ctx.fillStyle = 'rgba(0, 0, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      star.update(ctx);
      star.draw(ctx);
    });
    player.update(ctx);
    player.draw(ctx);

    player.getProjectiles().forEach((projectile) => {
      projectile.update(ctx);
      projectile.draw(ctx);
    });

    player.velocity.x = 0;
    player.velocity.y = 0;

    if (keys.left.pressed) {
      player.velocity.x = -3;
    }
    if (keys.right.pressed) {
      player.velocity.x = 3;
    }
    if (keys.up.pressed) {
      player.velocity.y = -3;
    }
    if (keys.down.pressed) {
      player.velocity.y = 3;
    }

    enemies = enemies.filter((enemy) => enemy.alive);

    enemies.forEach((enemy, enemyIndex) => {
      enemy.update(ctx);
      enemy.draw(ctx);

      const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

      if (dist - player.radius - enemy.radius < 1) {
        // An enemy hit Player
        player.health -= enemy.damage;

        if (player.health > 0) {
          impact2Sound.play();
          enemies = removeElementFromArray(enemies, enemyIndex);
        } else {
          impact4Sound.play();
          endGame();
        }
      }

      player.getProjectiles().forEach((projectile, projectileIndex) => {
        const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

        if (dist - enemy.radius - projectile.radius < 1) {
          // Player projectile hits an enemy
          enemy.health = enemy.health - player.demage;

          // console.log(enemy.health);
          if (enemy.health <= 0) {
            enemies = removeElementFromArray(enemies, enemyIndex);
            // bombSound.play();
            if (bombSound.paused) {
              bombSound.play();
            } else {
              bombSound.currentTime = 0;
            }
          } else {
            enemy.showHealthLabel();
          }

          player.removeProjectile(projectileIndex);
        }
      });
    });
  };

  const eventListeners: { type: keyof WindowEventMap; cb: (e: any) => void }[] = [
    {
      type: 'click',
      cb: (event: MouseEvent) => {
        const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x);
        const velocity = {
          x: Math.cos(angle) * 6,
          y: Math.sin(angle) * 6,
        };
        const projectile = new Projectile(player.x, player.y, 5, 'white', velocity);
        player.addProjectile(projectile);
      },
    },
    {
      type: 'resize',
      cb: (event) => {
        canvas.width = innerWidth;
        canvas.height = innerHeight;
        ctx.fillStyle = 'rgba(0,0,0)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        player.draw(ctx);
      },
    },
    {
      type: 'keydown',
      cb: (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
            keys.left.pressed = true;
            lastKeyPressed = 'ArrowLeft';
            break;
          case 'ArrowRight':
            keys.right.pressed = true;
            lastKeyPressed = 'ArrowRight';
            break;
          case 'ArrowUp':
            keys.up.pressed = true;
            lastKeyPressed = 'ArrowUp';
            break;
          case 'ArrowDown':
            keys.down.pressed = true;
            lastKeyPressed = 'ArrowDown';
            break;
        }
      },
    },
    {
      type: 'keyup',
      cb: (event: KeyboardEvent) => {
        switch (event.key) {
          case 'ArrowLeft':
            keys.left.pressed = false;
            break;
          case 'ArrowRight':
            keys.right.pressed = false;
            break;
          case 'ArrowUp':
            keys.up.pressed = false;
            break;
          case 'ArrowDown':
            keys.down.pressed = false;
            break;
        }
      },
    },
  ];

  eventListeners.forEach((listener) => addEventListener(listener.type, listener.cb));

  animate();
})();
