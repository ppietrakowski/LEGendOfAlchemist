import Phaser from "phaser"
import {Inventory, InventoryStartEvent} from '../Components/Inventory'
import Item from "../Entities/Item"
import InventoryContainer from './InventoryContainer'

export default abstract class InventoryBase extends Phaser.Scene {
    protected inventory: Inventory
    protected container: InventoryContainer
    static readonly InventoryClosed = "InventoryClosed"
    
    constructor(key: string) {
        super({ key })
    }

    preload(): void {
        this.container = new InventoryContainer(this, 50, 60, this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0), this.add.text(20, 60, 'Inventory', { fontFamily: 'pixellari' }))

        this.container.setScrollFactor(0)

        this.game.events.on(Inventory.InventoryStart, this.assignInventory, this)
    }

    protected setupItem(item: Item): void {
        if (item.image.texture.key !== 'teleport-stone')
            this.useItemAsUsable(item)
            
        item.image.setInteractive({ pixelPerfect: true })
    }

    protected addElement(item: Item): void {
        let sprite = item.image
        
        item.image = this.add.sprite(item.image.x, item.image.y, item.image.texture.key)
        sprite.destroy()

        item.image.name = sprite.texture.key + "-" + Math.round(sprite.x) + "-" + Math.round(sprite.y)
    }

    private useItemAsUsable(item: Item) {
        const owner = this.inventory.currentOwner
        item.image.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            let inventory = owner.getComponent<Inventory>('inventory')

            item.used(owner)
            inventory.deleteItem(item)
        });
    }

    private assignInventory(inventoryEvent: InventoryStartEvent) {
        if (inventoryEvent.owner.name === 'player') {
            this.inventory = inventoryEvent.inventory
            this.inventory.on(Inventory.AddedItem, this.addElement, this)
            this.inventory.on(Inventory.InventoryFull, () => console.log("Inventory full !"))
            this.game.events.off(Inventory.InventoryStart, this.assignInventory)
        }
    }
}