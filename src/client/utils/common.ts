export const roundInt = (value: number, power: number) => Math.floor(value / power) * power;

export const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

export const idGetter = (): () => number => {
    let id = 0;
    return () => id++;
};

export function randf(min: number = 0, max: number = 1): number {
    return Math.random() * (max - min + 1) + min;
}

export function randi(min: number = 0, max: number = 10): number {
    return Math.floor(Math.random() * (max - min + 1) + min);
}