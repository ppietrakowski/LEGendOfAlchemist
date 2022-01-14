import Character from './Character'
import Phaser from 'phaser'
import Player from './Player';
import EnemyController from './EnemyController';

export default class Enemy extends Character {
    constructor(sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        super(sprite);
        this.start(sprite.scene);
        this.addComponent(new EnemyController(player));
    }

    start(scene: Phaser.Scene): void {
        scene.anims.create({
            key: 'enemy-stay',
            frameRate: 5,
            frames: scene.anims.generateFrameNumbers('enemy', {start: 0, end: 0})
        })

        scene.anims.create({
            key: 'enemy-attack',
            frameRate: 5,
            repeat: -1,
            frames: scene.anims.generateFrameNumbers('enemy', {start: 0, end: 3})
        })
    }

    makeDead(): void {
        this.sprite.destroy();
    }
}