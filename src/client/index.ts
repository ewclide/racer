import { Player } from './player';
import { Game } from './game';

const game = new Game();
const player = new Player();

game.addPlayer(player);
game.start();

// @ts-expect-error
window.game = game;