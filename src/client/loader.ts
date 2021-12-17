import { Object3D } from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

export class Loader {
    private _gltfLoader = new GLTFLoader();

    load(src: string): Promise<Object3D> {
        return new Promise((resolve, reject) => {
            this._gltfLoader.load(src,
                (gltf) => resolve(gltf.scene),
                () => {}, // ... progress
                () => reject(`Can't load "${src}"`)
            );
        });
    }
}