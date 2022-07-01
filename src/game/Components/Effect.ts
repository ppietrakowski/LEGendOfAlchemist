import Character from '../Entities/Character'
import Component from './Component'


export default class Effect extends Phaser.Events.EventEmitter implements Component {
    private character: Character
    private timePassed: number

    static EffectEnded = 'Ended'

    constructor(public deltaHp: number, public deltaStrength: number, public deltaWisdom: number, public readonly duration: number) {
        super()
        this.timePassed = 0
    }

    getName(): string {
        return 'Effect'
    }

    start(character: Character): void {
        this.character = character
    }

    update(timeSinceLastFrame: number): void {
        this.timePassed += timeSinceLastFrame
        let {attributes} = this.character

        attributes.hp.value += this.deltaHp * timeSinceLastFrame
        attributes.wisdom.value += this.deltaWisdom * timeSinceLastFrame
        attributes.strength.value += this.deltaStrength * timeSinceLastFrame

        if (this.hasTimePassed())
            this.emit(Effect.EffectEnded, this)
    }

    private hasTimePassed(): boolean {
        return this.timePassed >= this.duration
    }
}