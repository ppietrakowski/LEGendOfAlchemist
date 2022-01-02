/// <reference path="../phaser/phaser.d.ts"/>

export default class BootScene extends Phaser.Scene {
    platforms: Phaser.GameObjects.Group

    constructor() {
        super({key: 'beginScene'});
        this.platforms = null;
    }

    preload(): void {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', {frameWidth: 32, frameHeight: 48});
    }

    create(): void {
        this.add.image(400, 300, 'sky');
        this.add.image(400, 300, 'star');
        this.platforms = this.physics.add.staticGroup()
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');
    }
    
}