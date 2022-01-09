import Phaser from "phaser";
import Button from "./Button";

function onBack(this: Phaser.GameObjects.Sprite): void {
    this.scene.game.scene.switch('Credits', 'MainMenu');
}

export default class Credits extends Phaser.Scene {
    private text: string;
    private back: Button;

    constructor() {
        super('Credits');
    }

    preload(): void {
        this.text = 'Created by ppietrakowski, SebaPGK, MichalDrozdz2000';
        this.load.image('back', 'assets/buttons/back.png');
    }

    create(): void {
        this.add.text(10, 10, this.text, {color: '#aaaaff'});
        this.back = new Button(this, 120, 120 + 210, 'back', onBack);

        this.back.on(Phaser.Input.Events.POINTER_OVER, () => this.back.setTint(0x787878));
        this.back.on(Phaser.Input.Events.POINTER_OUT, () => this.back.clearTint());
        this.back.on(Phaser.Input.Events.POINTER_UP, onBack);
    }
}