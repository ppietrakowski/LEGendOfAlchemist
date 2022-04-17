import Phaser from 'phaser'
import Boss from '../Entities/Boss'
import { getRandomEnemyKey } from '../Entities/Enemies'
import Enemy from '../Entities/Enemy'
import Player from '../Entities/Player'
import UltraBoss from '../Entities/UltraBoss'
import { spawnAtTile } from './SceneUtils'
import * as enemies from '../Entities/Enemies'
import EnemyFactory from '../Entities/EnemyFactory'
import GameScene from './GameScene'

export abstract class GameBaseScene extends Phaser.Scene {
    enemies: Enemy[]
    map: Phaser.Tilemaps.Tilemap
    tileset: Phaser.Tilemaps.Tileset
    seaLayer: Phaser.Tilemaps.TilemapLayer
    enemyFactory: EnemyFactory
    player: Player
    enemyKilled = 0

    constructor(key: string) {
        super(key)
    }

    preload() {
        enemies.addAnimation(this.anims, 'player')
        for (let enemy of enemies.Enemies) {
            enemies.addAnimation(this.anims, enemy)
        }

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
        
        this.enemyFactory = new EnemyFactory(this, this.player, this.seaLayer)
        this.addCollisionWithSeaLayer()
    }

    update(time: number, delta: number): void {
        for (let i of this.enemies)
            this.updateEnemy(i, delta)
    }

    protected addEnemies() {
        this.enemies = []
        const MaxNormalEnemies = 50

        for (let i = 0; i < MaxNormalEnemies; i++)
            this.addEnemy(i)

        this.enemies.push(this.enemyFactory.getBoss(43, 52, 0))
        this.enemies.push(this.enemyFactory.getBoss(161, 69, 1))
        this.enemies.push(this.enemyFactory.getBoss(116, 107, 2))
        this.enemies.push(this.enemyFactory.getBoss(104, 61, -1, true))
    }

    protected addBoss(posX: number, posY: number, index: number, superboss: boolean = false) {
        if (!superboss)
            this.enemies.push(this.enemyFactory.getBoss(posX, posY, index, false))
        else
            this.enemies.push(this.enemyFactory.getBoss(posX, posY, index, true))
    }

    protected addEnemy(i: number): void {
        let enemy = this.enemyFactory.getRandomEnemy(i % 4)
        this.enemies.push(enemy)
    }

    protected updateEnemy(enemy: Enemy, deltaTime: number): void {
        enemy.update(deltaTime / 1000)

        if (enemy.isDead()) {
            this.enemyKilled++
            enemy.makeDead()
            this.deleteEnemy(enemy)
        }
    }

    protected deleteEnemy(enemy: Enemy) {
        this.enemies = this.enemies.filter(value => value !== enemy)
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
