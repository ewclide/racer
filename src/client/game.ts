import { Loop } from './loop';
import { Player } from './player';
import { TimeSystem } from './time';
import { Context } from './context';
import { World } from './world';
import { InputSystem } from './input';
import { Coin } from './coin';
import { randf, randi } from './utils';
import { MAP_LENGTH } from './map';

export class Game {
    private _context: Context;
    private _world: World;
    private _loop: Loop;
    private _time: TimeSystem;
    private _input: InputSystem;
    private _coins: Array<Coin>;

    constructor() {
        this._context = new Context();
        this._world = new World();
        this._loop = new Loop(this._cycle);
        this._time = new TimeSystem();
        this._input = new InputSystem();
        this._coins = [];

        this._loop.onBlur = (blured: boolean): void => {
            if (blured) {
                this._time.stop();
            } else {
                this._time.play();
            }
        }

        this._world.create(this._context);
    }

    private _generateCoins = () => {
        let count = 70;

        for (let i = 0; i < count; i++) {
            const coin = new Coin();
            coin.line = randi(0, 3);
            coin.position.z = randf(10, MAP_LENGTH);
            coin.init(this._context);

            this._coins.push(coin);
        }
    }

    private _cycle = (): void => {
        const { renderer, scene, camera, map, players } = this._context;
        const { delta } = this._time;

        map.update(delta);

        for (const player of players.values()) {
            if (this._input.isActiveKey('A')) {
                player.moveLeft();
            }

            if (this._input.isActiveKey('D')) {
                player.moveRight();
            }

            player.update(delta);
        }

        for (const coin of this._coins) {
            coin.update(delta);
        }

        this._time.update();
        this._input.update();

        renderer.render(scene, camera);
    }

    addPlayer(player: Player): void {
        const { players } = this._context;

        player.init(this._context);
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