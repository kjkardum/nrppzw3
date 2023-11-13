import { Asteroid } from './asteroid.js';
import {Ship} from "./ship.js";
import {default_config} from "./util/config.js";
import {ship} from "./util/sprites.js";
import {Saucer} from "./saucer.js";

export class Game {
    constructor(canvas, config = default_config) {
        config = {...default_config, ...config}
        this.canvas = canvas;
        this.context = canvas.getContext('2d');
        this.context.fillStyle = 'white';
        this.width = canvas.width;
        this.height = canvas.height;
        this.allowedKeys = ['ArrowUp', 'Space', 'ArrowLeft', 'ArrowRight'];
        this.pressedKeys = [];
        this.asteroids = [];
        this.config = config;
        this.numberOfAsteroids = this.config.numberOfAsteroids;
        this.lives = config.lives;
        this.points = 0;
        this.lastExtraLifePoints = 0;
        this.state = "start";
        this.tick = 0;
        this.selectedLetter = ' '
        this.selectedLetterPosition = 0;
        this.letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ ';
        this.currentName = '   ';
        this.lastSaucerTick = 0;

        window.addEventListener('keydown', this.gameListenerKeyDown = (event) => {
            let key = event.key;
            if (key === ' ') { key = 'Space' }
            if (this.allowedKeys.includes(key)) {
                event.preventDefault();
                if (!this.pressedKeys.includes(key)) {
                    this.pressedKeys.push(key);
                }
            }
        });

        window.addEventListener('keyup', this.gameListenerKeyUp = (event) => {
            let key = event.key;
            if (key === ' ') { key = 'Space' }
            if (this.allowedKeys.includes(key)) {
                event.preventDefault();
                const index = this.pressedKeys.indexOf(key);
                if (index > -1) {
                    this.pressedKeys.splice(index, 1);
                }
            }
        });
    }
    addPoints(points) {
        this.points += points;
        if (this.points >= this.lastExtraLifePoints + this.config.points.forExtraLife) {
            this.lives++;
            this.lastExtraLifePoints += this.config.points.forExtraLife;
        }
    }
    update() {
        this.tick++;
        if (this.state === "running") {
            if (this.asteroids.length === 0) {
                this.numberOfAsteroids *= this.numberOfAsteroids;
                for (let i = 0; i < this.numberOfAsteroids * this.config.numberOfAsteroidsMultiplier && i < this.config.maxNumberOfAsteroids; i++) {
                    this.asteroids.push(new Asteroid(this));
                }
            }
            for (const asteroid of this.asteroids) {
                asteroid.update();
            }
            this.player.update();
            this.saucer?.update();

            if (this.tick - this.lastSaucerTick > this.config.saucerAppearsEach && !this.saucer) {
                this.lastSaucerTick = this.tick;
                const smartOrDumb = Math.random() > 0.5 ? "smart" : "dumb";
                this.saucer = new Saucer(this, smartOrDumb);
            }
        }
        if (this.state === "highscore" && this.tick % 10 === 0) {
            if (this.pressedKeys.includes('ArrowLeft')) {
                this.selectedLetter = this.letters[(this.letters.indexOf(this.selectedLetter) + this.letters.length - 1) % this.letters.length];
            }
            if (this.pressedKeys.includes('ArrowRight')) {
                this.selectedLetter = this.letters[(this.letters.indexOf(this.selectedLetter) + 1) % this.letters.length];
            }
            if (this.pressedKeys.includes('Space')) {
                this.currentName = this.currentName.substr(0, this.selectedLetterPosition) + this.selectedLetter + this.currentName.substr(this.selectedLetterPosition + 1);
                this.selectedLetterPosition = this.selectedLetterPosition + 1;
                if (this.selectedLetterPosition >= 3 || this.selectedLetter === ' ') {
                    if (this.currentName !== '   ') {
                        const gameSaved = JSON.parse(localStorage.getItem("gameSaved"));
                        const highScores = gameSaved.highScores;
                        highScores.push({
                            value: this.points,
                            name: this.currentName,
                        });
                        highScores.sort((a, b) => b.value - a.value);
                        gameSaved.highScores = highScores.slice(0, 10);
                        localStorage.setItem("gameSaved", JSON.stringify(gameSaved));
                    }
                    this.state = "start";
                    this.selectedLetterPosition = 0;
                }
                this.selectedLetter = ' ';
            }
        }

        this.draw();
    }
    drawStartScreen() {
        const gameSaved = JSON.parse(localStorage.getItem("gameSaved"));
        const highScore = gameSaved.highScores[0]?.value || 0;
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.font = "64px Hyperspace";
        this.context.fillStyle = "white";
        this.context.shadowColor = "#86A1B5";
        this.context.shadowBlur = 5;
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;
        const pointsText = this.points.toString().padStart(2, '0');
        this.context.fillText(pointsText, 128, 72);
        this.context.fillText(pointsText, this.width - 128 - 64, 72);
        this.context.font = "32px Hyperspace";
        this.context.textAlign = "center";
        this.context.fillText(highScore.toString().padStart(2, '0'), this.width / 2, 72 + 64);

        // push start (R)
        this.context.font = "48px Hyperspace";
        this.context.textAlign = "left";
        if (this.tick % 180 < 90) {
            this.context.fillText("PUSH START (R)", this.width / 2 - 192, 72 + 64 + 72);
        }
        this.context.fillText("HIGH SCORES", this.width / 2 - 192, 72 + 64 + 72 + 84);

        // draw high scores
        this.context.font = "32px Hyperspace";
        gameSaved.highScores.forEach((score, index) => {
            this.context.fillText(
                (index + 1).toString().padStart(2, ' ')
                    + ' ' + score.value.toString().padStart(6, ' ')
                    + ' ' + score.name,
                this.width / 2 - 192, 72 + 64 + 72 + 84 + 32 * (index + 2));
        });

        this.context.font = "48px Hyperspace";
        this.context.textAlign = "center";
        this.context.fillText("1 COIN 1 PLAY", this.width / 2,  72 + 64 + 72 + 84 + 32 * (14));

        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
    }
    drawEndScreen() {
        this.context.font = "64px Hyperspace";
        this.context.textAlign = "center";
        this.context.fillStyle = "white";
        this.context.shadowBlur = 2;
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;
        this.context.fillText("GAME OVER", this.width / 2, this.height / 2);
        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
    }
    drawHighScoreScreen() {
        const gameSaved = JSON.parse(localStorage.getItem("gameSaved"));
        const highScore = gameSaved.highScores[0]?.value || 0;
        this.context.clearRect(0, 0, this.width, this.height);
        this.context.font = "64px Hyperspace";
        this.context.fillStyle = "white";
        this.context.shadowColor = "#86A1B5";
        this.context.shadowBlur = 5;
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;
        const pointsText = this.points.toString().padStart(2, '0');
        this.context.fillText(pointsText, 128, 72);
        this.context.fillText("00", this.width - 128 - 64, 72);
        this.context.font = "32px Hyperspace";
        this.context.textAlign = "center";
        this.context.fillText(highScore.toString().padStart(2, '0'), this.width / 2, 72 + 64);

        this.context.font = "48px Hyperspace";
        this.context.textAlign = "left";
        this.context.fillText("YOUR SCORE IS ONE OF THE TEN BEST", 10, 72 + 64 + 72);
        this.context.fillText("PLEASE ENTER YOUR INITIALS", 10, 72 + 64 + 72 + 84);
        this.context.fillText("PUSH ROTATE TO SELECT LETTER", 10, 72 + 64 + 72 + 84 + 48);
        this.context.fillText("PUSH FIRE WHEN LETTER IS CORRECT", 10, 72 + 64 + 72 + 84 + 48 * 2);
        this.context.font = "48px Hyperspace";
        this.context.textAlign = "center";
        // letter 1
        const letter1Text = this.selectedLetterPosition === 0
            ? (this.selectedLetter === ' ' && this.tick % 180 < 90 ? '_' : this.selectedLetter)
            : (this.currentName[0] === ' ' ? '_' : this.currentName[0]);
        this.context.fillText(letter1Text, this.width / 2 - 32,  72 + 64 + 72 + 84 + 32 * (15));
        // letter 2
        const letter2Text = this.selectedLetterPosition === 1
            ? (this.selectedLetter === ' ' && this.tick % 180 < 90 ? '_' : this.selectedLetter)
            : (this.currentName[1] === ' ' ? '_' : this.currentName[1]);
        this.context.fillText(letter2Text, this.width / 2, 72 + 64 + 72 + 84 + 32 * (15));
        // letter 3
        const letter3Text = this.selectedLetterPosition === 2
            ? (this.selectedLetter === ' ' && this.tick % 180 < 90 ? '_' : this.selectedLetter)
            : (this.currentName[2] === ' ' ? '_' : this.currentName[2]);
        this.context.fillText(letter3Text, this.width / 2 + 32,  72 + 64 + 72 + 84 + 32 * (15));

        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
    }
    draw() {
        if (this.state === "start") {
            this.drawStartScreen();
            return;
        }
        if (this.state === "gameover") {
            this.drawEndScreen();
            return;
        }
        if (this.state === "highscore") {
            this.drawHighScoreScreen();
            return;
        }
        this.context.clearRect(0, 0, this.width, this.height);
        for (const asteroid of this.asteroids) {
            asteroid.draw();
        }
        this.player.draw();
        this.saucer?.draw();

        this.context.font = "64px Hyperspace";
        this.context.fillStyle = "white";
        this.context.shadowColor = "#86A1B5";
        this.context.shadowBlur = 5;
        this.context.shadowOffsetX = 3;
        this.context.shadowOffsetY = 3;
        const pointsText = this.points.toString().padStart(2, '0');
        this.context.fillText(pointsText, 128, 72);
        this.context.shadowBlur = 0;
        this.context.shadowOffsetX = 0;
        this.context.shadowOffsetY = 0;
        for (let i = 0; i < this.lives; i++) {
            this.context.save();
            this.context.translate(80 + i * 30, 148);
            this.context.rotate(-Math.PI / 2);
            this.context.drawImage(...ship, 0, 0, 64, 48);
            this.context.restore();
        }
        if (this.tick < 60 * 5) {
            this.context.shadowColor = "#86A1B5";
            this.context.shadowBlur = 5;
            this.context.shadowOffsetX = 3;
            this.context.shadowOffsetY = 3;
            this.context.font = "16px Hyperspace";
            this.context.textAlign = "center";
            this.context.fillText("USE ARROW KEYS TO MOVE AND SPACE TO SHOOT", this.width / 2,  this.height - 64);
            this.context.shadowBlur = 0;
            this.context.shadowOffsetX = 0;
            this.context.shadowOffsetY = 0;
        }
    }
    init() {
        for (let i = 0; i < this.numberOfAsteroids; i++) {
            this.asteroids.push(new Asteroid(this));
        }
        this.tick = 0;
        this.lives -= 1;
        this.state = "running";
        this.player = new Ship(this);
    }
    stop() {
        const gameSaved = JSON.parse(localStorage.getItem("gameSaved"));
        const highScores = gameSaved.highScores;
        const isHighScore = highScores.length < 10 || this.points > highScores[highScores.length - 1].value;
        localStorage.setItem("gameSaved", JSON.stringify(gameSaved));
        this.state = "gameover"
        this.asteroids = [];
        this.player = null;
        this.saucer?.destroy();
        this.lastSaucerTick = 0;
        this.lives = this.config.lives;
        setTimeout(() => {
            this.state = isHighScore ? "highscore" : "start";
        }, 2000);
    }

    resize() {
        this.width = this.canvas.width;
        this.height = this.canvas.height;
    }
}
