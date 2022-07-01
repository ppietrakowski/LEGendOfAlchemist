import Phaser from 'phaser'
import ChangeableAttribute from '../ChangeableAttribute'
import Character from '../Entities/Character'
import Player from '../Entities/Player'
import Attribute from './Attribute'
import Component from './Component'


export default class HealthBar implements Component {
    hpMax: number

    self: Character
    text: Phaser.GameObjects.Text
    player: Player
    range: number

    constructor(player: Player, range: number) {
        this.player = player
        this.range = range
    }

    getName(): string {
        return 'hp-bar'
    }

    start(character: Character): void {
        let { attributes } = character

        this.self = character
        this.hpMax = this.self.attributes.hp.value

        this.text = character.scene.add.text(character.x, character.y - 2 * this.self.width, attributes.hp.value.toString(), { fontFamily: 'pixellari', color: '#ffffff', backgroundColor: '#880000' })
        this.text.setVisible(false)

        this.addHealthChangedListener()

        character.on(Phaser.GameObjects.Events.DESTROY, () => this.text.destroy(), this)
    }

    update(_timeSinceLastFrame: number): void {
        if (this.self.isNearObject(this.player, this.range))
            this.show()
        else
            this.hide()
    }

    private show(): void {
        this.text.setVisible(true)
        this.text.setPosition(this.self.x, this.self.y - 1.5 * this.self.width)
    }

    private healthUpdated(): void {
        if (this.self.attributes.hp.value >= this.hpMax)
            this.hpMax = this.self.attributes.hp.value
        this.text.setText(Math.round(this.self.attributes.hp.value).toString() + "/" + Math.round(this.hpMax))
    }

    private hide(): void {
        this.text.setVisible(false)
    }

    protected addHealthChangedListener() {
        let { attributes } = this.self
        attributes.hp.addListener(ChangeableAttribute.AttributeChanged, this.healthUpdated, this)
    }
}