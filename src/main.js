import BootScene from './game/BootScene';
import MainMenu from './game/MainMenu'
import Phaser from 'phaser';

class Game extends Phaser.Game {

    constructor() {
        const width = 960;
        const height = 540;

        super({
            type: Phaser.AUTO,
            width: width,
            height: height,
            fps: {
                min: 40,
                target: 50
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 300 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.ScaleModes.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH
            }
        });

        this.scene.add("BootScene", BootScene, true);
        this.scene.add('MainMenu', MainMenu, false);
    }
}

window.onload = () => {
    Object.defineProperty(window, 'game', new Game());
}