import { AmbientLight, Color, DirectionalLight, Fog, Vector3 } from 'three';
import { Context } from './context';

export class World {
    private _context!: Context;

    create(context: Context) {
        const { camera, lights, scene, map } = context;

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

        lights.set('sun', sun);
        lights.set('sky', sky);

        map.init(context);

        this._context = context;
    }
}