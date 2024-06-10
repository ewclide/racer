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
const minRoadValue = -LINE_WIDTH * 2 + carSize.x / 2;
const maxRoadValue = +LINE_WIDTH * 2 - carSize.x / 2;

export class Player {
    aabb = new AABB();
    speed = new Vector3(0, 0, 1).multiplyScalar(SPEED);
    distance = 0;
    autoPilotMode = true;
    wheelSens = 0.2;

    private _modelNode: Group = new Group();
    private _wheelAngle = 0;
    private _linePositionX = 0;
    private _lineIndex = 0;
    private _modelIsLoaded = false;
    private _moveManualSign = 0;

    get position(): Vector3 {
        return this._modelNode.position;
    }

    init(): void {
        this.aabb.setSize(carSize.x, carSize.z);
        this.load().then(() => {
            this._setLine(2);
            this._setPosition(this._linePositionX);
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

    moveLeftLine() {
        this._setLine(Math.max(0, this._lineIndex - 1));
    }

    moveRightLine() {
        this._setLine(Math.min(3, this._lineIndex + 1))
    }

    moveLeft() {
        this._moveManualSign = +1;
    }

    moveRight() {
        this._moveManualSign = -1;
    }

    takeCoin(coin: Coin) {
        if (coin.taken === true) { return; }

        const { store } = GameContext.get();

        coin.hide();
        coin.taken = true;
        store.addMoney(coin.value);
    }

    update(dt: number): void {
        if (this._modelIsLoaded === false) { return; }

        const canMove = this._checkPosition(dt);
        if (canMove) {
            if (this.autoPilotMode === true) {
                this._applyAutoPilot(dt);
            } else {
                this._applyManualControl(dt);
            }
        } else {
            this._alignWheels(dt, 20);
            this._updatePosition(dt);
            this._updateOrientation();
        }

        const { store } = GameContext.get();
        store.addDistance(this.speed.z * dt);
    }

    private _applyManualControl(dt: number) {
        let wheelSign = this._moveManualSign;
        if (wheelSign !== 0) {
            this._turnWheels(wheelSign, dt);
        } else {
            this._alignWheels(dt);
        }

        this._updatePosition(dt);
        this._updateOrientation();
        this._setLine(3 - Math.round((this._modelNode.position.x + LINE_OFFSET) / 4));
        this._moveManualSign = 0;
    }

    private _applyAutoPilot(dt: number) {
        const curPositionX = this._modelNode.position.x;
        if (Math.abs(curPositionX - this._linePositionX) < 0.001) { return; }

        speedDir.copy(this.speed).normalize();
        carPoint.set(curPositionX, 0, 0);
        wishTarget.set(this._linePositionX, 0, LINE_WIDTH * 4);
        const wishDir = wishTarget.sub(carPoint).normalize();
        const dot = speedDir.dot(wishDir);
        const wheelSign = curPositionX > this._linePositionX ? -1 : 1;

        if (1 - dot < 0.001) {
            // If wheels directed along wish vector then copy this vector to speed
            this.speed.copy(wishDir).multiplyScalar(SPEED);
            this._wheelAngle = wheelSign * Math.acos(axisZ.dot(wishDir));
        } else {
            // Else turn wheels
            this._turnWheels(wheelSign, dt);
        }

        this._updatePosition(dt);
        this._updateOrientation();
    }

    private _checkPosition(dt: number): boolean {
        const npx = this._modelNode.position.x + this.speed.x * dt;
        return npx >= minRoadValue && npx <= maxRoadValue;
    }

    private _updatePosition(dt: number) {
        const newPosX = clamp(
            this._modelNode.position.x + this.speed.x * dt,
            minRoadValue,
            maxRoadValue
        );

        this._setPosition(newPosX);
    }

    private _updateOrientation() {
        carOrient.setFromUnitVectors(axisZ, this.speed);
        this._modelNode.rotation.setFromQuaternion(carOrient);
    }

    private _turnWheels(sign: number, dt: number) {
        this._wheelAngle += sign * this.wheelSens * dt;
        this._wheelAngle = clamp(this._wheelAngle, -PI4, PI4);
        this.speed
            .set(0, 0, 1)
            .multiplyScalar(SPEED)
            .applyAxisAngle(axisY, this._wheelAngle);
    }

    private _alignWheels(dt: number, extraSens: number = 1) {
        if (Math.abs(this._wheelAngle) > 0.001) {
            this._wheelAngle += -Math.sign(this._wheelAngle) * this.wheelSens * extraSens * dt;
        } else {
            this._wheelAngle = 0;
        }

        this.speed
            .set(0, 0, 1)
            .multiplyScalar(SPEED)
            .applyAxisAngle(axisY, this._wheelAngle);
    }

    private _setLine(line: number) {
        this._linePositionX = -line * LINE_WIDTH + LINE_OFFSET;
        this._lineIndex = line;
    }

    private _setPosition = (value: number): void => {
        if (this._modelIsLoaded === false) { return; }

        const { position } = this._modelNode;

        position.x = value;
        this.aabb.setPivot(position.x, position.y);
    }
}
