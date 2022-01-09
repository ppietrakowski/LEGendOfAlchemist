import BootScene from './game/BootScene';
import GameScene from './game/GameScene';
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
        this.scene.add("GameScene", GameScene, false);
        this.scene.add('MainMenu', MainMenu, false);
    }
}

window.onload = () => {
    // Obiekt gry jest udostępniony przez własność `window.game`. Można z niej korzystać w dowolnym miejscu kodu.
    Object.defineProperty(window, 'game', new Game());
}