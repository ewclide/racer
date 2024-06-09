import { Mesh, MeshBasicMaterial, PlaneGeometry, Vector2 } from 'three';
import { GameContext } from './context';

let plane_: Mesh;

export class AABB {
    width: number = 1;
    height: number = 1;
    pivot: Vector2 = new Vector2();
    visible: boolean = false;
    plane: Mesh;

    constructor() {
        if (plane_ === undefined) {
            const geometry = new PlaneGeometry(1, 1, 1);
            const material = new MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
            const plane = new Mesh(geometry, material);
            plane.rotateX(Math.PI / 2);
            plane.position.set(0, 0.1, 0);
            plane_ = plane;
        }

        const context = GameContext.get();
        this.plane = plane_.clone();
        this.plane.visible = false;
        context.scene.add(this.plane);
    }

    get diagonal(): number {
        return Math.hypot(this.width, this.height);
    }

    setSize(w: number, h: number): void {
        this.width = w;
        this.height = h;
        this.plane.scale.set(w, h, 1);
    }

    setPivot(x: number, y: number) {
        this.pivot.set(x, y);

        if (this.visible) {
            this.plane.visible = true;
            this.plane.position.set(x, 0.1, y);
        }
    }

    copy(aabb: AABB): void {
        const { pivot, width, height } = aabb;
        this.setPivot(pivot.x, pivot.y);
        this.setSize(width, height);
    }
}

export class Collider {
    private _aabb: AABB = new AABB();

    collision(a: AABB, b: AABB): boolean {
        const dx = Math.abs(a.pivot.x - b.pivot.x) - a.width / 2 - b.width / 2;
        const dy = Math.abs(a.pivot.y - b.pivot.y) - a.height / 2 - b.height / 2;

        return dx < 0 && dy < 0;
    }

    update(dt: number): void {
        const { coins, player } = GameContext.get().game;
        const offset = player.speed.z * dt;

        let dist = 0;
        let diagonal = 0;
        let step = 0;
        let count = 0;

        // this._aabb.visible = true;

        for (const coin of coins) {
            if (coin.taken) { continue; }

            dist = coin.aabb.pivot.distanceTo(player.aabb.pivot);
            if (offset < dist / 2) { continue; }

            diagonal = player.aabb.diagonal;
            count = diagonal < offset ? Math.ceil(offset / diagonal) : 1;

            if (count > 10) { continue; }

            this._aabb.copy(coin.aabb);
            step = offset / count;

            const { x, y } = coin.aabb.pivot;

            for (let i = 1; i < count + 1; i++) {
                this._aabb.setPivot(x, y + -step * i);

                if (this.collision(this._aabb, player.aabb)) {
                    player.takeCoin(coin);
                    break;
                }
            }
        }
    }
}