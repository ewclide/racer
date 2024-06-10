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
    readonly world: World;
    readonly player: Player;
    readonly coins: Coin[] = [];

    private _context: GameContext;
    private _loop: Loop;
    private _time: TimeSystem;
    private _input: InputSystem;
    private _collider: Collider;
    private _ui: UI;

    constructor() {
        const context = new GameContext(this);

        this._context = context;
        this._loop = new Loop(this._cycle);
        this._time = new TimeSystem();
        this._input = new InputSystem();
        this._collider = new Collider();
        this._ui = new UI();

        this.world = new World();
        this.player = new Player();
        this.player.init();

        this._loop.onBlur = (blured: boolean): void => {
            if (blured) {
                this._time.stop();
            } else {
                this._time.play();
            }
        };
    }

    private _generateCoins = (): void => {
        const { coins } = this;
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

        const { renderer, scene, camera } = this._context;
        const { coins, player, world } = this;
        const { delta } = this._time;

        world.update(delta);
        this._collider.update(delta);

        if (this._input.isPushedKey('A')) {
            player.moveLeftLine();
        } else if (this._input.isPushedKey('D')) {
            player.moveRightLine();
        }

        if (this._input.isPressedKey('A')) {
            player.moveLeft();
        } else if (this._input.isPressedKey('D')) {
            player.moveRight();
        }

        player.update(delta);

        for (const coin of coins) {
            coin.update(delta);
        }

        this._time.update();
        this._input.update();

        renderer.render(scene, camera);
    }

    start(): void {
        this._generateCoins();
        this._loop.start();
    }

    stop(): void {
        this._loop.stop();
    }
}
