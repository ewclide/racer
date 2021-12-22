import { Light, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GameMap } from './map';
import { Player } from './player';
import { Loader } from './loader';
import { Coin } from './coin';

let global: Context | null = null;

export class Context {
    scene: Scene = new Scene();
    camera: PerspectiveCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    lights: Map<string, Light> = new Map();
    loader: Loader = new Loader();
    players: Map<number, Player> = new Map();
    coins: Array<Coin> = [];
    map: GameMap = new GameMap();

    constructor() {
        const { domElement } = this.renderer;

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(domElement);
        window.addEventListener( 'resize', this._onResize);

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

    static get(): Context {
        if (global === null) {
            throw new Error('Invalid game context');
        }

        return global;
    }
}