export function debugRAF() {
    // return;
    let requests: Array<(t: number) => void> = [];
    let time = 0;
    let stop = false;

    const tick = () => {
        if (stop) { return; }

        const requests_ = requests;
        requests = [];
        requests_.forEach(cb => cb(time));

        time += 17;
        setTimeout(tick, 500);
    };

    tick();

    let rafid = 0;
    window.requestAnimationFrame = (cb: FrameRequestCallback): number => {
        requests.push(cb);
        return rafid++;
    };

    performance.now = () => time;

    window.addEventListener('keydown', ({ code }) => {
        if (code !== 'Space') { return; }
        stop = !stop;
        if (!stop) { tick(); }
    });
};