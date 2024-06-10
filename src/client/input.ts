export enum KeyState {
    Down = 1,
    Up = 2
}

interface Key {
    name: string;
    pushed: boolean;
    state: KeyState;
}

export class InputSystem {
    private _keys: Map<string, Key> = new Map();

    constructor() {
        window.addEventListener('keydown', this._handleKeyDown);
        window.addEventListener('keyup', this._handleKeyUp);
    }

    isPushedKey(name: string): boolean {
        const key = this._keys.get(name);
        return key === undefined ? false : key.pushed;
    }

    isPressedKey(name: string): boolean {
        return this._keys.has(name);
    }

    getKey(name: string) {
        return this._keys.get(name)!;
    }

    private _handleKeyDown = (e: KeyboardEvent) => {
        const name = e.key.toUpperCase();
        if (this._keys.has(name) === false) {
            this._keys.set(name, {
                name,
                pushed: true,
                state: KeyState.Down
            });
        }
    }

    private _handleKeyUp = (e: KeyboardEvent) => {
        const name = e.key.toUpperCase();
        const key = this._keys.get(name);
        if (key !== undefined) {
            key.state = KeyState.Up;
            this._keys.delete(name);
        }
    }

    update(){
        for (const key of this._keys.values()) {
            key.pushed = false;
        }
    }
}