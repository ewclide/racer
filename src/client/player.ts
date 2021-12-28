import { Object3D, Vector3 } from 'three';
import { LINE_OFFSET, LINE_WIDTH, SPEED } from './map';
import { idGetter } from './utils';
import { Context } from './context';
import { AABB } from './collider';
import { Coin } from './coin';

const getId = idGetter();

export class Player {
    id: number = getId();
    money: number = 0;
    aabb: AABB = new AABB();

    private _model!: Object3D;
    private _line = 0;
    private _loading: Promise<void> = Promise.resolve();

    get position(): Vector3 {
        return this._model.position || new Vector3();
    }

    init(): void {
        this.load();

        this.aabb.setSize(2.2, 5);
        // this.aabb.visible = true;
        // @ts-expect-error
        window.player = this;
    }

    async load(): Promise<void> {
        const context = Context.get();
        const model = await context.loader.load('./assets/models/car/model.gltf');
        this._model = model;

        model.rotateY(Math.PI);
        context.scene.add(model);
    }

    update(dt: number): void {
        if (this._model === undefined) { return; }

        const { uiData } = Context.get();
        const { position } = this._model;

        position.x = -this._line * LINE_WIDTH + LINE_OFFSET;
        this.aabb.setPivot(position.x, position.y);

        uiData.distance += SPEED * dt;
        uiData.needsUpdate = true;
    }

    moveLeft(): void {
        this._line = Math.max(0, this._line - 1);
    }

    moveRight(): void {
        this._line = Math.min(3, this._line + 1);
    }

    takeCoin(coin: Coin): void {
        if (coin.taken === true) { return; }

        const { uiData } = Context.get();

        this.money++;
        coin.hide();
        coin.taken = true;

        uiData.money = this.money;
        uiData.needsUpdate = true;
    }
}