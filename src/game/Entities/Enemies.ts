import Phaser from 'phaser'


export const Enemies = [
    "shark",
    "hawk"
];

export function addEnemyAnimation(enemy: Phaser.Physics.Arcade.Sprite, enemyName: string) {
    let frameName = enemyName;
    let anims = enemy.anims;

    anims.create(
        {
            key: frameName + '-stay',
            frames: anims.generateFrameNumbers(frameName, { start: 0, end: 0 }),
            frameRate: 5
        });

    anims.create(
        {
            key: frameName + '-front-run',
            frames: anims.generateFrameNumbers(frameName, { start: 0, end: 3 }),
            frameRate: 5
        });

    anims.create(
        {
            key: frameName + '-right-run',
            frames: anims.generateFrameNumbers(frameName, { start: 8, end: 11 }),
            repeat: -1,
            frameRate: 5
        });

    anims.create(
        {
            key: frameName + '-left-run',
            frames: anims.generateFrameNumbers(frameName, { start: 12, end: 15 }),
            repeat: -1,
            frameRate: 5
        });

    anims.create(
        {
            key: frameName + '-back-run',
            frames: anims.generateFrameNumbers(frameName, { start: 4, end: 7 }),
            repeat: -1,
            frameRate: 5
        });
}

export function loadAllEnemies(scene: Phaser.Scene): void {
    for (let enemy of Enemies) {
        scene.load.spritesheet(enemy, 'assets/enemies/' + enemy + '.png', { frameWidth: 32, frameHeight: 32 })
    }
}

export function getRandomEnemyKey(): string {
    let index = Math.round(Math.random() * (Enemies.length - 1))
    return Enemies[index]
}
