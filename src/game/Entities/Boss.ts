import Phaser from 'phaser';
import EnemyController from '../Components/EnemyController';
import HealthBar from '../Components/HealthBar';
import Enemy from './Enemy';
import Player from './Player';
import TeleportStone from './TeleportStone';


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