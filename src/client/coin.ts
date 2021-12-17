import { Object3D, Vector3 } from 'three';
import { Context } from './context';
import { LINE_OFFSET, LINE_WIDTH, MAP_LENGTH, MAP_OFFSET, SPEED } from './map';
import { randi } from './utils';

let model: Object3D;

export class Coin {
    private _context!: Context;
    private _model!: Object3D;

    position: Vector3 = new Vector3();
    line: number = 0;

    init(context: Context): void {
        this._context = context;
        this.load();
    }

    async load(): Promise<void> {
        if (model === undefined) {
            model = await this._context.loader.load('./assets/models/coin/model.gltf');
            model.rotateX(Math.PI / 2);
            model.scale.set(2, 2, 2);
        }

        this._model = model.clone();
        this._context.scene.add(this._model);
    }

    update(dt: number): void {
        if (this._model === undefined) { return; }

        const { position } = this;

        position.x = -this.line * LINE_WIDTH + LINE_OFFSET;
        position.z -= SPEED * dt;
        position.y = 2;

        if (position.z < -MAP_OFFSET) {
            position.z = MAP_LENGTH;
            this.line = randi(0, 3);
        }

        this._model.position.copy(position);
        this._model.rotateZ(Math.PI * dt);
    }
}