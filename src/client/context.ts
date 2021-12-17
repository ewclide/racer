import { Light, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { Player } from './player';
import { Loader } from './loader';
import { GameMap } from './map';

export class Context {
    scene: Scene = new Scene();
    camera: PerspectiveCamera = new PerspectiveCamera(70, window.innerWidth / window.innerHeight, 1, 1000);
    renderer: WebGLRenderer = new WebGLRenderer({ antialias: true });
    lights: Map<string, Light> = new Map();
    loader: Loader = new Loader();
    players: Map<number, Player> = new Map();
    map: GameMap = new GameMap();

    constructor() {
        const { domElement } = this.renderer;

        this.renderer.setSize(window.innerWidth, window.innerHeight);

        document.body.appendChild(domElement);
        window.addEventListener( 'resize', this._onResize);
    }

    private _onResize = (): void => {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize( window.innerWidth, window.innerHeight );
    }
}