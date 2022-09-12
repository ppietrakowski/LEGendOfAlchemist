import Phaser from 'phaser'
import Player from '../Entities/Player'
import * as enemies from '../Entities/Enemies'
import EnemyFactory from '../Entities/EnemyFactory'
import { addInformationText } from './SceneUtils'

export abstract class GameBaseScene extends Phaser.Scene {

    protected _map: Phaser.Tilemaps.Tilemap
    protected _tileset: Phaser.Tilemaps.Tileset
    protected _seaLayer: Phaser.Tilemaps.TilemapLayer

    protected _player: Player

    protected _enemyFactory: EnemyFactory
    protected _enemyKilled = 0

    get enemyKilled() { 
        return this._enemyKilled
    }

    constructor(key: string) {
        super(key)
    }

    preload() {
        enemies.addAnimation(this.anims, 'player')
        for (const enemy of enemies.Enemies)
            enemies.addAnimation(this.anims, enemy)

        enemies.generateFrame(this.anims, 'player', 'front', 0, 0).repeat = -1
        enemies.generateFrame(this.anims, 'player', 'back', 4, 4).repeat = -1
    }

    create(): void {
        this.cameras.main.setBounds(0, 0, 7168, 5120)
        this._map = this.make.tilemap({ key: 'island' })
        this._tileset = this._map.addTilesetImage('textures', 'main-island')

        this._map.createLayer('island', this._tileset, -100, -100)
        this._seaLayer = this._map.createLayer('sea', this._tileset, -100, -100)
        this._player = new Player(this, 19 * 32, 14 * 32, 'player')
        
        this.addCollisionWithSeaLayer()
    }

    showCannotGatherInfo(): void {
        addInformationText(this, this._player.x, this._player.y, 
            'I don\'t have enough space to gather this item',
            (text: Phaser.GameObjects.GameObject) => text.destroy())
    }

    protected addCollisionWithSeaLayer(): void {
        const Sea = [0, 7]
        const Houses = [10, 15]

        this._seaLayer.setCollisionBetween(Sea[0], Sea[1])
        this._seaLayer.setCollisionBetween(8, 8)
        this._seaLayer.setCollisionBetween(Houses[0], Houses[1])
        this._seaLayer.setCollisionBetween(16, 23)
        this._seaLayer.setCollisionBetween(29, 31)
    }
}
