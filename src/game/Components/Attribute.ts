import Character from '../Entities/Character'
import Component from './Component'
import Effect from './Effect'
import ChangeableAttribute from '../ChangeableAttribute'

export default class Attribute extends Phaser.Events.EventEmitter implements Component {
    private readonly character: Character
    private effects: Effect[]

    static readonly CharacterDead = 'Dead'

    readonly hp: ChangeableAttribute<number>
    readonly strength: ChangeableAttribute<number>
    readonly wisdom: ChangeableAttribute<number>

    constructor(character: Character, hp: number, strength: number, wisdom: number) {
        super()

        this.hp = new ChangeableAttribute(hp)
        this.strength = new ChangeableAttribute(strength)
        this.wisdom = new ChangeableAttribute(wisdom)

        this.character = character
        this.effects = []

        character.scene.events.on(Phaser.Scenes.Events.UPDATE, this.update, this)
    }

    getName(): string {
        return 'attributes'
    }

    update(_time: number, _deltaTime: number): void {
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