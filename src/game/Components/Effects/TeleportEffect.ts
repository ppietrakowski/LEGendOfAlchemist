
import GameObject from '../../Entities/GameObject'
import { Effect, EFFECT_ENDED } from './Effect'

export default class TeleportEffect implements Effect {
    constructor(private _destination: { x: number, y: number }) {
        this.events = new Phaser.Events.EventEmitter()
    }

    appliedTo(gameObject: GameObject): void {
        gameObject.setX(this._destination.x)
        gameObject.setY(this._destination.y)
    }

    update(_deltaTime: number): void {
        this.events.emit(EFFECT_ENDED)
    }

    clone(): Effect {
        throw new Error('This type of effect could not be cloned')
    }

    events: Phaser.Events.EventEmitter

}