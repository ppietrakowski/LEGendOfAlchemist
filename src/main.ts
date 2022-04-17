import Phaser from 'phaser'
import CharacterInfo from './game/Scenes/CharacterInfo'
import Crafting from './game/Scenes/Crafting'
import Credits from './game/Scenes/Credits'
import DeadScene from './game/Scenes/DeadScene'
import GameScene from './game/Scenes/GameScene'
import InventoryUi from './game/Scenes/InventoryUi'
import MainMenu from './game/Scenes/MainMenu'
import PreloadScene from './game/Scenes/PreloadScene'
import WinScene from './game/Scenes/WinScene'


class Game extends Phaser.Game {

    constructor() {
        const width = 960
        const height = 540

        super({
            type: Phaser.AUTO,
            width: width,
            height: height,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 0 },
                    debug: false
                }
            },
            scale: {
                mode: Phaser.Scale.ScaleModes.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
            },
            dom: {
                createContainer: true
            },
            pixelArt: true
        })

        this.loadScenes()
    }

    loadScenes(): void {
        this.scene.add('Preload', PreloadScene, true)
        this.scene.add('Credits', Credits, false)
        this.scene.add('DeadScene', DeadScene, false)
        this.scene.add('GameScene', GameScene, false)
        this.scene.add('Inventory', InventoryUi, false)
        this.scene.add('Crafting', Crafting, false)
        this.scene.add('CharacterInfo', CharacterInfo, false)
        this.scene.add('WinScene', WinScene, false)
    }
}

window.onload = () => {
    Object.defineProperty(window, 'game', new Game())
}