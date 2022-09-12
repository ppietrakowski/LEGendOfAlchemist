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

    private _cachedEnemy: GameObject
    private _enemies: GameObject[]

    constructor(private readonly _scene: Phaser.Scene,
        private readonly _player: Player,
        private readonly _seaLayer: Phaser.Tilemaps.TilemapLayer,
        private readonly _portals: Phaser.GameObjects.GameObject[]
    ) {
        this._enemies = []
    }

    get createdEnemies() {
        return this._enemies.map(v => v)
    }

    private deleteEnemy(enemy: GameObject) {
        this._enemies = this._enemies.filter(value => value !== enemy)
    }

    private setupEnemy(enemy: Enemy): void {
        this._player.combat.addEnemy(enemy)

        this._cachedEnemy = enemy

        this.addCollisionToEnemy()
        this._enemies.push(enemy)
    }

    private addCollisionToEnemy(): void {
        for (const portal of this._portals)
            this._scene.physics.add.collider(this._cachedEnemy, portal)
        this._scene.physics.add.collider(this._cachedEnemy, this._seaLayer)
    }

    createEnemy(textureName: string, isleNo: number): Enemy {
        const enemy = new Enemy(this._scene, 0, 0, textureName, textureName, 140, this._player)

        spawnAtTile(enemy, isleNo, this._seaLayer)
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
            boss = new UltraBoss(this._scene, tileX * 32, tileY * 32, enemyName, enemyName, 140, this._player)
        else
            boss = new Boss(this._scene, tileX * 32, tileY * 32, enemyName, enemyName, 140, this._player, portalNo)

        this.setupEnemy(boss)

        return boss
    }
}