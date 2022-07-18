import GameObject from '../Entities/GameObject'
import { Component } from './Component'
import Effect from './Effect'
import ChangeableAttribute from '../ChangeableAttribute'


export default class Attribute extends Phaser.Events.EventEmitter implements Component {
    private readonly character: GameObject
    private effects: Effect[]

    static readonly CHARACTER_DEAD = 'Dead'
    static readonly HEALTH_CHANGED = 'healthChanged'

    static readonly COMPONENT_NAME = 'attributes';

    private readonly hp = new ChangeableAttribute(0)
    readonly strength = new ChangeableAttribute(0)
    readonly wisdom = new ChangeableAttribute(0)

    get health() { return this.hp.value }

    constructor(character: GameObject, hp: number, strength: number, wisdom: number) {
        super()

        this.hp.value = hp
        this.strength.value = strength
        this.wisdom.value = wisdom

        this.character = character
        this.effects = []

        this.hp.on(ChangeableAttribute.ATTRIBUTE_CHANGED, this.checkIsAlive, this)
        this.character.on(GameObject.GAMEOBJECT_UPDATE, this.update, this);
    }

    changeHealth(amount: number) {
        this.hp.value += amount
        this.emit(Attribute.HEALTH_CHANGED, this.hp.value)
    }

    destroy(): void {
        this.effects = null
        super.destroy()
    }

    getName(): string {
        return Attribute.COMPONENT_NAME;
    }

    update(deltaTime: number): void {
        for (const effect of this.effects)
            effect.update(deltaTime)
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