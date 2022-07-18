
import Boss from './Boss'
import Player from './Player'

export default class UltraBoss extends Boss {
    constructor(scene: Phaser.Scene, x: number, y: number,
        texture: string | Phaser.Textures.Texture, name: string, maxRange: number, player: Player) {
        super(scene, x, y, texture, name, maxRange, player, -1)
        this.setScale(2, 2)
        this.setTint(0xff0000)
    }


    protected killed(): void {
        const { sound } = this.scene

        // for now just show dead screen
        this.scene.game.scene.run('WinScene')
        sound.stopAll()
        this.scene.game.scene.stop('GameScene')
    }
}