import Phaser from 'phaser'
import Attribute from '../Components/Attribute'
import EnemyController from '../Components/EnemyController'
import HealthBar from '../Components/HealthBar'
import { Inventory } from '../Components/Inventory'
import Enemy from './Enemy'
import Player from './Player'
import TeleportStone from './TeleportStone'


export default class Boss extends Enemy {
    constructor(scene: Phaser.Scene, x: number, y: number, texture: string | Phaser.Textures.Texture, name: string, maxRange: number, player: Player, public readonly teleportIndex: number) {
        super(scene, x, y, texture, name, maxRange, player)
        // make it significant tougher than default enemy
        this.attributes.hp.value *= 5.2
        this.attributes.strength.value *= 5.2
        this.setScale(1.5, 1.5)
    }

    start(_scene: Phaser.Scene): void {
    }

    protected killed(): void {
        const player = this.getComponent<EnemyController>('enemy-movement').target
        const inventory = player.getComponent<Inventory>('inventory')

        const teleportStone = new TeleportStone(null, player.scene.add.image(this.x, this.y, 'teleport-stone'), this.teleportIndex)
        teleportStone.image.name = 'teleport-stone-' + this.teleportIndex

        // add event to throw item in place of enemey
        teleportStone.image.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            inventory.addItem(teleportStone)
            teleportStone.image.name = 'teleport-stone-' + this.teleportIndex
        });

        this.destroy()
    }
}