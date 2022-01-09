
import Phaser, { DOM } from "phaser";
export default class MainMenu extends Phaser.Scene {
    private buttons: Array<Phaser.GameObjects.Sprite>;
    
    constructor() { 
        super('MainMenu');
        this.buttons = [];
    }
    
    preload(): void {
        this.load.image('play', 'assets/playBtn.png');
        this.load.image('credits', 'assets/creditsBtn.png');
    }

    create(): void {
        this.buttons.push(this.add.sprite(95 + 120, 95 + 120, 'play'));
        this.buttons[0].setInteractive({pixelPerfect: true});
        this.buttons[0].on(Phaser.Input.Events.POINTER_OVER, () => this.buttons[0].setTint(0x787878));
        this.buttons[0].on(Phaser.Input.Events.POINTER_OUT, () => this.buttons[0].clearTint())
        this.buttons[0].on(Phaser.Input.Events.POINTER_UP, this.onMainGameClicked);


        //this.buttons.push(this.add.sprite(95, 95, 'credits'));
    }


    onMainGameClicked(): void {
        
    }

    onCreditsClicked(): void {

    }
}