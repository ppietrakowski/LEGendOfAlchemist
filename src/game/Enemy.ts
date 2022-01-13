import Character from './Character'
import Phaser from 'phaser'
import Player from './Player';
import EnemyController from './EnemyController';

export default class Enemy extends Character {
    constructor(sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        super(sprite);

        this.addComponent(new EnemyController(player));
        
        
    }

    start(scene: Phaser.Scene): void {
        scene.anims.create({
            key: 'enemy',
            frameRate: -5,
            frames: scene.anims.generateFrameNumbers('enemy', {start: 0, end: 0})
        })
    }

    makeDead(): void {
        this.sprite.destroy();
    }
    isDead(): boolean {
        return !this.attribute.isAlive();
    }
}