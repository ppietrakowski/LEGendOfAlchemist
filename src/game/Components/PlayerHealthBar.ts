import Player from '../Entities/Player'
import HealthBar from './HealthBar'

export default class PlayerHealthBar extends HealthBar {
    constructor(owner: Player) {
        super(owner, 100, owner)
    }

    start(): void {
        this.text = this.owner.scene.add.text(20, 20,
            this.player.attributes.health.toString(), {
            fontFamily: 'pixellari', color: '#ffffff',
            backgroundColor: '#880000', fontSize: '16px'
        })

        this.text.setScrollFactor(0)
        this.hpMax = this.owner.attributes.health

        this.addHealthChangedListener()
    }
}