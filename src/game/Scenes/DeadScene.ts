import Phaser from 'phaser'

import Button from '../Entities/Button';
import MainMenu from './MainMenu';

function onButtonPressed(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('DeadScene', 'MainMenu');
    (this.scene.game.scene.getScene('MainMenu') as MainMenu).theme.play();
}

export default class DeadScene extends Phaser.Scene {
    back: Button;

    constructor() {
        super('DeadScene');
    }

    create(): void {
        this.add.text(120, 120, 'You failed to reach a boss');
        this.back = new Button(this, 120, 400, 'back', onButtonPressed);
    }

}