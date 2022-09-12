import { Item } from './Item'
import Player from './Player'


export class ItemImage {

    constructor(public item: Item, public image: Phaser.GameObjects.Image) {

        image.setInteractive({ pixelPerfect: true })
    }

    giveToPlayer() {
        const player = this.image.scene.children.getByName('player') as Player
        player.inventory.addItem(this.item)
        this.image.destroy()

        // activate this for gc
        this.image = null
        this.item = null
    }
}

/**
 * This object is a mediator between 
 */
export class ItemSpawner {

    constructor(private _scene: Phaser.Scene) {
    }

    addItem(x: number, y: number, item: Item) {
        return new ItemImage(item, this._scene.add.image(x, y, item.imageKey))
    }
}