import { Game } from './game';

const game = new Game();
game.start();

// @ts-expect-error
window.game = game;