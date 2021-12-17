export type LoopHandler = (t: number) => void;

type OnBlurHandler = (blured: boolean) => void;

export class Loop {
    private _handler: LoopHandler;
    private _stoped: boolean = false;
    private _rafId = 0;

    onBlur: OnBlurHandler = () => undefined;

    constructor(handler: LoopHandler) {
        this._handler = handler;

        window.addEventListener('blur', () => this.onBlur(true));
        window.addEventListener('focus', () => this.onBlur(false));
    }

    private _loop = (t: number) => {
        if (this._stoped === true) { return; }

        this._handler(t);
        this._rafId = requestAnimationFrame(this._loop);
    }

    start(): void {
        this._stoped = false;
        this._loop(0);
    }

    stop(): void {
        this._stoped = true;
        cancelAnimationFrame(this._rafId);
    }
}