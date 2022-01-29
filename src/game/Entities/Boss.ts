import Phaser from 'phaser'

import Player from './Player';
import Enemy from './Enemy';

function addEnemyAnimation(enemy: Phaser.Physics.Arcade.Sprite, enemyName: string) {
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

export default class Boss extends Enemy {
    name: string;

    constructor(name: string, maxRange: number, sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        super(name, maxRange, sprite, player);
        this.attributes.hp *= 5.2;
        this.attributes.strength *= 5.2;
    }

    start(scene: Phaser.Scene): void {
    }
}