import Phaser from 'phaser'
import ChangeableAttribute from '../ChangeableAttribute'
import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import { Component, addToUpdateList } from './Component'


export default class HealthBar implements Component {
    protected hpMax: number

    protected text: Phaser.GameObjects.Text

    constructor(protected readonly owner: GameObject, private readonly range: number, protected player: Player) {
        this.start()
    }

    destroy(): void { }

    getName(): string {
        return 'hp-bar'
    }

    protected start(): void {
        const { attributes } = this.owner
        const { scene } = this.owner

        this.hpMax = this.owner.attributes.hp.value

        this.text = scene.add.text(this.owner.x, this.owner.y - 2 * this.owner.width,
            attributes.hp.value.toString(), { fontFamily: 'pixellari', color: '#ffffff', backgroundColor: '#880000' })
        this.text.setVisible(false)

        this.addHealthChangedListener()

        this.owner.on(Phaser.GameObjects.Events.DESTROY, () => this.text.destroy(), this)
        addToUpdateList(this.owner.scene, this.update, this)
    }

    update(_time: number, _deltaTime: number): void {
        if (this.owner.isNearObject(this.player, this.range))
            this.show()
        else
            this.hide()
    }

    private show(): void {
        this.text.setVisible(true)
        this.text.setPosition(this.owner.x, this.owner.y - 1.5 * this.owner.width)
    }

    protected healthUpdated(): void {
        if (this.owner.attributes.hp.value >= this.hpMax)
            this.hpMax = this.owner.attributes.hp.value
        this.text.setText(Math.round(this.owner.attributes.hp.value).toString() + "/" + Math.round(this.hpMax))
    }

    private hide(): void {
        this.text.setVisible(false)
    }

    protected addHealthChangedListener() {
        const { attributes } = this.owner
        attributes.hp.addListener(ChangeableAttribute.ATTRIBUTE_CHANGED, this.healthUpdated, this)
    }
}