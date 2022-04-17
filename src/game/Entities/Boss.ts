import Phaser from 'phaser'
import EnemyController from '../Components/EnemyController'
import HealthBar from '../Components/HealthBar'
import Enemy from './Enemy'
import Player from './Player'
import TeleportStone from './TeleportStone'


export default class Boss extends Enemy {
    name: string
    teleportIndex: number

    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, frame: string | number, name: string, maxRange: number, player: Player, teleportIndex: number) {
        super(scene, x, y, texture, frame, name, maxRange, player)
        // make it significant tougher than default enemy
        this.attributes.hp *= 5.2
        this.attributes.strength *= 5.2
        this.setScale(1.5, 1.5)
        this.teleportIndex = teleportIndex
    }

    start(_scene: Phaser.Scene): void {
    }

    makeDead(): void {
        let player = this.getComponent<EnemyController>('enemy-movement').target
        let teleportStone = new TeleportStone(null, player.scene.add.sprite(this.x, this.y, 'teleport-stone'), this.teleportIndex)
        teleportStone.sprite.name = 'teleport-stone-' + this.teleportIndex
        this.getComponent<HealthBar>('hp-bar').hide()

        // add event to throw item in place of enemey
        teleportStone.sprite.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            player.inventory.addItem(teleportStone)
            teleportStone.sprite.name = 'teleport-stone-' + this.teleportIndex
        });

        this.destroy()
    }
}