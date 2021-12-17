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