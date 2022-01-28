import Phaser from 'phaser'

export default class Crafting extends Phaser.Scene {
    constructor() {
        super('Crafting-scene');
    }

    preload(): void {
        this.load.image('item-background', 'assets/temp/item-background.png');
    }

    create(): void {
        
    }

    update(time: number, delta: number): void {
        
    }
}