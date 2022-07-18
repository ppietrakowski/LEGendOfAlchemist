import Phaser from 'phaser'
import Player from '../Entities/Player'
import * as enemies from '../Entities/Enemies'
import EnemyFactory from '../Entities/EnemyFactory'
import { addInformationText } from './SceneUtils'

export abstract class GameBaseScene extends Phaser.Scene {

    protected map: Phaser.Tilemaps.Tilemap
    protected tileset: Phaser.Tilemaps.Tileset
    protected seaLayer: Phaser.Tilemaps.TilemapLayer

    protected player: Player

    protected enemyFactory: EnemyFactory
    protected enemyKilled = 0

    get killStatistics() { return this.enemyKilled }

    constructor(key: string) {
        super(key)
    }

    preload() {
        enemies.addAnimation(this.anims, 'player')
        for (let enemy of enemies.Enemies)
            enemies.addAnimation(this.anims, enemy)

        enemies.generateFrame(this.anims, 'player', 'front', 0, 0).repeat = -1
        enemies.generateFrame(this.anims, 'player', 'back', 4, 4).repeat = -1
    }

    create(): void {
        this.cameras.main.setBounds(0, 0, 7168, 5120);
        this.map = this.make.tilemap({ key: 'island' })
        this.tileset = this.map.addTilesetImage('textures', 'main-island')

        this.map.createLayer('island', this.tileset, -100, -100)
        this.seaLayer = this.map.createLayer('sea', this.tileset, -100, -100)
        this.player = new Player(this, 19 * 32, 14 * 32, 'player')
        
        this.addCollisionWithSeaLayer()
    }

    showCannotGatherInfo(): void {
        addInformationText(this, this.player.x, this.player.y, 
            'I don\'t have enough space to gather this item',
             (text: Phaser.GameObjects.GameObject) => text.destroy())
    }

    protected addCollisionWithSeaLayer(): void {
        const Sea = [0, 7]
        const Houses = [10, 15]

        this.seaLayer.setCollisionBetween(Sea[0], Sea[1])
        this.seaLayer.setCollisionBetween(8, 8)
        this.seaLayer.setCollisionBetween(Houses[0], Houses[1])
        this.seaLayer.setCollisionBetween(16, 23)
        this.seaLayer.setCollisionBetween(29, 31)
    }
}
