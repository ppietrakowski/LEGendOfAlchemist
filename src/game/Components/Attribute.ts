import Character from '../Entities/Character'
import Component from './Component'
import Effect from './Effect'
import ChangeableAttribute from '../ChangeableAttribute'

export default class Attribute extends Phaser.Events.EventEmitter implements Component {
    character: Character
    private effects: Effect[]

    static CharacterDead = 'Dead'

    hp: ChangeableAttribute<number>
    strength: ChangeableAttribute<number>
    wisdom: ChangeableAttribute<number>

    constructor(hp: number, strength: number, wisdom: number) {
        super()

        this.hp = new ChangeableAttribute(hp)
        this.strength = new ChangeableAttribute(strength)
        this.wisdom = new ChangeableAttribute(wisdom)

        this.effects = []
    }

    getName(): string {
        return 'attributes'
    }

    start(character: Character): void {
        this.character = character
    }

    update(timeSinceLastFrame: number): void {
        for (let effect of this.effects)
            effect.update(timeSinceLastFrame)

        if (!this.isAlive())
            this.emit(Attribute.CharacterDead, this)
    }

    addEffect(effect: Effect): void {
        effect.start(this.character)

        effect.on(Effect.EffectEnded, this.deleteEffect, this)
        this.effects.push(effect)
    }

    private isAlive(): boolean {
        return this.hp.value >= 0
    }

    private deleteEffect(effect: Effect): void {
        this.effects = this.effects.filter(value => value !== effect)
    }
}