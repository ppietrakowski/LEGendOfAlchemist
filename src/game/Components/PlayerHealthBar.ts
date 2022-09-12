import Player from '../Entities/Player'
import { HealthBar } from './HealthBar'

export default class PlayerHealthBar extends HealthBar {
    constructor(owner: Player) {
        super(owner, owner)
    }

    start(): void {
        this._text = this._owner.scene.add.text(20, 20,
            this._player.attributes.health.toString(), {
                fontFamily: 'pixellari', color: '#ffffff',
                backgroundColor: '#880000', fontSize: '16px'
            })

        this._text.setScrollFactor(0)
        this._hpMax = this._owner.attributes.health

        this.addHealthChangedListener()
    }
}