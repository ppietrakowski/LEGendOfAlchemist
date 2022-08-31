import { Item } from "./Item";
import Player from "./Player";


export class ItemImage {

    constructor(public item: Item, public image: Phaser.GameObjects.Image) {

        image.setInteractive({pixelPerfect: true})

        this.image.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, this.give, this)
    }

    private give() {
        let player = this.image.scene.data.get('player') as Player
        player.inventory.addItem(this.item)
        this.image.destroy(true)

        // activate this for gc
        this.image = null
        this.item = null
    }
}

/**
 * This object is a mediator between 
 */
export class ItemSpawner {

    constructor(private scene: Phaser.Scene) {

    }

    addItem(x: number, y: number, item: Item) {
        return new ItemImage(item, this.scene.add.image(x, y, item.imageKey))
    }
}