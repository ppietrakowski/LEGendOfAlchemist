
import Phaser from 'phaser';

import Button from '../Entities/Button';

function onMainGameClicked(self: MainMenu): void {
    self.theme.stop();
    self.game.scene.stop('MainMenu');
    self.game.scene.run('GameScene');
}

function onCreditsClicked(self: MainMenu): void {
    self.game.scene.switch('MainMenu', 'Credits');
}

function onSoundClicked(self: MainMenu): void {
    if (self.playing == true) {
        self.playing = false
        self.theme.stop()

        self.music_button.setTexture('sound-off')
    } else {
        self.playing = true
        self.theme.play({loop: true, delay: 0.25});

        self.music_button.setTexture('sound-on')
    }
}

export default class MainMenu extends Phaser.Scene {
    private buttons: Array<Button>;
    theme: Phaser.Sound.BaseSound;
    playing: boolean;
    music_button: Button;

    constructor() {
        super('MainMenu');
        this.buttons = [];
    }

    create(): void {
        this.theme = this.sound.add('menu-theme');
        this.theme.play({loop: true, delay: 0.25});
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.image(this.scale.width / 2, 100, 'logo');   

        this.buttons.push(new Button(this, this.scale.width / 2, 125 + 120, 'play', () => { onMainGameClicked(this); }));
        this.buttons.push(new Button(this, this.scale.width / 2, 125 + 255, 'credits', () => onCreditsClicked(this)));

        this.playing = true
        this.music_button = new Button(this, this.scale.width - 70, this.scale.height - 70, 'sound-on', () => onSoundClicked(this))
        this.buttons.push(this.music_button);
    }

}