import { PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GameStore } from './store';
import { Loader } from './loader';
import { Game } from './game';

let global: GameContext | null = null;

export class GameContext {
    scene = new Scene();
    store = GameStore.createMobXStore();
    container = document.createElement('div');
    camera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    loader = new Loader();
    game: Game;

    constructor(game: Game) {
        const { domElement } = this.renderer;

        this.game = game;
        this.container.id = 'game';
        this.container.appendChild(domElement);
        document.body.appendChild(this.container);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        window.addEventListener('resize', this._onResize);

        this.bind();
    }

    private _onResize = (): void => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    bind(): void {
        global = this;
    }

    static get(): GameContext {
        if (global === null) {
            throw new Error('Invalid game context');
        }

        return global;
    }
}
