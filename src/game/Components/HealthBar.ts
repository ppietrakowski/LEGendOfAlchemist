import Phaser from 'phaser'
import Enemy from '../Entities/Enemy'
import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import { SenseType, SensingListener } from './AI/sense/EnemySensing'
import Attribute from './Attribute'
import { Component } from './Component'


export class HealthBar implements Component, SensingListener {
    protected hpMax: number
    protected text: Phaser.GameObjects.Text

    static readonly COMPONENT_NAME = 'hp-bar'

    constructor(protected readonly owner: GameObject, protected player: Player) {
        this.start()
    }

    sensed(_sensedObject: GameObject, _senseType: SenseType): void {
        this.text?.setVisible(true)
        this.text?.setPosition(this.owner.x, this.owner.y - 1.5 * this.owner.width)
    }

    stopsSensing(_sensedObject: GameObject, _senseType: SenseType): void {
        this.text?.setVisible(false)
    }

    destroy(): void {
        this.text.destroy()
        this.text = null
        this.player = null
    }

    getName(): string {
        return HealthBar.COMPONENT_NAME;
    }

    protected start(): void {
        const { attributes } = this.owner
        const { scene } = this.owner

        this.hpMax = this.owner.attributes.health

        this.text = scene.add.text(this.owner.x, this.owner.y - 2 * this.owner.width,
            attributes.health.toString(),
            { fontFamily: 'pixellari', color: '#ffffff', backgroundColor: '#880000' })
        this.text.setVisible(false)

        this.addHealthChangedListener()

        if (this.owner instanceof Enemy) {
            let enemy = this.owner as Enemy
            enemy.addSenseListener(this)
        }
    }

    protected healthUpdated(newHealth: number): void {
        if (this.owner.attributes.health >= this.hpMax)
            this.hpMax = this.owner.attributes.health
        this.text.setText(Math.round(newHealth).toString() + "/" + Math.round(this.hpMax))
    }

    protected addHealthChangedListener() {
        const { attributes } = this.owner
        attributes.addListener(Attribute.HEALTH_CHANGED, this.healthUpdated, this)
    }
}