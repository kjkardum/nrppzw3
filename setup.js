import { Game } from './game/game.js';

/**
 * after the page loads, create the game and start it.
 * Then loop each frame using requestAnimationFrame to update the game as often as browser allows
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

/*
PLANS:
Ball can colide with asteroid, with saucer, with ship.
Ship can colide with saucer, with asteroid

Asteroid, saucer, ship need to have hit action
 */
