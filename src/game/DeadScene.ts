import Phaser from "phaser";
import Button from './Button'

function onButtonPressed(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('DeadScene', 'MainMenu');
}
export default class DeadScene extends Phaser.Scene {
    back: Button;

    constructor() {
        super('DeadScene');
    }

    preload(): void {
        this.load.image('back', 'assets/buttons/back.png');
    }

    create(): void {
        this.add.text(120, 120, 'You failed to reach a boss');
        this.back = new Button(this, 120, 400, 'back', onButtonPressed);
    }

}