import Phaser from "phaser"
import { Inventory, InventoryStartEvent } from '../Components/Inventory'
import Item from "../Entities/Item"
import Player from "../Entities/Player"
import InventoryContainer from './InventoryContainer'

export default abstract class InventoryBase extends Phaser.Scene {
    protected inventory: Inventory
    protected container: InventoryContainer
    static readonly INVENTORY_CLOSED = "InventoryClosed"

    constructor(key: string) {
        super({ key })
    }

    preload(): void {
        this.container = new InventoryContainer(this, 50, 60, this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0), this.add.text(20, 60, 'Inventory', { fontFamily: 'pixellari' }))

        this.container.setScrollFactor(0)

        this.game.events.once(Player.INVENTORY_START, this.assignInventory, this)
    }

    protected setupItem(item: Item): void {
        if (item.image.texture.key !== 'teleport-stone')
            this.makeItemUsableInInventory(item)

        item.image.setInteractive({ pixelPerfect: true })
    }

    protected addElement(item: Item): void {
        const {image} = item

        item.image = this.add.sprite(item.image.x, item.image.y, item.image.texture.key)
        item.image.name = image.texture.key + "-" + Math.round(image.x) + "-" + Math.round(image.y)
        image.destroy()
    }

    private makeItemUsableInInventory(item: Item) {
        const {owner} = this.inventory
        item.image.once(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => {
            let inventory = owner.getComponent<Inventory>(Inventory.COMPONENT_NAME)

            item.used(owner)
            inventory.deleteItem(item)
        });
    }

    private assignInventory(inventoryEvent: InventoryStartEvent) {
        this.inventory = inventoryEvent.inventory
        this.inventory.on(Inventory.ADDED_ITEM, this.addElement, this)
        this.inventory.on(Inventory.INVENTORY_FULL, () => console.log("Inventory full !"))
    }
}