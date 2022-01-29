import Phaser from 'phaser'

import Player from './Player';
import Enemy from './Enemy';
import HealthBar from '../Components/HealthBar';
import Ingredient from './Ingredient';
import { getItemWithRandomEffect } from './Items';
import EnemyController from '../Components/EnemyController';
import TeleportStone from './TeleportStone';

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
    teleportIndex: number;

    constructor(name: string, maxRange: number, sprite: Phaser.Physics.Arcade.Sprite, player: Player, teleportIndex: number) {
        super(name, maxRange, sprite, player);
        this.attributes.hp *= 5.2;
        this.attributes.strength *= 5.2;
        this.sprite.setScale(1.5, 1.5);
        this.teleportIndex = teleportIndex;
    }

    start(scene: Phaser.Scene): void {
    }

    makeDead(): void {
        let player = this.getComponent<EnemyController>('enemy-movement').target;
        let teleportStone = new TeleportStone(null, player.sprite.scene.add.sprite(this.sprite.x, this.sprite.y, 'teleport-stone'), this.teleportIndex);
        teleportStone.sprite.name = 'teleport-stone-' + this.teleportIndex;
        this.getComponent<HealthBar>('hp-bar').hide();

        // add event to throw item in place of enemey
        teleportStone.sprite.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, (pointer: Phaser.Input.Pointer) => {
            player.inventory.addItem(teleportStone);
            teleportStone.sprite.name = 'teleport-stone-' + this.teleportIndex;
        });

        this.sprite.destroy();
    }
}