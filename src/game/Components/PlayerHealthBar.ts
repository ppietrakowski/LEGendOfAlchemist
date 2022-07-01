import Character from '../Entities/Character'
import Player from '../Entities/Player'
import HealthBar from './HealthBar'
import ChangeableAttribute from '../ChangeableAttribute'

export default class PlayerHealthBar extends HealthBar {

    constructor(player: Player) {
        super(player, 100)
    }

    start(character: Character): void {
        this.text = character.scene.add.text(20, 20,
            this.player.attributes.hp.value.toString(), {
            fontFamily: 'pixellari', color: '#ffffff',
            backgroundColor: '#880000', fontSize: '16px'
        })

        this.text.setScrollFactor(0)
        this.hpMax = character.attributes.hp.value
        this.self = this.player

        this.addHealthChangedListener()
    }

    update(_timeSinceLastFrame: number): void {

    }
}