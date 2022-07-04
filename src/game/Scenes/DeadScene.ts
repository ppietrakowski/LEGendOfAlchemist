import Phaser from 'phaser'
import Button from '../Entities/Button'

export default class DeadScene extends Phaser.Scene {
    private back: Button;

    constructor() {
        super('DeadScene')
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setTint(0xff0000)
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'You failed to reach the boss', { fontSize: '40px', fontFamily: 'pixellari', color: '#ff1155', stroke: '#fff', strokeThickness: 1 }).setOrigin(0.5)
        this.back = new Button(this.add.sprite(this.scale.width / 2, this.scale.height - 120, 'back'))
        this.back.addClickListener(this.onButtonPressed, this)
    }

    private onButtonPressed(): void {
        const { scene } = this.game

        scene.switch('DeadScene', 'MainMenu');
    }
}