
import Phaser from "phaser";
export default class MainMenu extends Phaser.Scene {
    constructor() { 
        super('MainScene');
    }
    
    preload(): void {
        document.getElementById('mainGame').style.visibility = 'visible';
        document.getElementById('credits').style.visibility = 'visible';


        document.getElementById('mainGame').onclick = this.onMainGameClicked;
        document.getElementById('credits').onclick = this.onCreditsClicked;
    }

    create(): void {
        
    }


    onMainGameClicked(): void {

    }

    onCreditsClicked(): void {

    }
}