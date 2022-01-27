import Phaser from 'phaser';

export default class BootScene extends Phaser.Scene {

    constructor() {
        super({ key: 'BeginScene' });
    }

    create(): void {
        this.time.addEvent({
            delay: 0,
            callback: () => this.game.scene.start('MainMenu')
        });
    }
}