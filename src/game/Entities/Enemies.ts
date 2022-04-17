import Phaser from 'phaser';


export const Enemies = [
    "shark",
    "hawk",
    "turtle"
];

export function generateFrame(anims: Phaser.Animations.AnimationManager, frameName: string, animName: string, start: number, end: number): Phaser.Animations.Animation {
    let frame = anims.create(
        {
            key: `${frameName}-${animName}`,
            frames: anims.generateFrameNumbers(frameName, { start: start, end: end }),
            frameRate: 4
        })
    
    return frame === false ? null : frame
}

export function addAnimation(anims: Phaser.Animations.AnimationManager, textureName: string) {
    let frameName = textureName

    generateFrame(anims, frameName, 'stay', 0, 0)

    generateFrame(anims, frameName, 'front-run', 0, 3).repeat = -1
    generateFrame(anims, frameName, 'right-run', 8, 11).repeat = -1
    generateFrame(anims, frameName, 'left-run', 12, 15).repeat = -1
    generateFrame(anims, frameName, 'back-run', 4, 7).repeat = -1
}

export function loadAllEnemies(scene: Phaser.Scene): void {
    for (let enemy of Enemies)
        scene.load.spritesheet(enemy, 'assets/enemies/' + enemy + '.png', { frameWidth: 32, frameHeight: 32 })
}

export function getRandomEnemyKey(): string {
    let index = Math.round(Math.random() * (Enemies.length - 1))
    return Enemies[index]
}
