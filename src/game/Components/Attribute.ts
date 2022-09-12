import GameObject from '../Entities/GameObject'
import { Component } from './Component'
import ChangeableAttribute from '../ChangeableAttribute'
import {Effect, EFFECT_ENDED} from './Effects/Effect'


export default class Attribute extends Phaser.Events.EventEmitter implements Component {
    private readonly _gameObject: GameObject
    private _effects: Effect[]

    static readonly CHARACTER_DEAD = Symbol('Event symbol, called when character is dead')
    static readonly HEALTH_CHANGED = Symbol('Event symbol, called when character\' health has changed')

    static readonly COMPONENT_NAME = 'attributes'

    private readonly _hitpoints = new ChangeableAttribute(0)
    readonly strength = new ChangeableAttribute(0)
    readonly wisdom = new ChangeableAttribute(0)

    get health() { return this._hitpoints.value }

    constructor(character: GameObject, hp: number, strength: number, wisdom: number) {
        super()

        this._hitpoints.value = hp
        this.strength.value = strength
        this.wisdom.value = wisdom

        this._gameObject = character
        this._effects = []


        this._hitpoints.on(ChangeableAttribute.ATTRIBUTE_CHANGED, this.checkIsAlive, this)
        this._gameObject.on(GameObject.GAMEOBJECT_UPDATE, this.update, this)
    }

    changeHealth(amount: number) {
        this._hitpoints.value += amount
        this.emit(Attribute.HEALTH_CHANGED, this._hitpoints.value)
    }

    destroy(): void {
        this._effects = null
        super.destroy()
    }

    getName(): string {
        return Attribute.COMPONENT_NAME
    }

    update(deltaTime: number): void {
        for (const effect of this._effects)
            effect.update(deltaTime)
    }

    private deletePredicate(effect: Effect, value: Effect): boolean {
        return value !== effect
    }

    private deleteEffect(effect: Effect): void {
        effect.events.destroy()

        this._effects = this._effects.filter(value => this.deletePredicate(effect, value))
    }

    applyEffect(effect: Effect): void {
        effect.appliedTo(this._gameObject)


        effect.events.once(EFFECT_ENDED, this.deleteEffect, this)
        this._effects.push(effect)
    }

    private isAlive(): boolean {
        return this._hitpoints.value >= 0
    }

    private checkIsAlive(): void {
        if (!this.isAlive())
            this.emit(Attribute.CHARACTER_DEAD, this)
    }
}