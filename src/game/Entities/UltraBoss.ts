
import EnemyController from '../Components/EnemyController'
import GameScene from '../Scenes/GameScene'
import Boss from './Boss'
import Player from './Player'

export default class UltraBoss extends Boss {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, name: string, maxRange: number, player: Player) {
        super(scene, x, y, texture, name, maxRange, player, -1)
        this.setScale(2, 2)
        this.setTint(0xff0000)
    }


    makeDead(): void {
        let gameScene = this.getComponent<EnemyController>('enemy-movement').target.gameScene as GameScene

        // for now just show dead screen
        this.scene.game.scene.run('WinScene')

        gameScene.currentMusic.stop()

        this.scene.game.scene.stop('GameScene')
    }
}