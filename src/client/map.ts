import { Object3D } from 'three';
import { GameContext } from './context';

export const MAP_OFFSET = 50;
export const LINE_WIDTH = 4;
export const LINE_OFFSET = 6;
export const MAP_LENGTH = 1386.83 * 2;

export class GameMap {
    private _models: Array<Object3D> = [];
    private _loading: Promise<void> = Promise.resolve();

    init(): void {
        this.load();
    }

    async load(): Promise<void> {
        const { loader, scene } = GameContext.get();
        const model = await loader.load('./assets/models/desert/model.gltf');

        this._models.push(model, model.clone());
        scene.add(...this._models);

        const [m1, m2] = this._models;

        m1.position.z += MAP_LENGTH / 2 - MAP_OFFSET;
        m2.position.z += MAP_LENGTH * (3 / 2) - MAP_OFFSET;
    }

    update(dt: number): void {
        if (this._models.length === 0) { return; }

        const { player } = GameContext.get().game;

        for (const model of this._models) {
            const { position } = model;

            position.z -= player.speed.z * dt;
            if (position.z < -MAP_LENGTH / 2 - MAP_OFFSET) {
                position.z += MAP_LENGTH * 2;
            }
        }
    }
}