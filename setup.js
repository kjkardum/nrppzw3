import { Game } from './game/game.js';

/**
 * after the page loads, create the game and start it.
 * Then loop each frame using requestAnimationFrame to update the game as often as browser allows
 *
 * Each object on screen is its own class, it has constructor, draw and update method
 * If it's collideable, it has getHitbox method, and sometimes check_collision and destroy methods
 *
 * The code is modular so to be as much self explanatory as possible
 */
window.addEventListener('load', () => {
    if (localStorage.getItem("gameSaved") === null) {
        localStorage.setItem("gameSaved", JSON.stringify({
            highScores: [],
        }));
    }
    const canvas = document.getElementById('canvas');
    const game = new Game(canvas);
    const onResize = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        game.resize();
    };
    onResize();
    window.addEventListener('resize', onResize, false);
    function tick() {
        game.update();
        window.requestAnimationFrame(() => {game.update()});
    }
    //window.requestAnimationFrame(tick);
    setInterval(tick, 1000 / 60);
    window.addEventListener('keydown', (event) => {
       if (event.key === 'f') {
           if (document.fullscreenElement) {
               document.exitFullscreen().then(onResize);
           } else {
               canvas.requestFullscreen().then(onResize);
           }
       } else if (event.key === 'r' && game.state === "start") {
            game.init();
       }
    });
})
