import Phaser from 'phaser'
import { spawnAtTile } from '../Scenes/SceneUtils'
import { getRandomEnemyKey } from './Enemies'
import Enemy from './Enemy'
import Player from './Player'
import Boss from './Boss'
import UltraBoss from './UltraBoss'
import GameObject from './GameObject'
import Attribute from '../Components/Attribute'


export default class EnemyFactory {

    private cachedEnemy: GameObject
    private enemies: GameObject[]

    constructor(private readonly scene: Phaser.Scene,
        private readonly player: Player,
        private readonly seaLayer: Phaser.Tilemaps.TilemapLayer,
        private readonly portals: Phaser.GameObjects.GameObject[]
    ) {
        this.enemies = []
    }

    get lastCreatedEnemy() { return this.cachedEnemy }
    get createdEnemies() { return this.enemies.map(v => v) }

    private deleteEnemy(enemy: GameObject) {
        this.enemies = this.enemies.filter(value => value !== enemy)
    }

    private setupEnemy(enemy: Enemy): void {
        this.player.combat.addEnemy(enemy)

        this.cachedEnemy = enemy

        this.addCollisionToEnemy()
        this.enemies.push(enemy)
    }

    private addCollisionToEnemy(): void {
        for (let portal of this.portals)
            this.scene.physics.add.collider(this.cachedEnemy, portal)
        this.scene.physics.add.collider(this.cachedEnemy, this.seaLayer)
    }

    createEnemy(textureName: string, isleNo: number): Enemy {
        const enemy = new Enemy(this.scene, 0, 0, textureName, textureName, 140, this.player)

        spawnAtTile(enemy, isleNo, this.seaLayer)
        this.setupEnemy(enemy)

        enemy.attributes.once(Attribute.CHARACTER_DEAD, () => this.deleteEnemy(enemy))

        return enemy
    }

    createRandomEnemy(isleNo: number): Enemy {
        return this.createEnemy(getRandomEnemyKey(), isleNo)
    }

    createBoss(tileX: number, tileY: number, portalNo: number, wantUltraBoss = false): Boss {
        const enemyName = getRandomEnemyKey()
        let boss: Boss

        if (wantUltraBoss)
            boss = new UltraBoss(this.scene, tileX * 32, tileY * 32, enemyName, enemyName, 140, this.player)
        else
            boss = new Boss(this.scene, tileX * 32, tileY * 32, enemyName, enemyName, 140, this.player, portalNo)

        this.setupEnemy(boss)

        return boss
    }
}