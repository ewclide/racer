import { debugRAF, randf, randi } from './utils';
import { InputSystem } from './input';
import { GameContext } from './context';
import { MAP_LENGTH } from './map';
import { TimeSystem } from './time';
import { Collider } from './collider';
import { Player } from './player';
import { World } from './world';
import { Loop } from './loop';
import { Coin } from './coin';
import { UI } from './ui';

// debugRAF();

export class Game {
    private _context: GameContext;
    private _world: World;
    private _loop: Loop;
    private _time: TimeSystem;
    private _input: InputSystem;
    private _collider: Collider;
    private _ui: UI;

    constructor() {
        const context = new GameContext();

        this._context = context;
        this._world = new World();
        this._loop = new Loop(this._cycle);
        this._time = new TimeSystem();
        this._input = new InputSystem();
        this._collider = new Collider();
        this._ui = new UI();

        this._loop.onBlur = (blured: boolean): void => {
            if (blured) {
                this._time.stop();
            } else {
                this._time.play();
            }
        };
    }

    private _generateCoins = (): void => {
        const { coins } = this._context;
        const count = 70;

        for (let i = 0; i < count; i++) {
            const coin = new Coin();
            coin.setPosition(randi(0, 3), randf(10, MAP_LENGTH));
            coin.init();

            coins.push(coin);
        }
    }

    private _cycle = (): void => {
        this._context.bind();

        const { renderer, scene, camera, map, players, coins } = this._context;
        const { delta } = this._time;

        map.update(delta);
        this._collider.update(delta);

        for (const player of players.values()) {
            if (this._input.isActiveKey('A')) {
                player.moveLeft();
            }

            if (this._input.isActiveKey('D')) {
                player.moveRight();
            }

            player.update(delta);
        }

        for (const coin of coins) {
            coin.update(delta);
        }

        this._time.update();
        this._input.update();

        renderer.render(scene, camera);
    }

    addPlayer(player: Player): void {
        const { players } = this._context;

        player.init();
        players.set(player.id, player);
    }

    start(): void {
        this._generateCoins();

        this._loop.start();
    }

    stop(): void {
        this._loop.stop();
    }
}
