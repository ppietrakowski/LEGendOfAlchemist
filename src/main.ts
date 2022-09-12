import Phaser from 'phaser'
import Credits from './game/Scenes/Credits'
import GameScene from './game/Scenes/GameScene'
import InventoryUi from './game/Scenes/InventoryUi'
import PreloadScene from './game/Scenes/PreloadScene'


class Game extends Phaser.Game {

    constructor() {
        super({
            type: Phaser.AUTO,
            width: 960,
            height: 540,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: true
                }
            },
            scale: {
                mode: Phaser.Scale.ScaleModes.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            dom: {
                createContainer: true
            },
            pixelArt: true,
        })

        this.loadScenes()
    }

    loadScenes(): void {
        this.scene.add('Preload', PreloadScene, true)
        this.scene.add('Credits', Credits, false)
        this.scene.add('GameScene', GameScene, false)
        this.scene.add('Inventory', InventoryUi, false)
    }
}

window.onload = () => {
    let game = new Game();
}
