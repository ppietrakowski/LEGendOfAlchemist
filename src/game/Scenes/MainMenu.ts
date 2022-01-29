
import Phaser from 'phaser';

import Button from '../Entities/Button';

function onMainGameClicked(self: MainMenu): void {
    self.theme.stop();
    self.game.scene.switch('MainMenu', 'GameScene');
}

function onCreditsClicked(self: MainMenu): void {
    self.game.scene.switch('MainMenu', 'Credits');
}

export default class MainMenu extends Phaser.Scene {
    private buttons: Array<Button>;
    theme: Phaser.Sound.BaseSound;

    constructor() {
        super('MainMenu');
        this.buttons = [];
    }

    create(): void {
        this.theme = this.sound.add('menu-theme');
        this.theme.play({loop: true, delay: 0.25});
        this.add.image(0, 0, 'background').setOrigin(0, 0);

        this.buttons.push(new Button(this, 960 / 2 - 30, 95 + 120, 'play', () => { onMainGameClicked(this); }));
        this.buttons.push(new Button(this, 960 / 2 - 30, 95 + 255, 'credits', () => onCreditsClicked(this)));
    }

}