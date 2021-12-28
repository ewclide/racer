import { Light, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { GameMap } from './map';
import { Player } from './player';
import { Loader } from './loader';
import { Coin } from './coin';

let global: Context | null = null;

export interface UIData {
    money: number;
    distance: number;
    time: [number, number];
    needsUpdate: boolean;
}

export class Context {
    uiData: UIData = {
        money: 0,
        distance: 0,
        time: [0, 0],
        needsUpdate: false
    }

    container: HTMLElement = document.createElement('div');
    scene: Scene = new Scene();
    camera: PerspectiveCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    lights = new Map<string, Light>();
    loader: Loader = new Loader();
    players = new Map<number, Player>();
    coins: Array<Coin> = [];
    map: GameMap = new GameMap();

    constructor() {
        const { domElement } = this.renderer;

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

    static get(): Context {
        if (global === null) {
            throw new Error('Invalid game context');
        }

        return global;
    }
}
