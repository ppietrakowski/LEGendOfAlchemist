import Phaser from 'phaser'


export const Enemies = [
    "shark",
    "hawk"
];

export function loadAllEnemies(scene: Phaser.Scene): void {
    for (let enemy of Enemies) {
        scene.load.spritesheet(enemy, 'assets/enemies/' + enemy + '.png', {frameWidth: 32, frameHeight: 32})
    }
}

export function getRandomEnemyKey(): string {
    let index = Math.round(Math.random() * (Enemies.length - 1))
    return Enemies[index]
}
