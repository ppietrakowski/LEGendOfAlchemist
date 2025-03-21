import Phaser from 'phaser'
import Enemy from './Enemy'
import { ItemSpawner } from './ItemSpawner'
import Player from './Player'
import TeleportStone from './TeleportStone'


export default class Boss extends Enemy {
    constructor(scene: Phaser.Scene, x: number, y: number,
        texture: string | Phaser.Textures.Texture, name: string,
        maxRange: number, player: Player, public readonly teleportIndex: number) {

        super(scene, x, y, texture, name, maxRange, player)
        // make it significant tougher than default enemy
        this.attributes.changeHealth(this.attributes.health * 5.2)
        this.attributes.strength.value *= 5.2
        this.setScale(1.5, 1.5)
    }

    protected killed(): void {
        const itemSpawner = this.scene.data.get('spawner') as ItemSpawner
        
        itemSpawner.addItem(this.x, this.y, new TeleportStone('teleport-stone', this.teleportIndex))

        this.destroy()
    }
}