import GameObject from '../Entities/GameObject'
import {Component, addToUpdateList} from './Component'
import Effect from './Effect'
import ChangeableAttribute from '../ChangeableAttribute'

export default class Attribute extends Phaser.Events.EventEmitter implements Component {
    private readonly character: GameObject
    private effects: Effect[]

    static readonly CHARACTER_DEAD = 'Dead'

    readonly hp: ChangeableAttribute<number>
    readonly strength: ChangeableAttribute<number>
    readonly wisdom: ChangeableAttribute<number>

    constructor(character: GameObject, hp: number, strength: number, wisdom: number) {
        super()

        this.hp = new ChangeableAttribute(hp)
        this.strength = new ChangeableAttribute(strength)
        this.wisdom = new ChangeableAttribute(wisdom)

        this.character = character
        this.effects = []

        addToUpdateList(character.scene, this.update, this)
        this.hp.on(ChangeableAttribute.AttributeChanged, this.checkIsAlive, this)
    }

    destroy(): void {
        this.hp.destroy()
        this.strength.destroy()
        this.wisdom.destroy()

        for (const effect of this.effects) {
            effect.off(Effect.EFFECT_ENDED, this.deleteEffect)
            effect.destroy()
        }

        this.effects = null

        this.character.scene.events.off(Phaser.Scenes.Events.UPDATE, this.update)
        super.destroy()
    }

    getName(): string {
        return 'attributes'
    }

    update(_time: number, _deltaTime: number): void {
        for (const effect of this.effects)
            effect.update(_time, _deltaTime)
    }

    addEffect(effect: Effect): void {
        effect.addTo(this.character)

        effect.on(Effect.EFFECT_ENDED, this.deleteEffect, this)
        this.effects.push(effect)
    }

    private checkIsAlive(): void {
        if (!this.isAlive())
            this.emit(Attribute.CHARACTER_DEAD, this)
    }

    private isAlive(): boolean {
        return this.hp.value >= 0
    }

    private deleteEffect(effect: Effect): void {
        this.effects = this.effects.filter(value => value !== effect)
    }
}