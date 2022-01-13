
import Player from './Player'
import Phaser from 'phaser';

export default class GameScene extends Phaser.Scene {

    player: Player;
    constructor() {
        super('GameScene');
    }

    preload(): void {
        this.load.image('background', 'assets/temp/background.png');
        this.load.spritesheet('player', 'assets/player.png', { frameWidth: 32, frameHeight: 64 });
    }

    create(): void {
        this.add.image(0, 0, 'background');
        this.player = new Player(this.physics.add.sprite(100, 100, 'player'));;
    }

    update(time: number, delta: number): void {
        this.player.update(delta / 1000);
    }
}