import Button from '../Entities/Button'

export default class WinScene extends Phaser.Scene {
    private _backButton: Button

    constructor() {
        super('WinScene')
    }

    private buttonPressed(this: Phaser.GameObjects.Sprite): void {
        this.scene.game.scene.switch('WinScene', 'MainMenu')
    }
    
    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setTint(0xffff00)
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'You defeated the boss!', { fontSize: '40px', fontFamily: 'pixellari', color: '#ff1155', stroke: '#fff', strokeThickness: 1 }).setOrigin(0.5)
        this._backButton = new Button(this.add.sprite(this.scale.width / 2, this.scale.height - 120, 'back'))
        this._backButton.addClickListener(this.buttonPressed, this)
    }

}