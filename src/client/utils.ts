export const idGetter = () => {
    let id = 0;
    return () => id++;
}

export function randf(min: number = 0, max: number = 1) {
    return Math.random() * (max - min + 1) + min;
}

export function randi(min: number = 0, max: number = 10) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

export function debugRAF() {
    // return;
    let requests: Array<Function> = [];
    let t = 0;
    let stop = false;

    const tick = (): void => {
        if (stop) { return; }

        let requests_ = requests;
        requests = [];
        requests_.forEach(cb => cb(t));

        t += 17;
        setTimeout(tick, 500);
    }

    tick();

    let rafid = 0;
    window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
        requests.push(cb);
        return rafid++;
    };

    performance.now = () => t;

    window.addEventListener('keydown', ({ code }) => {
        if (code !== 'Space') { return; }
        stop = !stop;
        if (!stop) { tick(); }
    })
};