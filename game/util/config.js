export const default_config = {
    numberOfAsteroids: Math.round(Math.random() * 2) + 4,
    numberOfAsteroidsMultiplier: 1.2,
    maxNumberOfAsteroids: 8,
    lives: 4,
    points: {
        small: 100,
        medium: 50,
        large: 20,
        largeSaucer: 200,
        smallSaucer: 1000,
        smallSaucerPermanentTreshold: 10000,
        forExtraLife: 10000,
    },
    saucerAppearsEach: 60 * 10 + Math.round(Math.random() * 60 * 10),
}
