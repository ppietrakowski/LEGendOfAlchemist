
import Button from './Button'
import GameScene from "./GameScene";


function onMainGameClicked(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.add('GameScene', GameScene, false);
    this.scene.game.scene.switch('MainMenu', 'GameScene');
}

function onCreditsClicked(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('MainMenu', 'Credits');
}

export default class MainMenu extends Phaser.Scene {
    private buttons: Array<Button>;
    constructor() {
        super('MainMenu');
        this.buttons = [];
    }

    //TODO: background music
    preload(): void {
        this.load.image('play', 'assets/buttons/play.png');
        this.load.image('credits', 'assets/buttons/credits.png');
        this.load.image('background', 'assets/temp/background.png');
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        
        this.buttons.push(new Button(this, 960 / 2 - 30, 95 + 120, 'play', onMainGameClicked));
        this.buttons.push(new Button(this, 960 / 2 - 30, 95 + 255, 'credits', onCreditsClicked));
    }
}