import Phaser from 'phaser';
import Boss from '../Entities/Boss';
import { getRandomEnemyKey } from '../Entities/Enemies';
import Enemy from '../Entities/Enemy';
import Player from '../Entities/Player';
import UltraBoss from '../Entities/UltraBoss';
import { spawnAtTile } from './SceneUtils';
import * as enemies from '../Entities/Enemies'

export abstract class GameBaseScene extends Phaser.Scene {
    enemies: Array<Enemy>;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    seaLayer: Phaser.Tilemaps.TilemapLayer;
    enemyKilled = 0

    constructor(key: string) {
        super(key);
    }

    preload() {
        enemies.addAnimation(this.anims, 'player')
        for (let enemy of enemies.Enemies) {
            enemies.addAnimation(this.anims, enemy)
        }

        enemies.generateFrame(this.anims, 'player', 'front', 0, 0).repeat = -1;
        enemies.generateFrame(this.anims, 'player', 'back', 4, 4).repeat = -1;
    }

    create(): void {
        this.cameras.main.setBounds(0, 0, 7168, 5120);
        this.map = this.make.tilemap({ key: 'island' });
        this.tileset = this.map.addTilesetImage('textures', 'main-island');

        this.map.createLayer('island', this.tileset, -100, -100);
        this.seaLayer = this.map.createLayer('sea', this.tileset, -100, -100);

        this.addCollisionWithSeaLayer();
    }

    update(time: number, delta: number): void {
        for (let i of this.enemies)
            this.updateEnemy(i, delta);     
    }
    
    protected addEnemies(player: Player) {
        this.enemies = []
        const MaxNormalEnemies = 50

        for (let i = 0; i < MaxNormalEnemies; i++)
            this.setupEnemy(player, getRandomEnemyKey(), i % 4);

        this.addBoss(player, 43 * 32, 52 * 32, 0)
        this.addBoss(player, 161 * 32, 69 * 32, 1)
        this.addBoss(player, 116 * 32, 107 * 32, 2)
        this.addBoss(player, 104 * 32, 61 * 32, -1, true)
    }

    protected addBoss(player: Player, posX: number, posY: number, index: number, superboss: boolean = false) {
        let enemyName = getRandomEnemyKey()
        const enemyStartAnimation = enemyName + '-stay'

        if (!superboss)
            this.enemies.push(new Boss(this, posX, posY, enemyName, enemyStartAnimation, enemyName, 120, player, index))
        else
            this.enemies.push(new UltraBoss(this, posX, posY, enemyName, enemyStartAnimation, enemyName, 120, player))
        
        // last enemy -> enemies.length - 1
        player.combat.addEnemy(this.enemies[this.enemies.length - 1]);
    }

    protected setupEnemy(player: Player, name: string, isle: number): void {
        let enemy = new Enemy(this, 0, 0, name, name + 'stay', name, 140, player);
        spawnAtTile(enemy, isle, this.seaLayer);

        player.combat.addEnemy(enemy);
        this.enemies.push(enemy);
    }

    protected updateEnemy(enemy: Enemy, deltaTime: number): void {
        enemy.update(deltaTime / 1000);

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