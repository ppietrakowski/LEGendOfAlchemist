import Phaser from 'phaser'
import Enemy from '../Entities/Enemy'
import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import { SenseType, SensingListener } from './AI/sense/EnemySensing'
import Attribute from './Attribute'
import { Component } from './Component'


export class HealthBar implements Component, SensingListener {
    protected _hpMax: number
    protected _text: Phaser.GameObjects.Text

    static readonly COMPONENT_NAME = 'hp-bar'

    constructor(protected readonly _owner: GameObject, protected _player: Player) {
        this.start()
    }

    sensed(_sensedObject: GameObject, _senseType: SenseType): void {
        this._text?.setVisible(true)
        this._text?.setPosition(this._owner.x, this._owner.y - 1.5 * this._owner.width)
    }

    stopsSensing(_sensedObject: GameObject, _senseType: SenseType): void {
        this._text?.setVisible(false)
    }

    destroy(): void {
        this._text.destroy()
        this._text = null
        this._player = null
    }

    getName(): string {
        return HealthBar.COMPONENT_NAME
    }

    protected start(): void {
        const { attributes } = this._owner
        const { scene } = this._owner
        this._hpMax = this._owner.attributes.health
        const healthAsText = attributes.health.toString()

        this._text = scene.add.text(this._owner.x, this._owner.y - 2 * this._owner.width,
            healthAsText,
            { fontFamily: 'pixellari', color: '#ffffff', backgroundColor: '#880000' })
        this._text.setVisible(false)

        this.addHealthChangedListener()
        this.addHealthBarWhenNear()
    }

    private healthUpdated(newHealth: number): void {
        if (this._owner.attributes.health >= this._hpMax)
            this._hpMax = this._owner.attributes.health
        this._text.setText(Math.round(newHealth).toString() + '/' + Math.round(this._hpMax))
    }

    protected addHealthChangedListener() {
        const { attributes } = this._owner
        attributes.addListener(Attribute.HEALTH_CHANGED, this.healthUpdated, this)
    }

    private addHealthBarWhenNear() {
        if (this._owner instanceof Enemy) {
            const enemy = this._owner as Enemy
            enemy.addSenseListener(this)
        }
    }
}