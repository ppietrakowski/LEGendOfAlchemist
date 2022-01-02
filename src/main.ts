
/// <reference path="../phaser/phaser.d.ts"/>
import BootScene from './BootScene'

let game: Phaser.Game = new Phaser.Game({
    type: Phaser.AUTO,
    scene: [new BootScene()],
    width: 800,
    height: 600,
    fps: {
        min: 40,
        target: 50
    }
});