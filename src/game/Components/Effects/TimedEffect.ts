import GameObject from '../../Entities/GameObject'
import Attribute from './../Attribute'
import {Effect, EFFECT_ENDED} from './Effect'

export default class TimedEffect implements Effect {
    private _timePassed: number
    private _attributes: Attribute
    events: Phaser.Events.EventEmitter

    clone(): TimedEffect {
        return new TimedEffect(this.deltaHp, this.deltaStrength, this.deltaWisdom, this.duration)
    }

    constructor(public deltaHp: number, public deltaStrength: number,
        public deltaWisdom: number, public readonly duration: number) {

        this.events = new Phaser.Events.EventEmitter()
        this._timePassed = 0
    }

    appliedTo(character: GameObject) {
        this._attributes = character.attributes
    }

    update(deltaTime: number): void {
        this._timePassed += deltaTime

        this._attributes.changeHealth(this.deltaHp * deltaTime)
        this._attributes.wisdom.value = this._attributes.wisdom.value + this.deltaWisdom * deltaTime
        this._attributes.strength.value = this._attributes.strength.value + this.deltaStrength * deltaTime

        if (this.hasTimePassed())
            this.events.emit(EFFECT_ENDED, this)
    }

    private hasTimePassed(): boolean {
        return this._timePassed >= this.duration
    }
}