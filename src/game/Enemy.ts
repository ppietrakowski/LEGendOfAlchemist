import Character from './Character'
import Phaser from 'phaser'

export default class Enemy extends Character {
    constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        super(sprite);
    }

    start(scene: Phaser.Scene): void {
        
    }


    makeDead(): void {
        this.sprite.destroy();
    }
    isDead(): boolean {
        return !this.attribute.isAlive();
    }
}