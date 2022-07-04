import GameObject from '../Entities/GameObject'
import Attribute from './Attribute'


export default class Effect extends Phaser.Events.EventEmitter {
    private timePassed: number
    private attributes: Attribute

    static readonly EFFECT_ENDED = 'Ended'

    constructor(public deltaHp: number, public deltaStrength: number, public deltaWisdom: number, public readonly duration: number) {
        super()
        this.timePassed = 0
    }

    addTo(character: GameObject) {
        this.attributes = character.attributes
    }

    destroy(): void {
        this.attributes = null
        super.destroy()
    }

    update(_time: number, deltaTime: number): void {
        deltaTime *= 0.01
        this.timePassed += deltaTime

        this.attributes.hp.value = this.attributes.hp.value + this.deltaHp * deltaTime
        this.attributes.wisdom.value = this.attributes.wisdom.value + this.deltaWisdom * deltaTime
        this.attributes.strength.value = this.attributes.strength.value + this.deltaStrength * deltaTime

        if (this.hasTimePassed())
            this.emit(Effect.EFFECT_ENDED, this)
    }

    private hasTimePassed(): boolean {
        return this.timePassed >= this.duration
    }
}