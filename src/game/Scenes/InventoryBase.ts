import Phaser from 'phaser'
import { Inventory, InventoryStartEvent } from '../Components/Inventory'
import { Item, ItemContainer } from '../Entities/Item'
import Player from '../Entities/Player'
import InventoryContainer from './InventoryContainer'
import { addInformationText } from './SceneUtils'

export default abstract class InventoryBase extends Phaser.Scene {
    protected _inventory: ItemContainer
    protected _container: InventoryContainer
    static readonly INVENTORY_CLOSED = Symbol('InventoryClosed')
    static readonly DATA_ITEM_KEY = 'info'

    constructor(key: string) {
        super({ key })
    }

    private addElement(item: Item): void {

        if (!this._inventory.hasItem(item.name)) {
            const image = this.add.image(0, 0, item.imageKey)

            image.setData(InventoryBase.DATA_ITEM_KEY, item)

            this.setupItem(image)
            image.setScrollFactor(0)
        }
    }

    private itemRemoved(item: Item) {
        let itemImage: Phaser.GameObjects.Image

        this._container.iterate((v: Phaser.GameObjects.GameObject) => {
            if (v.getData('info') === item) {
                itemImage = v as Phaser.GameObjects.Image
            }
        })

        this._container.deleteChild(item.name)
        itemImage.destroy()
    }

    private assignInventory(inventoryEvent: InventoryStartEvent) {
        this._inventory = inventoryEvent.inventory
        this._inventory.events.on(Inventory.ADDED_ITEM, this.addElement, this)
        this._inventory.events.on(Inventory.INVENTORY_FULL, () => addInformationText(this._inventory.owner.scene,
            this._inventory.owner.x, this._inventory.owner.y, 'I\'m overburden', () => null))
        this._inventory.events.on(Inventory.DELETED_ITEM, this.itemRemoved, this)
    }

    preload(): void {
        this._container = new InventoryContainer(this, 50, 60,
            this.add.sprite(0, 60, 'inventory-background').setOrigin(0, 0),
            this.add.text(20, 60, 'Inventory', { fontFamily: 'pixellari' }))

        this._container.setScrollFactor(0)

        this.game.events.once(Player.INVENTORY_START, this.assignInventory, this)
    }

    private itemUsed(item: Phaser.GameObjects.Image) {
        const itemState = item.data.get(InventoryBase.DATA_ITEM_KEY) as Item

        if (itemState.used) {
            itemState.used(itemState, this._inventory.owner)

            this._inventory.deleteItem(itemState)
        }
    }

    private setupItem(item: Phaser.GameObjects.Image): void {
        if (!item.name.includes('TeleportStone'))
            item.on(Phaser.Input.Events.GAMEOBJECT_POINTER_DOWN, () => this.itemUsed(item))

        item.setInteractive({ pixelPerfect: true })

        // add it to container to easier track it's state
        this._container.addItemInfo(item)
        this._container.add(item)
        this._container.updatePosition()
    }
}