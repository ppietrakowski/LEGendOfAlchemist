import BootScene from './game/BootScene';
import MainMenu from './game/MainMenu'
import Credits from './game/Credits'
import GameScene from './game/GameScene'
import Phaser from 'phaser';
import DeadScene from './game/DeadScene';

class Game extends Phaser.Game {

    constructor() {
        const width = 960;
        const height = 540;

        super({
            type: Phaser.AUTO,
            width: width,
            height: height,
            fps: {
                min: 30,
                target: 50
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true
                }
            },
            scale: {
                mode: Phaser.Scale.ScaleModes.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            },
            pixelArt: true
        });
        

        this.scene.add("BootScene", BootScene, true);
        this.scene.add('MainMenu', MainMenu, false);
        this.scene.add('Credits', Credits, false);
        this.scene.add('DeadScene', DeadScene, false);

    }
}

window.onload = () => {
    Object.defineProperty(window, 'game', new Game());
}