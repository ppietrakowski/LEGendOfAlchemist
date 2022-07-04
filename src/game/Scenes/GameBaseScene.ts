import Phaser from 'phaser'
import Enemy from '../Entities/Enemy'
import Player from '../Entities/Player'
import * as enemies from '../Entities/Enemies'
import EnemyFactory from '../Entities/EnemyFactory'
import Attribute from '../Components/Attribute'
import { addInformationText } from './SceneUtils'
import GameObject from '../Entities/GameObject'

export abstract class GameBaseScene extends Phaser.Scene {
    
    protected map: Phaser.Tilemaps.Tilemap
    protected tileset: Phaser.Tilemaps.Tileset
    protected seaLayer: Phaser.Tilemaps.TilemapLayer
    
    protected player: Player
    
    protected enemyFactory: EnemyFactory
    protected enemies: Enemy[]
    protected enemyKilled = 0
    private hitSound: Phaser.Sound.BaseSound

    get killStatistics() { return this.enemyKilled }

    constructor(key: string) {
        super(key)
        this.enemies = []
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

        this.enemyFactory = new EnemyFactory(this, this.player, this.seaLayer)
        this.hitSound = this.sound.add('player-slap')

        this.addCollisionWithSeaLayer()
    }

    protected addEnemies() {
        const MaxNormalEnemies = 50

        for (let i = 0; i < MaxNormalEnemies; i++)
            this.addEnemy(i)

        this.enemies.push(this.enemyFactory.getBoss(43, 52, 0))
        this.enemies.push(this.enemyFactory.getBoss(161, 69, 1))
        this.enemies.push(this.enemyFactory.getBoss(116, 107, 2))
        this.enemies.push(this.enemyFactory.getBoss(104, 61, -1, true))
    }
    showCannotGatherInfo(): void {
        addInformationText(this, this.player.x, this.player.y, 'I don\'t have enough space to gather this item', (text: Phaser.GameObjects.GameObject) => text.destroy())
    }

    protected addBoss(posX: number, posY: number, index: number, superboss: boolean = false) {
        if (!superboss)
            this.enemies.push(this.enemyFactory.getBoss(posX, posY, index, false))
        else
            this.enemies.push(this.enemyFactory.getBoss(posX, posY, index, true))
    }

    protected addEnemy(i: number): void {
        const enemy = this.enemyFactory.getRandomEnemy(i % 4)
        this.enemies.push(enemy)
        enemy.attributes.on(Attribute.CHARACTER_DEAD, () => {
            this.enemyKilled++
            this.deleteEnemy(enemy)
        }, this)

        enemy.on(Enemy.ENEMY_ATTACKED, () => this.hitSound.play({volume: 0.2}))
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
