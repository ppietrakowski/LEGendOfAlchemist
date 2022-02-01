import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';
import Portal from '../Entities/Portal';
import Boss from '../Entities/Boss'

import PlayerCombat from '../Components/PlayerCombat';
import { getRandomEnemyKey } from '../Entities/Enemies';
import Ingredient from '../Entities/Ingredient';
import Effect from '../Components/Effect';
import { getItemWithRandomEffect } from '../Entities/Items';
import UltraBoss from '../Entities/UltraBoss'

export function spawnAtGrassTile(sprite: Phaser.Physics.Arcade.Sprite, isle: number, layer: Phaser.Tilemaps.TilemapLayer) {
    while (layer.getTileAtWorldXY(Math.round(sprite.x), Math.round(sprite.y)) != null) {
        if (isle === 0) {
            sprite.x = Math.round(Phaser.Math.Between(9, 68)) * 32;
            sprite.y = Math.round(Phaser.Math.Between(6, 53)) * 32;
        } else if (isle === 1) {
            sprite.x = Math.round(Phaser.Math.Between(132, 213)) * 32;
            sprite.y = Math.round(Phaser.Math.Between(33, 80)) * 32;
        } else if (isle === 2) {
            sprite.x = Math.round(Phaser.Math.Between(12, 144)) * 32;
            sprite.y = Math.round(Phaser.Math.Between(111, 155)) * 32;
        } else {
            sprite.x = Math.round(Phaser.Math.Between(66, 115)) * 32;
            sprite.y = Math.round(Phaser.Math.Between(59, 68)) * 32;
        }
    }
}

export abstract class GameBaseScene extends Phaser.Scene {
    enemies: Array<Enemy>;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    seaLayer: Phaser.Tilemaps.TilemapLayer;
    enemyKilled = 0

    constructor(key: string) {
        super(key);
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
        this.enemies = [];
        for (let i = 0; i < 50; i++) {
            let enemy = getRandomEnemyKey()
            let sprite = this.physics.add.sprite(0, 0, enemy);

            this.setupEnemy(player, sprite, enemy, i % 4);
        }

        this.addBoss(player, 43 * 32, 52 * 32, 0);
        this.addBoss(player, 161 * 32, 69 * 32, 1);
        this.addBoss(player, 116 * 32, 107 * 32, 2);
        this.addBoss(player, 104 * 32, 61 * 32, -1, true);
    }

    protected addBoss(player: Player, posX: number, posY: number, index: number, superboss: boolean = false) {
        let enemy = getRandomEnemyKey()
        let sprite = this.physics.add.sprite(posX, posY, enemy);
        if (!superboss)
            this.enemies.push(new Boss(enemy, 120, sprite, player, index));
        else
            this.enemies.push(new UltraBoss(enemy, 120, sprite, player));
        player.combat.addEnemy(this.enemies[this.enemies.length - 1]);
    }

    protected setupEnemy(player: Player, sprite: Phaser.Physics.Arcade.Sprite, name: string, isle: number): void {
        let enemy: Enemy;
        spawnAtGrassTile(sprite, isle, this.seaLayer);

        enemy = new Enemy(name, 140, sprite, player);

        player.combat.addEnemy(enemy);
        this.enemies.push(enemy);
    }

    protected updateEnemy(enemy: Enemy, deltaTime: number): void {
        enemy.update(deltaTime / 1000);

        if (enemy.isDead()) {
            this.enemyKilled++;
            enemy.makeDead();
            this.deleteEnemy(enemy);
        }
    }

    protected deleteEnemy(enemy: Enemy) {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i] === enemy)
                this.enemies.splice(i, 1);
        }
    }

    protected addCollisionWithSeaLayer(): void {
        this.seaLayer.setCollisionBetween(0, 7);
        this.seaLayer.setCollisionBetween(8, 8);
        this.seaLayer.setCollisionBetween(10, 15);
        this.seaLayer.setCollisionBetween(16, 23);
        this.seaLayer.setCollisionBetween(29, 31);
    }
}
