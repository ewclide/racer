export enum KeyState {
    Down = 1,
    Up = 2
}

interface Key {
    name: string;
    active: boolean;
    state: KeyState;
}

export class InputSystem {
    private _keys: Map<string, Key> = new Map();

    constructor() {
        window.addEventListener('keydown', this._handleKeyDown);
        window.addEventListener('keyup', this._handleKeyUp);
    }

    isActiveKey(name: string): boolean {
        const key = this._keys.get(name);
        if (key === undefined) { return false; }

        return key.active;
    }

    getKey(name: string) {
        return this._keys.get(name)!;
    }

    private _handleKeyDown = (e: KeyboardEvent) => {
        const name = e.key.toUpperCase();

        this._keys.set(name, {
            name,
            active: true,
            state: KeyState.Down
        });
    }

    private _handleKeyUp = (e: KeyboardEvent) => {
        const name = e.key.toUpperCase();
        const key = this._keys.get(name);

        if (key === undefined) { return; }

        key.state = KeyState.Up;

        this._keys.delete(name);
    }

    update(): void {
        for (const key of this._keys.values()) {
            key.active = false;
        }
    }
}