
import Button from "./Button";

function onBack(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('Credits', 'MainMenu');
}

//TODO: background music
export default class Credits extends Phaser.Scene {
    private text: string;
    private back: Button;

    constructor() {
        super('Credits');
    }

    preload(): void {
        this.text = 'Created by ppietrakowski, SebaPGK, MichalDrozdz2000';
        this.load.image('back', 'assets/buttons/back.png');
        this.load.image('background', 'assets/temp/background.png');
    }

    create(): void {
        this.add.image(0, 0, 'background').setOrigin(0, 0);
        this.add.text(50, 50, this.text, {color: '#111155'});
        this.back = new Button(this, 185, 500, 'back', onBack);
        this.back.scaleX = 0.5;
        this.back.scaleY = 0.5;
    }
}