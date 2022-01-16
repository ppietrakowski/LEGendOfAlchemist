import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';



export default class GameScene extends Phaser.Scene {

    player: Player;
    testEnemy: Enemy;
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
    }

    create(): void {
        this.map = this.make.tilemap({key: 'island'});
        this.tileset = this.map.addTilesetImage('textures', 'main-island');
        this.map.createLayer('sea', this.tileset, -100, -100);
        this.islands = this.map.createLayer('island', this.tileset, -100, -100);

        this.player = new Player(this.physics.add.sprite(220, 140, 'player'));
        this.testEnemy = new Enemy('shark', 200, this.physics.add.sprite(230, 400, 'shark'), this.player);
    }

    update(time: number, delta: number): void {
        this.player.update(delta / 1000);
        this.testEnemy.update(delta / 1000);
    }
}