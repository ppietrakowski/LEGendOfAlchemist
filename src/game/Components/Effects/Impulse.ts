import GameObject from "../../Entities/GameObject";
import { Effect, EFFECT_ENDED } from "./Effect";

export default class Impulse implements Effect {

    constructor(public deltaHp: number, public deltaStrength: number,
        public deltaWisdom: number) {
        this.events = new Phaser.Events.EventEmitter()
    }

    appliedTo(gameObject: GameObject): void {
        let { attributes } = gameObject

        attributes.changeHealth(this.deltaHp)
        attributes.strength.value += this.deltaStrength
        attributes.wisdom.value += this.deltaWisdom
    }

    update(_deltaTime: number): void {
        this.events.emit(EFFECT_ENDED)
    }

    clone(): Effect {
        return new Impulse(this.deltaHp, this.deltaStrength, this.deltaWisdom)
    }

    events: Phaser.Events.EventEmitter;
}