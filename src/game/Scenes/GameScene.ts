import Phaser from 'phaser';

import Player from '../Entities/Player';
import Enemy from '../Entities/Enemy';

export default class GameScene extends Phaser.Scene {

    player: Player;
    testEnemy: Enemy;

    constructor() {
        super('GameScene');
    }

    preload(): void {
        this.load.image('background', 'assets/temp/background.png');
        this.load.image('islands', 'assets/temp/islands.png');
        this.load.spritesheet('shark', 'assets/temp/shark_walk.png', {frameWidth: 32, frameHeight: 32});
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 });
    }

    create(): void {
        let islands = this.physics.add.staticGroup();
        islands.create(0, 0, 'background');
        this.add.image(0, 0, 'islands');   
        this.player = new Player(this.physics.add.sprite(140, 100, 'player'));
        this.testEnemy = new Enemy('shark', 200, this.physics.add.sprite(0, 0, 'shark'), this.player);
    }

    update(time: number, delta: number): void {
        this.player.update(delta / 1000);
        this.testEnemy.update(delta / 1000);
    }
}