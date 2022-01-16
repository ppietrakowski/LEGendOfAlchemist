import Phaser from 'phaser';

import BootScene from './game/Scenes/BootScene';
import MainMenu from './game/Scenes/MainMenu'
import Credits from './game/Scenes/Credits'
import GameScene from './game/Scenes/GameScene'
import DeadScene from './game/Scenes/DeadScene';

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
        this.scene.add('GameScene', GameScene, false);
    }
}

window.onload = () => {
    Object.defineProperty(window, 'game', new Game());
}