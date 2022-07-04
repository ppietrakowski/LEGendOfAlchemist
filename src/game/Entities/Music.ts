import Phaser from 'phaser';


export const Music = [
    "roam1",
    "roam2",
    "attack"
];


export function loadMusic(scene: Phaser.Scene): void {
    for (let i of Music)
        scene.load.audio(i, 'assets/sounds/' + i + '.mp3')
}