import Phaser from "phaser";
import Button from './Button'

function onMainGameClicked(this: Phaser.GameObjects.Sprite): void {
}

function onCreditsClicked(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('MainMenu', 'Credits');
}

export default class MainMenu extends Phaser.Scene {
    private buttons: Array<Button>;
    private devBuild: boolean;

    constructor() {
        super('MainMenu');
        this.buttons = [];
        this.devBuild = true;
    }

    preload(): void {
        this.load.image('play', 'assets/buttons/play.png');
        this.load.image('credits', 'assets/buttons/credits.png');
    }

    create(): void {
        this.buttons.push(new Button(this, 185 + 120, 95 + 120, 'play', onMainGameClicked));
        this.buttons.push(new Button(this, 185 + 120, 95 + 210, 'credits', onCreditsClicked));
    }
}