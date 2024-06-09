import { Group, Quaternion, Vector3 } from 'three';
import { LINE_OFFSET, LINE_WIDTH } from './map';
import { GameContext } from './context';
import { clamp } from './utils';
import { AABB } from './collider';
import { Coin } from './coin';

const SPEED = 100;

const PI4 = Math.PI / 4;
const carSize = new Vector3(2.2, 1.5, 5);
const axisY = new Vector3(0, 1, 0);
const axisZ = new Vector3(0, 0, 1);
const carPoint = new Vector3();
const carOrient = new Quaternion();
const wishTarget = new Vector3();
const speedDir = new Vector3();

export class Player {
    aabb = new AABB();
    speed = new Vector3(0, 0, 1).multiplyScalar(SPEED);
    distance = 0;

    private _modelNode: Group = new Group();
    private _angle = 0;
    private _linePositionX = 0;
    private _lineIndex = 0;
    private _modelIsLoaded = false

    get position(): Vector3 {
        return this._modelNode.position || new Vector3();
    }

    init(): void {
        this.aabb.setSize(carSize.x, carSize.z);
        this.load().then(() => {
            this.setLine(2);
            this.updatePosition(this._linePositionX);
        });
    }

    async load(): Promise<void> {
        const { loader, scene } = GameContext.get();

        const model = await loader.load('./assets/models/car/model.gltf');
        model.rotateY(Math.PI);

        this._modelNode.add(model);
        scene.add(this._modelNode);

        this._modelIsLoaded = true;
    }

    updatePosition = (value: number): void => {
        if (this._modelIsLoaded === false) { return; }

        const { position } = this._modelNode;

        position.x = value;
        this.aabb.setPivot(position.x, position.y);
    }

    update(dt: number): void {
        if (this._modelIsLoaded === false) { return; }

        const curPositionX = this._modelNode.position.x;
        if (Math.abs(curPositionX - this._linePositionX) < 0.001) { return; }

        speedDir.copy(this.speed).normalize();
        carPoint.set(curPositionX, 0, 0);
        wishTarget.set(this._linePositionX, 0, LINE_WIDTH * 4);
        const wishDir = wishTarget.sub(carPoint).normalize();
        const dot = speedDir.dot(wishDir);
        const moveSign = curPositionX > this._linePositionX ? -1 : 1;

        if (1 - dot < 0.001) {
            // If wheels directed along wish vector then copy this vector to speed
            this.speed.copy(wishDir).multiplyScalar(SPEED);
            this._angle = moveSign * Math.acos(axisZ.dot(wishDir));
        } else {
            // Else rotate wheels by angle (max angle is PI / 4)
            this._angle += moveSign * 0.2 * dt;
            this._angle = clamp(this._angle, -PI4, PI4);
            this.speed
                .set(0, 0, 1)
                .multiplyScalar(SPEED)
                .applyAxisAngle(axisY, this._angle);
        }

        carOrient.setFromUnitVectors(axisZ, this.speed);
        this._modelNode.rotation.setFromQuaternion(carOrient);

        const newPosX = curPositionX + this.speed.x * dt;
        this.updatePosition(newPosX);

        const { store } = GameContext.get();
        store.addDistance(this.speed.z * dt);
    }

    moveLeft(): void {
        this.setLine(Math.max(0, this._lineIndex - 1))
    }

    moveRight(): void {
        this.setLine(Math.min(3, this._lineIndex + 1))
    }

    setLine(line: number) {
        this._linePositionX = -line * LINE_WIDTH + LINE_OFFSET;
        this._lineIndex = line;
    }

    takeCoin(coin: Coin): void {
        if (coin.taken === true) { return; }

        const { store } = GameContext.get();

        coin.hide();
        coin.taken = true;
        store.addMoney(coin.value);
    }
}
