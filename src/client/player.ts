import { Object3D } from 'three';
import { Context } from './context';
import { LINE_OFFSET, LINE_WIDTH } from './map';
import { idGetter } from './utils';

const getId = idGetter();

export class Player {
    id: number = getId();
    money: number = 0;

    private _context!: Context;
    private _model!: Object3D;
    private _line = 0;
    private _loading: Promise<void> = Promise.resolve();

    init(context: Context): void {
        this._context = context;
        this.load();

        // @ts-expect-error
        window.player = this;
    }

    async load(): Promise<void> {
        const model = await this._context.loader.load('./assets/models/car/model.gltf');
        this._model = model;

        model.rotateY(Math.PI / 2);

        this._context.scene.add(model);
    }

    update(dt: number): void {
        if (this._model === undefined) { return; }

        this._model.position.x = -this._line * LINE_WIDTH + LINE_OFFSET;
    }

    moveLeft(): void {
        this._line = Math.max(0, this._line - 1);
    }

    moveRight(): void {
        this._line = Math.min(3, this._line + 1);
    }
}