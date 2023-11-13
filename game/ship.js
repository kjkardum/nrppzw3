import {ship, ship_moving, ship_piece_1, ship_piece_2, ship_piece_3, ship_piece_4, ship_piece_5} from "./util/sprites.js";
import {Ball} from "./ball.js";

/*
* when ship gets destroyed:
* each piece will fall in one direction, each will exist for 300ms longer than previous until all are removed from screen
* */
const ship_pieces_on_destroy = [ship_piece_1, ship_piece_2, ship_piece_3, ship_piece_4, ship_piece_5]

export class Ship {
    constructor(game) {
        this.game = game;
        this.x = this.game.width / 2;
        this.y = this.game.height / 2;
        this.angle = 0;
        this.speedX = 0;
        this.speedY = 0;
        this.acceleration = 0.1;
        this.deceleration = 0.99;
        this.rotationSpeed = 0.05;
        this.balls = [];
        this.pieces_on_destroy = [];
        this.dead = false;
        this.startShootCooldown = 2;
        this.shootCooldown = this.startShootCooldown;
        this.movingAnimationInterval = 3;
        this.movingAnimationTick = 0;
    }
    update() {
        this.movingAnimationTick = (this.movingAnimationTick + 1) % this.movingAnimationInterval;
        if (this.game.pressedKeys.includes('ArrowUp')) {
            this.speedX += Math.cos(this.angle) * this.acceleration;
            this.speedY += Math.sin(this.angle) * this.acceleration;
            if (this.sprite.toString() !== ship_moving.toString() && this.movingAnimationTick === 0) {
                this.sprite = ship_moving;
            } else if (this.sprite.toString() !== ship.toString() && this.movingAnimationTick === 0) {
                this.sprite = ship;
            }
        } else {
            this.sprite = ship;
        }
        if (this.dead) {
            this.pieces_on_destroy.forEach(piece => {
                piece.coordinates[0] += Math.cos(piece.angle) * 0.5;
                piece.coordinates[1] += Math.sin(piece.angle) * 0.5;
            });
            return;
        }
        if (this.game.pressedKeys.includes('ArrowLeft')) {
            this.angle -= this.rotationSpeed;
        }
        if (this.game.pressedKeys.includes('ArrowRight')) {
            this.angle += this.rotationSpeed;
        }
        if (this.game.pressedKeys.includes('Space')) {
            if (this.shootCooldown <= 0) {
                this.shoot();
                this.shootCooldown = this.startShootCooldown;
            }
        }
        this.shootCooldown -= 0.1;
        this.speedX *= this.deceleration;
        this.speedY *= this.deceleration;
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) {
            this.x += this.game.width;
        }
        if (this.x > this.game.width) {
            this.x -= this.game.width;
        }
        if (this.y < 0) {
            this.y += this.game.height;
        }
        if (this.y > this.game.height) {
            this.y -= this.game.height;
        }
        for (const ball of this.balls) {
            ball.update();
        }
        this.check_collision();
    }
    getHitbox() {
        const treshold = 20;
        return [
            this.x - ship[3] / 2 + treshold,
            this.y - ship[4] / 2 + treshold,
            this.x + ship[3] / 2 - treshold,
            this.y + ship[4] / 2 - treshold,
        ]
    }
    check_collision() {
        const treshold = 50;
        for (const asteroid of this.game.asteroids) {
            if (this.pieces_on_destroy.dead) {
                return;
            }
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
    }
    destroy() {
        this.dead = true;
        for (const ball of this.balls) {
            ball.destroy();
        }
        ship_pieces_on_destroy.forEach((piece, index) => {
            const piece_item = {
                coordinates: [this.x, this.y],
                angle: Math.random() * Math.PI * 2,
                sprite: piece
            }
            this.pieces_on_destroy.push(piece_item);
            setTimeout(() => {
                this.pieces_on_destroy.splice(this.pieces_on_destroy.indexOf(piece_item), 1);
            }, 500 * (index + 1));
        });
        if (this.game.lives > 0) {
            setTimeout(() => {
                this.game.lives--;
                this.dead = false;
                this.x = this.game.width / 2;
                this.y = this.game.height / 2;
                this.angle = 0;
                this.speedX = 0;
                this.speedY = 0;
            }, 500 * (ship_pieces_on_destroy.length + 4));
        } else {
            setTimeout(() => {
                this.game.stop();
            }, 500 * (ship_pieces_on_destroy.length + 1));
        }
    }
    shoot() {
        this.balls.push(new Ball(
            this,
            this.x + Math.cos(this.angle) * 32,
            this.y + Math.sin(this.angle) * 32,
            this.angle
        ));
    }
    draw() {
        if (this.dead) {
            for (const piece of this.pieces_on_destroy) {
                this.game.context.save();
                this.game.context.translate(piece.coordinates[0], piece.coordinates[1]);
                this.game.context.rotate(piece.angle);
                this.game.context.drawImage(...piece.sprite, -piece.sprite[3] / 2, -piece.sprite[4] / 2, piece.sprite[3], piece.sprite[4]);
                this.game.context.restore();
            }
            return;
        }
        this.game.context.save();
        this.game.context.translate(this.x, this.y);
        this.game.context.rotate(this.angle);
        this.game.context.drawImage(...this.sprite, -ship[3] / 2, -ship[4] / 2, ship[3], ship[4]);
        this.game.context.restore();
        for (const ball of this.balls) {
            ball.draw();
        }
    }
}
