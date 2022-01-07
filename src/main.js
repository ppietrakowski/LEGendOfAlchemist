import BootScene from './BootScene'


let game = new Phaser.Game({
    type: Phaser.AUTO,
    scene: [new BootScene()],
    width: 800,
    height: 600,
    fps: {
        min: 40,
        target: 50
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: {y: 300},
            debug: false
        }
    }
});