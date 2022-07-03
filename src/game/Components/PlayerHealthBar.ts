import GameObject from '../Entities/GameObject'
import Player from '../Entities/Player'
import HealthBar from './HealthBar'

export default class PlayerHealthBar extends HealthBar {

    constructor(owner: Player) {
        super(owner, 100)
    }

    start(): void {
        this.text = this.owner.scene.add.text(20, 20,
            this.player.attributes.hp.value.toString(), {
            fontFamily: 'pixellari', color: '#ffffff',
            backgroundColor: '#880000', fontSize: '16px'
        })

        this.text.setScrollFactor(0)
        this.hpMax = this.owner.attributes.hp.value

        this.addHealthChangedListener()
    }
}