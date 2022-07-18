import Phaser from 'phaser'
import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import Attribute from './Attribute'
import { Component } from './Component'


export default class HealthBar implements Component {
    protected hpMax: number
    protected text: Phaser.GameObjects.Text

    static readonly COMPONENT_NAME = 'hp-bar'

    constructor(protected readonly owner: GameObject,
        private readonly range: number, protected player: Player) {
        this.start()
    }

    destroy(): void {
        this.text.destroy(true)
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

        this.owner.on(GameObject.GAMEOBJECT_UPDATE, this.update, this)
    }

    update(_deltaTime: number): void {
        if (this.owner.isNearObject(this.player, this.range))
            this.show()
        else
            this.hide()
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

    private show(): void {
        this.text.setVisible(true)
        this.text.setPosition(this.owner.x, this.owner.y - 1.5 * this.owner.width)
    }

    private hide(): void {
        this.text.setVisible(false)
    }
}