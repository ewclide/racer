import { makeAutoObservable } from "mobx";
import { roundInt } from "../utils";

export class GameStore {
    lifes: number = 5;
    speed: number = 0;
    money: number = 0;
    distance: number = 0;
    time: number = 0;

    static createMobXStore(): GameStore {
        return makeAutoObservable(new GameStore());
    }

    get distance_km(): number {
        return Math.floor(this.distance / 1000);
    }

    get distance_m(): number {
        return roundInt(Math.floor(this.distance % 1000), 10);
    }

    get seconds(): number {
        return this.time;
    }

    increaseLife(): void {
        this.lifes++;
    }

    addMoney(money: number) {
        this.money += money;
    }

    addDistance(delta: number) {
        this.distance += delta;
    }

    setSpeed(speed: number) {
        this.speed = Math.round(speed);
    }

    addTime(delta: number) {
        this.time += delta;
    }
}


