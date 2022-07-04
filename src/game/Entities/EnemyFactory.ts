import Phaser from 'phaser'
import { spawnAtTile } from '../Scenes/SceneUtils'
import { getRandomEnemyKey } from './Enemies'
import Enemy from './Enemy'
import Player from './Player'
import Boss from './Boss'
import UltraBoss from './UltraBoss'


export default class EnemyFactory {
    private readonly scene: Phaser.Scene
    private readonly player: Player
    private readonly seaLayer: Phaser.Tilemaps.TilemapLayer

    constructor(scene: Phaser.Scene, player: Player, seaLayer: Phaser.Tilemaps.TilemapLayer) {
        this.scene = scene
        this.player = player
        this.seaLayer = seaLayer
    }

    getEnemy(textureName: string, isleNo: number): Enemy {
        const enemy = new Enemy(this.scene, 0, 0, textureName, textureName, 140, this.player)

        spawnAtTile(enemy, isleNo, this.seaLayer)

        this.player.combat.addEnemy(enemy)

        return enemy
    }

    getRandomEnemy(isleNo: number): Enemy {
        return this.getEnemy(getRandomEnemyKey(), isleNo)
    }

    getBoss(tileX: number, tileY: number, portalNo: number, wantUltraBoss=false): Boss {
        const enemyName = getRandomEnemyKey()
        let boss: Boss

        if (wantUltraBoss)
            boss = new UltraBoss(this.scene, tileX * 32, tileY * 32, enemyName, enemyName, 140, this.player)
        else
            boss = new Boss(this.scene, tileX * 32, tileY * 32, enemyName, enemyName, 140, this.player, portalNo)

        this.player.combat.addEnemy(boss)
        
        return boss
    }
}