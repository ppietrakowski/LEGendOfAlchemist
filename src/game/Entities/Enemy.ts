import Phaser from 'phaser'

import Character from './Character'
import Player from './Player';

import EnemyController from '../Components/EnemyController';
import HealthBar from '../Components/HealthBar';

export default class Enemy extends Character {
    name: string;

    constructor(name: string, maxRange: number, sprite: Phaser.Physics.Arcade.Sprite, player: Player) {
        super(sprite);
        this.name = name;
        this.start(sprite.scene);
        this.addComponent(new EnemyController(player, maxRange));
        this.addComponent(new HealthBar(player, 100));
    }

    start(scene: Phaser.Scene): void {
        let anims = this.sprite.anims;
        let frameName = this.name;

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

    makeDead(): void {
        this.sprite.destroy();
    }
}