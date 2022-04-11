import Button from "../Entities/Button"
import MainMenu from "./MainMenu"


function onButtonPressed(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('WinScene', 'MainMenu');
    (this.scene.game.scene.getScene('MainMenu') as MainMenu).theme.play()
}

export default class WinScene extends Phaser.Scene {

    back: Button

    constructor() {
        super('WinScene')
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0).setTint(0xffff00)
        this.add.text(this.scale.width / 2, this.scale.height / 2, 'You defeated the boss!', { fontSize: '40px', fontFamily: 'pixellari', color: '#ff1155', stroke: '#fff', strokeThickness: 1 }).setOrigin(0.5)
        this.back = new Button(this, this.scale.width / 2, this.scale.height - 120, 'back', onButtonPressed)
    }
}