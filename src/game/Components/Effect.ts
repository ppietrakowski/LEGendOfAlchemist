import Character from '../Entities/Character'
import Component from './Component'


export default class Effect implements Component {
    character: Character
    private timePassed: number

    constructor(public deltaHp: number, public deltaStrength: number, public deltaWisdom: number, public readonly duration: number) {
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

        attributes.hp += this.deltaHp * timeSinceLastFrame
        attributes.wisdom += this.deltaWisdom * timeSinceLastFrame
        attributes.strength += this.deltaStrength * timeSinceLastFrame
    }

    public hasTimePassed(): boolean {
        return this.timePassed >= this.duration
    }
}