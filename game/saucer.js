import {saucer} from "./util/sprites.js";
import {Ball} from "./ball.js";

export class Saucer {
    constructor(game, version = "dumb") {
        this.x = -saucer[3] / 2;
        this.entered = false;
        this.y = 40 + Math.random() * (game.height - 80);
        this.game = game;
        this.angle = 0;
        this.version = version;
        this.speed = version === "smart" ? 1.5 : 1;
        this.ticks = 0;
        this.balls = [];
        this.alive = true;
    }
    update() {
        if (!this.alive) {
            return;
        }
        this.ticks++;
        if (this.version === "smart") {
            const ship = this.game.player;
            const dx = ship.x - this.x;
            const dy = ship.y - this.y;
            this.angle = Math.atan2(dy, dx);
        }
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        if (this.x > this.game.width + saucer[3] / 2) {
            this.x = -saucer[3] / 2;
        }
        if (this.y > this.game.height + saucer[4] / 2) {
            this.y = -saucer[4] / 2;
        }
        if (this.y < -saucer[4] / 2) {
            this.y = this.game.height + saucer[4] / 2;
        }
        if (this.x < -saucer[3] / 2 && this.entered) {
            this.x = this.game.width + saucer[3] / 2;
        }
        if (this.x > 0 && !this.entered) {
            this.entered = true;
        }
        if (this.ticks % (this.version === "smart" ? 300 : 100) === 0) {
            this.shoot();
        }
        for (const ball of this.balls) {
            ball.update();
        }
    }
    shoot() {
        if (this.version === "smart") {
            const ship = this.game.player;
            const dx = ship.x - this.x;
            const dy = ship.y - this.y;
            const angle = Math.atan2(dy, dx);
            this.balls.push(new Ball(this, this.x, this.y, angle));
        } else {
            const shipY = this.game.player.y;
            if (this.y < shipY) {
                this.balls.push(new Ball(this, this.x, this.y, Math.PI / 2 - Math.PI / 4 + Math.random() * Math.PI / 2));
            } else {
                this.balls.push(new Ball(this, this.x, this.y, Math.PI * 1.5 - Math.PI / 4 + Math.random() * Math.PI / 2));
            }
        }
    }
    getHitbox() {
        const treshold = 12;
        return [
            this.x - saucer[3] / 2 + treshold,
            this.y - saucer[4] / 2 + treshold,
            this.x + saucer[3] / 2 - treshold,
            this.y + saucer[4] / 2 - treshold,
        ]
    }
    destroy() {
        this.game.addPoints(this.version === "smart" ? this.game.config.points.smallSaucer : this.game.config.points.largeSaucer);
        this.alive = false;
        this.game.saucer = null;
        for (const ball of this.balls) {
            ball.destroy();
        }
        this.game.lastSaucerTick = this.game.ticks;
    }
    draw() {
        this.game.context.save();
        this.game.context.translate(this.x, this.y);
        this.game.context.drawImage(...saucer, -saucer[3] / 2, -saucer[4] / 2, saucer[3], saucer[4]);
        this.game.context.restore();
        for (const ball of this.balls) {
            ball.draw();
        }
    }
}
