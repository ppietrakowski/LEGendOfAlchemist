import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';
import PlayerCombat from '../Components/PlayerCombat';

import Ingredient from '../Entities/Ingredient'
import Effect from '../Components/Effect';
import * as items from '../Entities/Items';

export default class GameScene extends Phaser.Scene {

    player: Player;
    enemies: Array<Enemy>;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    seaLayer: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super('GameScene');
    }

    preload(): void {
        this.load.image('main-island', 'assets/tilemap/placeholder.png');
        this.load.spritesheet('shark', 'assets/temp/shark_walk.png', { frameWidth: 32, frameHeight: 32 });
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 });
        this.load.tilemapTiledJSON('island', 'assets/tilemap/main-island.json');
        this.load.image('inventory-background', 'assets/temp/inventory-background.png');
        
        items.loadItems(this);
    }

    create(): void {
        this.map = this.make.tilemap({ key: 'island' });
        this.tileset = this.map.addTilesetImage('textures', 'main-island');
        this.seaLayer = this.map.createLayer('sea', this.tileset, -100, -100);
        this.map.createLayer('island', this.tileset, -100, -100);

        this.player = new Player(this, this.physics.add.sprite(220, 140, 'player'));
        this.addEnemies();
        this.addCollision();
    }

    update(time: number, delta: number): void {
        this.player.update(delta / 1000);
        for (let i of this.enemies)
            this.updateEnemy(i, delta);

        if (this.player.isDead())
            this.player.makeDead();
    }

    private deleteEnemy(enemy: Enemy) {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i] === enemy)
                this.enemies.splice(i, 1);
        }
    }

    private addEnemies() {
        this.enemies = [];
        for (let i = 0; i < 10; i++) {
            this.enemies.push(new Enemy(`shark`, 120, this.physics.add.sprite(Math.random() * 960, Math.random() * 540, 'shark'), this.player));
            this.player.getComponent<PlayerCombat>('player-combat').addEnemy(this.enemies[i]);
            this.physics.add.collider(this.enemies[i].sprite, this.seaLayer);
        }
    }

    private addCollision() {
        this.physics.add.collider(this.player.sprite, this.seaLayer);
        this.seaLayer.setCollisionBetween(48, 51);
        this.seaLayer.setCollisionBetween(56, 59);
    }

    private updateEnemy(enemy: Enemy, deltaTime: number) {
        enemy.update(deltaTime / 1000);

        if (enemy.isDead()) {
            enemy.makeDead();
            this.deleteEnemy(enemy);
        }
    }
}