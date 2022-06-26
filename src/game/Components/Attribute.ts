import Character from '../Entities/Character'
import Component from './Component'
import Effect from './Effect'


export default class Attribute implements Component {
    character: Character
    private effects: Effect[]

    constructor(public hp: number, public strength: number, public wisdom: number) {
        this.effects = []
    }

    debugName(): string {
        return 'atrributes'
    }

    getName(): string {
        return 'attributes'
    }

    start(character: Character): void {
        this.character = character
    }

    update(timeSinceLastFrame: number): void {
        for (let effect of this.effects) {
            effect.update(timeSinceLastFrame)

            if (effect.hasTimePassed())
                this.deleteEffect(effect)
        }
    }

    addEffect(effect: Effect): void {
        effect.start(this.character)
        this.effects.push(effect)
    }

    isAlive(): boolean {
        return this.hp >= 0
    }

    private deleteEffect(effect: Effect): void {
        this.effects = this.effects.filter(value => value !== effect)
    }
}