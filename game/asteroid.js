import {
    asteroid_large1, asteroid_large2, asteroid_large3,
    asteroid_medium1, asteroid_medium2, asteroid_medium3,
    asteroid_small1, asteroid_small2, asteroid_small3,
} from './util/sprites.js'

const getAsteroidSizeVersion = (version = 1, size = "large") => {
    switch (size) {
        case "large":
            switch (version) {
                case 1:
                    return asteroid_large1;
                case 2:
                    return asteroid_large2;
                case 3:
                    return asteroid_large3;
            }
        case "medium":
            switch (version) {
                case 1:
                    return asteroid_medium1;
                case 2:
                    return asteroid_medium2;
                case 3:
                    return asteroid_medium3;
            }
        case "small":
            switch (version) {
                case 1:
                    return asteroid_small1;
                case 2:
                    return asteroid_small2;
                case 3:
                    return asteroid_small3;
            }
    }
}

export class Asteroid {
    constructor(game, size = "large") {
        this.game = game;
        this.size = size;
        this.edge = Math.round(Math.random() * 3);
        this.version = Math.round(Math.random() * 2) + 1;
        const version = getAsteroidSizeVersion(this.version, this.size);
        this.animationAngle = Math.random() * Math.PI * 2;
        this.enteredX = true;
        this.enteredY = true;
        if (this.size === 'large') {
            switch (this.edge) {
                case 0:
                    this.x = -version[3] / 2;
                    this.y = Math.random() * this.game.height;
                    this.angle = Math.random() * Math.PI / 2 - Math.PI / 4;
                    this.enteredX = false;
                    break;
                case 1:
                    this.x = Math.random() * this.game.width;
                    this.y = -version[4] / 2;
                    this.angle = Math.random() * Math.PI / 2 - Math.PI / 4 + Math.PI / 2;
                    this.enteredY = false;
                    break;
                case 2:
                    this.x = this.game.width + version[3] / 2;
                    this.y = Math.random() * this.game.height;
                    this.angle = Math.random() * Math.PI / 2 - Math.PI / 4 + Math.PI;
                    this.enteredX = false;
                    break;
                case 3:
                    this.x = Math.random() * this.game.width;
                    this.y = this.game.height + version[4] / 2;
                    this.angle = Math.random() * Math.PI / 2 - Math.PI / 4 + Math.PI * 1.5;
                    this.enteredY = false;
                    break;
            }
        }
        this.speed = Math.random() + 0.5;
    }

    update() {
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.animationAngle += 0.01;
        if (this.x < 0 && this.enteredX) {
            this.x += this.game.width;
        }
        if (this.x > this.game.width && this.enteredX) {
            this.x -= this.game.width;
        }
        if (this.y < 0 && this.enteredY) {
            this.y += this.game.height;
        }
        if (this.y > this.game.height && this.enteredY) {
            this.y -= this.game.height;
        }
        if (this.x > 0 && this.x < this.game.width) {
            this.enteredX = true;
        }
        if (this.y > 0 && this.y < this.game.height) {
            this.enteredY = true;
        }
    }

    getHitbox() {
        const version = getAsteroidSizeVersion(this.version, this.size);
        const treshold = {
            "small": 12,
            "medium": 16,
            "large": 32,
        }
        return [
            this.x - version[3] / 2 + treshold[this.size],
            this.y - version[4] / 2 + treshold[this.size],
            this.x + version[3] / 2 - treshold[this.size],
            this.y + version[4] / 2 - treshold[this.size],
        ]
    }

    destroy() {
        this.game.addPoints(this.game.config.points[this.size]);
        if (this.size === "small") {
            this.game.asteroids.splice(this.game.asteroids.indexOf(this), 1);
        } else {
            const asteroid1 = new Asteroid(this.game, this.size === "large" ? "medium" : "small");
            asteroid1.x = this.x;
            asteroid1.y = this.y;
            asteroid1.edge = this.edge;
            asteroid1.version = Math.round(Math.random() * 2) + 1;
            asteroid1.angle = this.angle + Math.PI / 6;
            asteroid1.speed = this.speed * (1 + Math.random());
            this.game.asteroids.push(asteroid1);

            const asteroid2 = new Asteroid(this.game, this.size === "large" ? "medium" : "small");
            asteroid2.x = this.x;
            asteroid2.y = this.y;
            asteroid2.edge = this.edge;
            asteroid2.version = Math.round(Math.random() * 2) + 1;
            asteroid2.angle = this.angle - Math.PI / 6;
            asteroid2.speed = this.speed * (1 + Math.random());
            this.game.asteroids.push(asteroid2);


            this.game.asteroids.splice(this.game.asteroids.indexOf(this), 1);
        }
    }

    draw() {
        this.game.context.save();
        this.game.context.beginPath();
        this.game.context.translate(this.x, this.y);
        this.game.context.rotate(this.animationAngle);
        const version = getAsteroidSizeVersion(this.version, this.size);
        this.game.context.drawImage(
            ...version,
            -version[3] / 2, -version[4] / 2,
            version[3], version[4]);
        this.game.context.closePath();
        this.game.context.restore();

    }
}
