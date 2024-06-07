import { Object3D, Vector3 } from 'three';
import { LINE_OFFSET, LINE_WIDTH, MAP_LENGTH, MAP_OFFSET, SPEED } from './map';
import { GameContext } from './context';
import { randi } from './utils';
import { AABB } from './collider';

let model: Object3D;

export class Coin {
    private _model!: Object3D;

    position: Vector3 = new Vector3();
    line: number = 0;
    aabb: AABB = new AABB();
    taken: boolean = false;
    value: number = 5;

    init(): void {
        this.load();
        this.aabb.width = 0.5;
        this.aabb.height = 0.5;
    }

    async load(): Promise<void> {
        const context = GameContext.get();

        if (model === undefined) {
            model = await context.loader.load('./assets/models/coin/model.gltf');
            model.rotateX(Math.PI / 2);
            model.scale.set(2, 2, 2);
        }

        this._model = model.clone();
        context.scene.add(this._model);
    }

    setPosition(line: number, distance: number): void {
        const { position } = this;

        this.line = line;
        position.x = -line * LINE_WIDTH + LINE_OFFSET;
        position.z = distance;
        position.y = 2;

        this.aabb.setPivot(position.x, position.z);
    }

    hide(): void {
        if (this._model === undefined) { return; }
        this._model.visible = false;
        // this.aabb.visible = false;
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
            this.taken = false;
            this._model.visible = true;
            // this.aabb.visible = true;
        }

        this._model.position.copy(position);
        this._model.rotateZ(Math.PI * dt);

        this.aabb.setPivot(position.x, position.z);
    }
}