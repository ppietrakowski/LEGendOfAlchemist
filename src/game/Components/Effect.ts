import GameObject from '../Entities/GameObject'
import Attribute from './Attribute'
import DamageInflictor from './DamageInflictor'

export default class Effect implements DamageInflictor {
    private timePassed: number
    private attributes: Attribute
    events: Phaser.Events.EventEmitter

    static readonly EFFECT_ENDED = 'ended'

    clone(): Effect {
        return new Effect(this.deltaHp, this.deltaStrength, this.deltaWisdom, this.duration)
    }

    constructor(public deltaHp: number, public deltaStrength: number,
        public deltaWisdom: number, public readonly duration: number) {

        this.events = new Phaser.Events.EventEmitter()
        this.timePassed = 0
    }

    appliedTo(character: GameObject) {
        this.attributes = character.attributes
    }

    update(deltaTime: number): void {
        this.timePassed += deltaTime

        this.attributes.changeHealth(this.deltaHp * deltaTime)
        this.attributes.wisdom.value = this.attributes.wisdom.value + this.deltaWisdom * deltaTime
        this.attributes.strength.value = this.attributes.strength.value + this.deltaStrength * deltaTime

        if (this.hasTimePassed())
            this.events.emit(Effect.EFFECT_ENDED, this)
    }

    private hasTimePassed(): boolean {
        return this.timePassed >= this.duration
    }
}