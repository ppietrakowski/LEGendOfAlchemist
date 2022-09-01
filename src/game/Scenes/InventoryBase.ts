import Phaser from "phaser"
import { Inventory, InventoryStartEvent } from '../Components/Inventory'
import { Item } from "../Entities/Item"
import Player from "../Entities/Player"
import InventoryContainer from './InventoryContainer'

export default abstract class InventoryBase extends Phaser.Scene {
    protected inventory: Inventory
    protected container: InventoryContainer
    static readonly INVENTORY_CLOSED = 'InventoryClosed'
    static readonly DATA_ITEM_KEY = 'info'

    constructor(key: string) {
        super({ key })
    }

    preload(): void {
        this.container = new InventoryContainer(this, 50, 60,
            this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0),
            this.add.text(20, 60, 'Inventory', { fontFamily: 'pixellari' }))

        this.container.setScrollFactor(0)

        this.game.events.once(Player.INVENTORY_START, this.assignInventory, this)
    }

    private setupItem(item: Phaser.GameObjects.Image): void {
        if (!item.name.includes('TeleportStone'))
            item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.itemUsed(item))

        item.setInteractive({ pixelPerfect: true })

        // add it to container to easier track it's state
        this.container.addItemInfo(item)
        this.container.add(item)
        this.container.updatePosition()
    }

    private addElement(item: Item): void {

        if (!this.inventory.hasItem(item.name)) {
            const image = this.add.image(0, 0, item.imageKey)

            image.setData(InventoryBase.DATA_ITEM_KEY, item)

            this.setupItem(image)
            image.setScrollFactor(0)
        }
    }

    private itemUsed(item: Phaser.GameObjects.Image) {
        let itemState = item.data.get(InventoryBase.DATA_ITEM_KEY) as Item

        if (itemState.used) {
            itemState.used(itemState, this.inventory.owner)

            this.inventory.deleteItem(itemState)
        }
    }

    private itemRemoved(item: Item) {
        let itemImage: Phaser.GameObjects.Image;

        this.container.iterate((v: Phaser.GameObjects.GameObject) => {
            if (v.getData('info') === item)  {
                itemImage = v as Phaser.GameObjects.Image
            }
        })

        this.container.deleteChild(item.name)
        itemImage.destroy()
    }

    private assignInventory(inventoryEvent: InventoryStartEvent) {
        this.inventory = inventoryEvent.inventory
        this.inventory.on(Inventory.ADDED_ITEM, this.addElement, this)
        this.inventory.on(Inventory.INVENTORY_FULL, () => console.log("Inventory full !"))
        this.inventory.on(Inventory.DELETED_ITEM, this.itemRemoved, this)
    }
}