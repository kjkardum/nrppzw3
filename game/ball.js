import {ball_small} from "./util/sprites.js";

export class Ball {
    constructor(ship, x, y, angle) {
        this.ship = ship;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = 10;
    }
    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x < 0 || this.x > this.ship.game.width || this.y < 0 || this.y > this.ship.game.height) {
            this.ship.balls.splice(this.ship.balls.indexOf(this), 1);
        }
        this.check_collision();
    }
    getHitbox = () => {
        const treshold = 8;
        return [
            this.x - ball_small[3] / 2 + treshold,
            this.y - ball_small[4] / 2 + treshold,
            this.x + ball_small[3] / 2 - treshold,
            this.y + ball_small[4] / 2 - treshold,
        ]
    };
    check_collision() {
        const treshold = 50;
        if (this.ship === this.ship.game.player) {
            for (const asteroid of this.ship.game.asteroids) {
                const asteroid_hitbox = asteroid.getHitbox();
                const hitbox = this.getHitbox();
                if (hitbox[0] > asteroid_hitbox[2]) {
                    continue;
                }
                if (hitbox[2] < asteroid_hitbox[0]) {
                    continue;
                }
                if (hitbox[1] > asteroid_hitbox[3]) {
                    continue;
                }
                if (hitbox[3] < asteroid_hitbox[1]) {
                    continue;
                }
                this.destroy();
                asteroid.destroy();
                return;
            }
            if (this.ship.game.saucer) {
                const saucer_hitbox = this.ship.game.saucer.getHitbox();
                const hitbox = this.getHitbox();
                if (hitbox[0] > saucer_hitbox[2]) {
                    return;
                }
                if (hitbox[2] < saucer_hitbox[0]) {
                    return;
                }
                if (hitbox[1] > saucer_hitbox[3]) {
                    return;
                }
                if (hitbox[3] < saucer_hitbox[1]) {
                    return;
                }
                this.destroy();
                this.ship.game.saucer.destroy();
                return;
            }
        } else {
            const hitbox = this.getHitbox();
            const ship_hitbox = this.ship.game.player.getHitbox();
            if (hitbox[0] > ship_hitbox[2]) {
                return;
            }
            if (hitbox[2] < ship_hitbox[0]) {
                return;
            }
            if (hitbox[1] > ship_hitbox[3]) {
                return;
            }
            if (hitbox[3] < ship_hitbox[1]) {
                return;
            }
            this.destroy();
            this.ship.game.player.destroy();
            this.ship.destroy();
        }
    }
    destroy() {
        this.ship.balls.splice(this.ship.balls.indexOf(this), 1);
    }
    draw() {
        this.ship.game.context.save();
        this.ship.game.context.translate(this.x, this.y);
        this.ship.game.context.rotate(this.angle);
        this.ship.game.context.drawImage(...ball_small, -ball_small[3] / 2, -ball_small[4] / 2, ball_small[3], ball_small[4]);
        this.ship.game.context.restore();
    }
}
