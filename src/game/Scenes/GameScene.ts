import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';
import PlayerCombat from '../Components/PlayerCombat';

import Ingredient from '../Entities/Ingredient'
import Effect from '../Components/Effect';

export default class GameScene extends Phaser.Scene {

    player: Player;
    enemies: Array<Enemy>;
    map: Phaser.Tilemaps.Tilemap;
    tileset: Phaser.Tilemaps.Tileset;
    islands: Phaser.Tilemaps.TilemapLayer;

    constructor() {
        super('GameScene');
    }

    preload(): void {
        this.load.image('main-island', 'assets/tilemap/placeholder.png');
        this.load.spritesheet('shark', 'assets/temp/shark_walk.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 });
        this.load.tilemapTiledJSON('island', 'assets/tilemap/main-island.json');

        this.load.image('cherries', 'assets/items/cherries.png');
        this.load.image('orange', 'assets/items/orange.png');
        this.load.image('red_flower', 'assets/items/red_flower.png');
    }

    create(): void {
        this.map = this.make.tilemap({key: 'island'});
        this.tileset = this.map.addTilesetImage('textures', 'main-island');
        this.map.createLayer('sea', this.tileset, -100, -100);
        this.islands = this.map.createLayer('island', this.tileset, -100, -100);

        this.player = new Player(this.physics.add.sprite(220, 140, 'player'));
        
        this.enemies = [];

        for (let i = 0; i < 10; i++) {
            this.enemies.push(new Enemy(`shark`, 120, this.physics.add.sprite(Math.random() * 960, Math.random() * 540, 'shark'), this.player));
            this.addEnemyAnimation(this.enemies[i].sprite, 'shark');
            this.player.getComponent<PlayerCombat>('player-combat').addEnemy(this.enemies[i]);
        }
    }

    update(time: number, delta: number): void {
        this.player.update(delta / 1000);
        for (let i of this.enemies) {
            i.update(delta / 1000);

            if (i.isDead()) {
                i.makeDead();
                this.deleteEnemy(i);
            }
        }

        if (this.player.isDead())
            this.player.makeDead();
    }

    deleteEnemy(enemy: Enemy) {
        for (let i = 0; i < this.enemies.length; i++) {
            if (this.enemies[i] === enemy)
                this.enemies.splice(i, 1);
        }    
    }

    addEnemyAnimation(enemy: Phaser.Physics.Arcade.Sprite, enemyName: string) {
        let frameName = enemyName;
        let anims = enemy.anims;

        anims.create(
            {
                key: frameName + '-stay',
                frames: anims.generateFrameNumbers(frameName, { start: 0, end: 0 }),
                frameRate: 5
            });

        anims.create(
            {
                key: frameName + '-front-run',
                frames: anims.generateFrameNumbers(frameName, { start: 0, end: 3 }),
                frameRate: 5
            });

            anims.create(
                {
                    key: frameName + '-right-run',
                    frames: anims.generateFrameNumbers(frameName, { start: 8, end: 11 }),
                    repeat: -1,
                    frameRate: 5
                });

        anims.create(
            {
                key: frameName + '-left-run',
                frames: anims.generateFrameNumbers(frameName, { start: 12, end: 15 }),
                repeat: -1,
                frameRate: 5
            });

        anims.create(
            {
                key: frameName + '-back-run',
                frames: anims.generateFrameNumbers(frameName, { start: 4, end: 7 }),
                repeat: -1,
                frameRate: 5
            });
    }
}