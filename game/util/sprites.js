const sprite = document.getElementById('img_sprite');
const [spriteWidth, spriteHeight] = [512, 320];

export const asteroid_large1 = [sprite, 0, 0, 160, 160]
export const asteroid_large2 = [sprite, 160, 0, 160, 160]
export const asteroid_large3 = [sprite, 320, 0, 160, 160]

export const asteroid_medium1 = [sprite, 0, 160, 96, 96]
export const asteroid_medium2 = [sprite, 96, 160, 96, 96]
export const asteroid_medium3 = [sprite, 192, 160, 96, 96]

export const asteroid_small1 = [sprite, 0, 256, 64, 64]
export const asteroid_small2 = [sprite, 64, 256, 64, 64]
export const asteroid_small3 = [sprite, 128, 256, 64, 64]

export const saucer = [sprite, spriteWidth - 96, 160, 96, 80]

export const ship = [sprite, 192, 256, 96, 64]
export const ship_moving = [sprite, 288, 256, 96, 64]

export const ball_small = [sprite, spriteWidth - 64, spriteHeight - 32, 32, 32]
export const ball_medium = [sprite, spriteWidth - 32, spriteHeight - 32, 32, 32]

const ship_pieces_sprite = document.getElementById('img_sprite_ship');
export const ship_piece_1 = [ship_pieces_sprite, 0, 0, 96, 64]
export const ship_piece_2 = [ship_pieces_sprite, 96, 0, 96, 64]
export const ship_piece_3 = [ship_pieces_sprite, 192, 0, 96, 64]
export const ship_piece_4 = [ship_pieces_sprite, 288, 0, 96, 64]
export const ship_piece_5 = [ship_pieces_sprite, 384, 0, 96, 64]
