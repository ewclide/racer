import { AmbientLight, Color, DirectionalLight, Fog, Light, Vector3 } from 'three';
import { GameContext } from './context';
import { GameMap } from './map';

export class World {
    private _map = new GameMap();
    private _lights = new Map<string, Light>();

    constructor() {
        const { camera, scene } = GameContext.get();

        const sun = new DirectionalLight(0xffffff);
        sun.position.set(0, 20, 10);

        const sky = new AmbientLight(0xffffff);
        sky.intensity = 0.5;

        scene.add(sun);
        scene.add(sky);
        scene.background = new Color(0xe0e0e0);

        scene.fog = new Fog(0xe0e0e0, 50, 1000);

        camera.position.z = -12.5;
        camera.position.y = 10;
        camera.lookAt(new Vector3(0, 0, 25));

        // camera.position.z = 0;
        // camera.position.y = 70;
        // camera.lookAt(new Vector3(0, 0, 1));

        this._lights.set('sun', sun);
        this._lights.set('sky', sky);
        this._map.init();
    }

    update(dt: number) {
        this._map.update(dt);
    }
}